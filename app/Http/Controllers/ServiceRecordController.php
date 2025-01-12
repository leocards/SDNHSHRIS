<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Http\Requests\ServiceRecordRequest;
use App\Models\ServiceRecord;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $sr = null;

        $sr = ServiceRecord::when($role == "hr", function ($query) {
                $query->with('user');
            })
            ->when($role !== "hr", function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->when($type != "All", function ($query) use ($request, $type) {
                $query->where('type', strtolower($type));
            })
            ->where('status', $status)
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
                    $credits = $to ? ($from->diffInDays($to) + 1) : ($request->session == "halfday" ? 0.5 : 1);

                    $details = collect([
                        'venue' => $sr['venue'],
                        'name' => $sr['name'],
                        'organizer' => $sr['organizer'],
                        'path' => Str::replace('public', '/storage', $destinationPath),
                        'filename' => $file->originalfilename,
                        'from' => $this->parseDate($sr['from']),
                        'to' => $sr['to'] ? $this->parseDate($sr['to']) : null,
                        'credits' => $credits,
                        'session' => $request->session,
                        'remainingcredits' => $credits,
                        'creditstatus' => "pending"
                    ]);

                    ServiceRecord::create([
                        'user_id' => $request->user()->id,
                        'type' => 'certificate',
                        'details' => $details->toArray(),
                    ]);
                }
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
            'from' => 'required|date',
            'to' => 'nullable|date',
            'numofhours' => ['required', 'regex:/^[0-9]+$/'],
        ], [
            'numofhours.required' => 'The number of hours field is required',
            'numofhours.regex' => 'The number of hours must be numeric in value.'
        ]);

        DB::beginTransaction();
        try {

            $memofile = $request->user()->temporary()->find($request->memofileid);
            $coafile = $request->user()->temporary()->find($request->coafileid);
            $dtrfile = $request->user()->temporary()->find($request->dtrfileid);

            $memofilepath = Str::replace('public/temporary', 'public/certificate', $memofile->path);
            $coafilepath = Str::replace('public/temporary', 'public/certificate', $coafile->path);
            $dtrfilepath = Str::replace('public/temporary', 'public/certificate', $dtrfile->path);

            Storage::move($memofile->path, $memofilepath);
            Storage::move($coafile->path, $coafilepath);
            Storage::move($dtrfile->path, $dtrfilepath);

            $from = Carbon::parse($request->from);
            $to = $request->from ? Carbon::parse($request->to) : null;
            $credits = $request->session == "halfday" ? 0.5 : ($to ? ($from->diffInDays($to) + 1) : 1);

            ServiceRecord::create([
                'user_id' => $request->user()->id,
                'type' => 'coc',
                'details' => collect([
                    'name' => $request->name,
                    'coa' => Str::replace('public', '/storage', $memofilepath),
                    'dtr' => Str::replace('public', '/storage', $coafilepath),
                    'memo' => Str::replace('public', '/storage', $dtrfilepath),
                    'from' => $this->parseDate($request->from),
                    'to' => $request->to?$this->parseDate($request->to):null,
                    'numofhours' => $request->numofhours,
                    'session' => $request->session,
                    'credits' => $credits,
                    'remainingcredits' => $credits,
                    'creditstatus' => "pending",
                ])
            ]);

            DB::commit();

            return $this->returnResponse('COC upload','Successfully uploaded COC','success');
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->returnResponse('COC upload',$th->getMessage().'Failed to upload COC','error');
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
            $sr->load(['user']);

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

                $personnel = User::find($sr->user_id);

                if($personnel->role === "teaching" && $request->response === "approved") {
                    $personnel->credits = floatval($sr->details['credits']) + $personnel->credits;
                    // $sr->details['creditstatus'] = "used";
                    // $sr->details['remainingcredits'] = 0;

                    $personnel->save();
                }

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
                'message' => 'Failed to process respond!',
                'status' => 'error'
            ]);
        }
    }
}
