<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Http\Requests\ServiceRecordRequest;
use App\Models\ServiceRecord;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ServiceRecordController extends Controller
{
    use DateParserTrait, ResponseTrait;

    public function index(Request $request)
    {
        $role = $request->user()->role;

        $status = $request->query('status') ?? "pending";
        $type = $request->query('type') ?? "All";
        $search = $request->query('search');

        $sr = null;

        $sr = ServiceRecord::when($role == "hr", function ($query) use ($status) {
            $query->with(['user' => function ($query) use ($status) {
                $query->when($status !== "pending", function ($query) {
                    $query->withoutGlobalScopes();
                });
            }]);
        })->whereHas('user', function ($query) use ($status) {
            $query->when($status !== "pending", function ($query) {
                $query->withoutGlobalScopes();
            });
        })
            ->when($role !== "hr", function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->when($type != "All", function ($query) use ($request, $type) {
                $query->where('type', strtolower($type));
            })
            ->where('status', $status)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('type', 'certificate')
                        ->where(function ($query) use ($search) {
                            $query->where('details->venue', 'LIKE', "%{$search}%")
                                ->orWhere('details->name', 'LIKE', "%{$search}%")
                                ->orWhere('details->organizer', 'LIKE', "%{$search}%")
                                ->orWhere('details->filename', 'LIKE', "%{$search}%");
                        })
                        ->orWhere('type', 'coc')
                        ->where('details->name', 'LIKE', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($this->page);

        if ($request->expectsJson()) {
            return response()->json($sr);
        }

        if ($role === "hr") {

            return Inertia::render('Myapproval/ServiceRecord/ServiceRecord', [
                'sr' => Inertia::defer(fn() => $sr)
            ]);
        }

        return Inertia::render('ServiceRecord/ServiceRecord', [
            'sr' => Inertia::defer(fn() => $sr)
        ]);
    }

    public function store(ServiceRecordRequest $request)
    {
        DB::beginTransaction();

        $certificatesCount = count($request->sr);

        try {

            foreach ($request->sr as $sr) {
                $file = $request->user()->temporary()->find($sr['fileid']);
                $destinationPath = Str::replace('public/temporary', 'public/certificate', $file->path);
                $move = Storage::move($file->path, $destinationPath);

                if (!$move) {
                    continue;
                } else {
                    $from = Carbon::parse($sr['from']);
                    $to = $sr['to'] ? Carbon::parse($sr['to']) : null;
                    $credits = $to ? $this->countWeekdays($from, $to, $sr['session']) : ($sr['session'] == "halfday" ? 0.5 : 1);

                    $details = collect([
                        'venue' => $sr['venue'],
                        'name' => $sr['name'],
                        'organizer' => $sr['organizer'],
                        'path' => Str::replace('public', '/storage', $destinationPath),
                        'filename' => $file->originalfilename,
                        'from' => $this->parseDate($sr['from']),
                        'to' => $sr['to'] ? Carbon::parse($sr['to'])->format('Y-m-d') : null,
                        'credits' => $credits,
                        'session' => $sr['session'],
                        'remainingcredits' => $credits,
                        'creditstatus' => "pending"
                    ]);

                    ServiceRecord::create([
                        'user_id' => $request->user()->id,
                        'type' => 'certificate',
                        'details' => $details->toArray(),
                    ]);
                }

                $file->delete();
            }

            DB::commit();

            return redirect()->back()->with(['title' => 'Certificate', 'message' => $certificatesCount . ' certificate added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Certificate', 'message' => $th->getMessage() . 'Failed to add certificate!', 'status' => 'error']);
        }
    }

    public function storeCOC(Request $request)
    {
        $request->validate([
            'coc.*.from' => 'required|date',
            'coc.*.to' => 'nullable|date',
            'coc.*.session' => 'in:halfday,fullday,weekdays',
            'coc.*.numofhours' => ['required_if:session,halfday', 'nullable', 'regex:/^[0-9]+$/'],
        ], [
            'coc.*.numofhours.required' => 'The number of hours field is required',
            'coc.*.numofhours.regex' => 'The number of hours must be numeric in value.'
        ]);

        DB::beginTransaction();
        try {
            $movedFiles = [];

            foreach ($request->coc as $value) {
                $memofile = $request->user()->temporary()->find($value['memofileid']);
                $coafile = $request->user()->temporary()->find($value['coafileid']);
                $dtrfile = $request->user()->temporary()->find($value['dtrfileid']);

                $memofilepath = Str::replace('public/temporary', 'public/certificate', $memofile->path);
                $coafilepath = Str::replace('public/temporary', 'public/certificate', $coafile->path);
                $dtrfilepath = Str::replace('public/temporary', 'public/certificate', $dtrfile->path);

                Storage::move($memofile->path, $memofilepath);
                Storage::move($coafile->path, $coafilepath);
                Storage::move($dtrfile->path, $dtrfilepath);

                $movedFiles[] = [$memofile->path, $memofilepath];
                $movedFiles[] = [$coafile->path, $coafilepath];
                $movedFiles[] = [$dtrfile->path, $dtrfilepath];

                $from = Carbon::parse($value['from']);
                $to = $value['to'] ? Carbon::parse($value['to']) : null;
                $credits = $value['session'] == "halfday" ? 0.5 : ($to ? $this->countWeekdays($from, $to, $value['session']) : 1);

                ServiceRecord::create([
                    'user_id' => $request->user()->id,
                    'type' => 'coc',
                    'details' => collect([
                        'name' => $value['name'],
                        'coa' => Str::replace('public', '/storage', $memofilepath),
                        'dtr' => Str::replace('public', '/storage', $coafilepath),
                        'memo' => Str::replace('public', '/storage', $dtrfilepath),
                        'from' => $this->parseDate($value['from']),
                        'to' => $value['to'] ? Carbon::parse($value['to'])->format('Y-m-d') : null,
                        'numofhours' => $value['numofhours'],
                        'session' => $value['session'],
                        'credits' => $credits,
                        'remainingcredits' => $credits,
                        'creditstatus' => "pending",
                    ])
                ]);

                $memofile->delete();
                $coafile->delete();
                $dtrfile->delete();
            }

            DB::commit();

            return $this->returnResponse('COC upload', 'Successfully uploaded COC', 'success');
        } catch (\Throwable $th) {
            DB::rollBack();

            foreach ($movedFiles as [$originalPath, $newPath]) {
                if (Storage::exists($newPath)) {
                    Storage::move($newPath, $originalPath);
                }
            }

            return $this->returnResponse('COC upload', $th->getMessage() . 'Failed to upload COC', 'error');
        }
    }

    public function storeTemporaryFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,jpeg,jpg,png|max:10240',
        ]);

        $path = null;

        try {
            $path = Storage::putFile('public/temporary', $request->file('file'));

            $temporaryfile = DB::transaction(function () use ($path, $request) {
                return $request->user()->temporary()->create([
                    "path" => $path,
                    "originalfilename" => $request->file('file')->getClientOriginalName()
                ]);
            });

            return response()->json(['file' => $temporaryfile, 'status' => 'success']);
        } catch (\Throwable $th) {
            if (isset($path)) {
                Storage::delete($path);
            }

            return response()->json(['message' => $th->getMessage(), 'status' => 'error']);
        }
    }

    public function view(ServiceRecord $sr)
    {
        try {
            $sr->load(['user' => fn($query) => $query->withoutGlobalScopes()]);

            return response()->json($sr);
        } catch (\Throwable $th) {
            return response()->json("Failed to load data.", 400);
        }
    }

    public function respond(Request $request, ServiceRecord $sr)
    {
        try {
            DB::transaction(function () use ($request, $sr) {
                $sr->status = $request->response;

                $personnel = User::withoutGlobalScopes()->find($sr->user_id);

                if ($personnel->role === "teaching" && $request->response === "approved") {
                    $personnel->credits = floatval(floatval($sr->details['credits']) + floatval($personnel->credits));

                    $personnel->save();
                }

                if ($personnel->status_updated_at)
                    $sr->saveQuietly();

                $sr->save();
            });

            return redirect()->back()->with([
                'title' => 'Certificate Response',
                'message' => 'Certificate has been marked as ' . $request->response . '!',
                'status' => 'success'
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with([
                'title' => 'Certificate Response',
                'message' => $th->getMessage(),
                'status' => 'error'
            ]);
        }
    }

    function countWeekdays($startDate, $endDate, $session)
    {
        $timezone = "Asia/Manila";

        $period = CarbonPeriod::create(
            Carbon::parse($startDate, $timezone),
            Carbon::parse($endDate, $timezone)->{$session === "weekdays" ? 'addDay' : 'endOfDay'}()
        );

        return $period
            ->filter(fn(Carbon $date) => $session === "weekdays" ? !$date->isWeekend() : true)
            ->count();
    }
}
