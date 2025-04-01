<?php

namespace App\Http\Controllers;

use App\Models\LocatorSlip;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class LocatorSlipController extends Controller
{
    use ResponseTrait;

    public function index(Request $request)
    {
        $role = Auth::user()->role;
        $status = $request->query('status') ?? "pending";
        $filter = $request->query('filter') ?? "all";
        $search = $request->query('search');
        $sort = $request->query('sort') ?? "date";
        $order = $request->query('order') ?? "desc";

        $path = 'LocatorSlip/LocatorSlip';

        if ($role === 'principal') {
            $path = 'Myapproval/' . $path;

            $locatorSlips = LocatorSlip::with(['user' => function ($query) use ($status) {
                $query->when($status !== "pending", fn($query) => $query->withoutGlobalScopes());
            }])
                ->when($filter != 'all', function ($query) use ($filter) {
                    $query->where('type', $filter);
                })
                ->where('status', $status)
                ->when(!empty($search), function ($query) use ($search) {
                    $query->where('purposeoftravel', 'LIKE', "%$search%")
                        ->orWhere('destination', 'LIKE', "%$search%")
                        ->orWhere('agenda->transaction', 'LIKE', "%$search%");
                })
                ->whereHas('user', function ($query) use ($search, $status) {
                    $query->when($status !== "pending", function ($query) {
                        $query->withoutGlobalScopes();
                    })
                        ->where(function ($query) use ($search) {
                            $query->where('firstname', 'LIKE', "%$search%")
                                ->orWhere('lastname', 'LIKE', "%$search%")
                                ->orWhere('middlename', 'LIKE', "%$search%");
                        });
                })
                ->when($sort == 'date',
                    fn($query) => $query->orderBy('created_at', $order),
                    fn($query) => $query->orderByRaw('(SELECT lastname FROM users WHERE users.id = locator_slips.user_id) '.strtoupper($order)))
                ->paginate($this->page);
        } else {
            $locatorSlips = LocatorSlip::where('status', $status)
                ->when($filter != 'all', function ($query) use ($filter) {
                    $query->where('type', $filter);
                })
                ->when(!empty($search), function ($query) use ($search) {
                    $query->where('purposeoftravel', 'LIKE', "%$search%")
                        ->orWhere('destination', 'LIKE', "%$search%")
                        ->orWhere('agenda->transaction', 'LIKE', "%$search%");
                })
                ->where('user_id', $request->user()->id)
                ->latest('updated_at')
                ->paginate($this->page);
        }

        if ($request->expectsJson()) {
            return response()->json($locatorSlips);
        }

        return Inertia::render($path, [
            'locatorslips' => $locatorSlips
        ]);
    }

    public function store(Request $request, ?LocatorSlip $lsid = null)
    {
        $request->validate([
            'purposeoftravel' => ['required'],
            'destination' => ['required'],
            'type' => ['required', 'in:business,time'],
            'agenda.date' => ['required', 'date'],
            'agenda.time' => [
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('type') === 'time' && empty($request->input('agenda.dateTo')) && empty($value)) {
                        $fail('The time field is required');
                    }
                }
            ],
            'memoid' => ['required_if:type,business']
        ], [
            'purposeoftravel.required' => 'The purpose of travel field is required.',
            'destination.required' => 'The destination field is required.',
            'type.required' => 'This field is required.',
            'type.in' => 'Please select official business or official time.',
            'agenda.date.required' => 'The date of event/transaction/meeting field is required.',
            'memoid.required_if' => 'The memo field is required.'
        ]);

        DB::beginTransaction();
        try {

            $filePath = '';

            if (!$lsid && $request->type === 'business') {
                $file = $request->user()->temporary()->find($request->memoid);
                $destinationPath = Str::replace('public/temporary', 'public/certificate', $file->path);
                $move = Storage::move($file->path, $destinationPath);

                if (!$move) throw new Exception('Failed to upload file.');

                $filePath = Str::replace('public', '/storage', $destinationPath);
            }

            LocatorSlip::create([
                'user_id' => $request->user()->id,
                'principal_id' => User::where('role', 'principal')->value('id'),
                'dateoffiling' => Carbon::now('Asia/Manila')->format('Y-m-d'),
                'purposeoftravel' => $request->purposeoftravel,
                'type' => $request->type,
                'destination' => $request->destination,
                'agenda' => $request->agenda,
                'memo' => $filePath
            ]);

            DB::commit();

            return $this->returnResponse('Locator Slip', 'You have successfully send locator slip.', 'success');
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->returnResponse('Locator Slip', $th->getMessage() . 'Failed send locator slip.', 'error');
        }
    }

    public function view(LocatorSlip $ls)
    {
        $ls->load([
            'user' => function ($query) {
                $query->withoutGlobalScopes();
            },
            'principal' => function ($query) {
                $query->withoutGlobalScopes();
            }
        ]);

        return Inertia::render('LocatorSlip/ViewLocatorSlip', [
            'locatorslip' => $ls
        ]);
    }

    public function approval(Request $request, LocatorSlip $ls)
    {
        try {
            $ls->status = $request->verdict . 'd';
            $ls->approved_at = Carbon::now('Asia/Manila')->format('Y-m-d');
            $ls->save();

            return $this->returnResponse('Locator Slip', 'Locator Slip of ' . $ls->user->full_name . ' has been ' . $request->verdict . 'd .', 'success');
        } catch (\Throwable $th) {
            return $this->returnResponse('Locator Slip', 'Failed to ' . $request->verdict . '.', 'error');
        }
    }
}
