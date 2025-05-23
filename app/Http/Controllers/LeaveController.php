<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Http\Requests\LeaveRequest;
use App\Models\Leave;
use App\Models\Medical;
use App\Models\SchoolYear;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class LeaveController extends Controller
{
    use DateParserTrait;

    public function index(Request $request)
    {
        $role = Auth::user()->role;
        $status = $request->query('status') ?? "pending";
        $search = $request->query('search') ?? "";

        // for principal
        $approvalLeave = $request->is('myapproval*');

        $leaves = Leave::when($role == "hr", function ($query) use ($status, $search) {
                $query->with(['user' => function ($query) use ($status) {
                    $query->when($status !== "pending", function ($query) {
                        $query->withoutGlobalScopes();
                    });
                }])
                ->where('hrstatus', $status)
                ->whereHas('user', function ($query) use ($search, $status) {
                    $query->when($status !== "pending", function ($query) {
                        $query->withoutGlobalScopes();
                    })
                    ->where(function ($query) use ($search) {
                        $query->where('firstname', 'LIKE', "%$search%")
                            ->orWhere('lastname', 'LIKE', "%$search%")
                            ->orWhere('middlename', 'LIKE', "%$search%");
                    });
                });
            })
            ->when($role == "principal" && $approvalLeave, function ($query) use ($status, $search) {
                $query->with(['user' => function ($query) {
                        $query->withoutGlobalScopes();
                    }])
                    ->whereHas('user', function ($query) use ($search) {
                        $query->withoutGlobalScopes()
                            ->where('firstname', 'LIKE', "%$search%")
                            ->orWhere('lastname', 'LIKE', "%$search%")
                            ->orWhere('middlename', 'LIKE', "%$search%");
                    })
                    ->whereNot('hrstatus', "pending")
                    ->where('principalstatus', $status);
            })
            ->when($role == "principal" && !$approvalLeave, function ($query) use ($status) {
                $query->where('user_id', Auth::id())->where('hrstatus', $status);
            })
            ->when($role != "hr" && $role != "principal", function ($query) use ($status) {
                $query->where('user_id', Auth::id())
                    ->where(function ($query) use ($status) {
                        $query->where('hrstatus', $status)
                        ->orWhere('principalstatus', $status);
                    });
            })
            ->latest()
            ->paginate($this->page);

        if ($request->expectsJson()) {
            return response()->json($leaves);
        }

        if ($role == "hr" || ($role == "principal" && $approvalLeave)) {
            return Inertia::render("Myapproval/Leave/Leave", [
                "leaves" => Inertia::defer(fn() => $leaves)
            ]);
        }

        return Inertia::render('Leave/Leave', [
            'leaves' => Inertia::defer(fn() => $leaves)
        ]);
    }

    public function apply()
    {
        // Get the current date and time
        $currentDateTime = Carbon::now();

        // Check if the current time is within working hours (8:00 AM to 5:00 PM)
        $isWithinHours = $currentDateTime->between(
            $currentDateTime->copy()->setTime(8, 0),  // Start: 8:00 AM
            $currentDateTime->copy()->setTime(17, 0)  // End: 5:00 PM
        );

        // Check if the current day is a weekday (Monday to Friday)
        $isWeekday = $currentDateTime->isWeekday();

        // temporary bypass
        return Inertia::render('Leave/ApplyLeave', []);

        // Final check: Is it during working hours and on a weekday?
        if ($isWithinHours && $isWeekday) {
            return Inertia::render('Leave/ApplyLeave', []);
        }

        return redirect()->back()->with(['title' => 'Application for Leave', 'message' => 'You can\'t apply for leave beyond working hours and weekdays.', 'status' => 'warning']);
    }

    public function store(LeaveRequest $request)
    {

        DB::beginTransaction();
        try {
            $auth = $request->user();
            $sy = SchoolYear::latest()->first();
            $gender = $auth->gender;

            $endOfClass = Carbon::parse($sy->end);
            if ($endOfClass->lessThanOrEqualTo(Carbon::now())) {
                throw new Exception('School year has ended, you can\'t send an application');
            }

            if ($gender == "male") {
                if ($request->type == "maternity" || $request->type == "slbw")
                    throw new Exception("You are not allowed to use this type of leave");
            }

            if ($gender == "female" && $request->type == "paternity") {
                throw new Exception("You are not allowed to use this type of leave");
            }

            if ($request->type !== "maternity" && $request->type !== "sick") {
                if ($request->type == "vacation" || $request->type == "mandatory") {
                    if (!$request->details && $request->from && !$this->verifyDateFiveDaysAhead($request->filingfrom, $request->from)) {
                        throw new Exception("You must send application 5 days ahead.", 1);
                    }
                }

                if ($auth->role == "teaching" && $request->type == "vacation")
                    throw new Exception("You are not allowed to use this type of leave.", 1);

                if ($auth->role == "teaching" && $auth->credits < (int) $request->daysapplied)
                    throw new Exception("You don't have enough credits.", 1);

                if ($auth->role !== "teaching" && $request->type === "spl") {
                    if ($auth->splcredits === 0) {
                        throw new Exception("You already used your credits for this type of leave.", 1);
                    } else if ($auth->splcredits < (int) $request->daysapplied) {
                        throw new Exception("You don't have enough credits.", 1);
                    }
                } else if ($auth->role !== "teaching") {
                    $servicecredits = $auth->serviceRecord()
                        ->where('status', 'approved')
                        ->where('details->creditstatus', 'pending')
                        ->get()
                        ->reduce(function ($carry, $sr) {
                            return $carry + $sr['credits'];
                        }, 0);

                    $totalcredits = $auth->credits + $servicecredits;

                    if ($totalcredits < (int) $request->daysapplied) {
                        throw new Exception("You don't have enough credits.", 1);
                    }
                }
            } else if ($request->type == "maternity") {
                if (Carbon::parse($auth->hiredate)->greaterThan(Carbon::now()->subMonths(3)->startOfMonth())) {
                    throw new Exception("You are not yet allowed to use this type of leave.", 1);
                }
            } else {
                // validation for sick leave
                $servicecredits = $auth->serviceRecord()
                        ->where('status', 'approved')
                        ->get()
                        ->reduce(function ($carry, $sr) {
                            return $carry + $sr->details['remainingcredits'];
                        }, 0);

                if ($auth->role === "non-teaching" || $auth->role === "principal") {
                    $credits = $auth->credits;

                    if (($servicecredits + $credits) < (int) $request->daysapplied) {
                        throw new Exception("You don't have enough credits.", 1);
                    }
                }/*  else {
                    if ($servicecredits < (int) $request->daysapplied) {
                        throw new Exception("You don't have enough credits.", 1);
                    }
                } */
            }

            $leave = Leave::create([
                "user_id" => $auth->id,
                "schoolyearid" => $sy->id,
                "filingfrom" => Carbon::parse($request->filingfrom)->format('Y-m-d'),
                "filingto" => /* $request->filingto ? Carbon::parse($request->filingto)->format('Y-m-d') : */ null,
                "salary" => $request->salary,
                "type" => $request->type,
                "others" => $request->others,
                "daysapplied" => (int) $request->daysapplied,
                "from" => $request->from ? Carbon::parse($request->from)->format('Y-m-d') : null,
                "to" => $request->to ? Carbon::parse($request->to)->format('Y-m-d') : null,
                "inclusivedates" => $request->inclusivedates,
                "commutation" => $request->commutation,
                "details" => $request->details,
                "detailsinput" => $request->detailsinput,
                "principalstatus" => $auth->role == "principal" ? "approved" : "pending",
                "principal_id" => $auth->role == "principal" ? $auth->id : User::where('role', 'principal')->value('id'),
                "hr_id" => User::where('role', 'hr')->value('id'),
            ]);

            if ($leave) {
                if ($leave->type === "maternity" && $request->medical) {
                    $file = $auth->temporary()->find($request->medical);
                    $destinationPath = Str::replace('public/temporary', 'public/medical', $file->path);
                    $move = Storage::move($file->path, $destinationPath);

                    if (!$move) {
                        throw new Exception("Unable to save medical.");
                    } else {
                        Medical::create([
                            'leave_id' => $leave->id,
                            'user_id' => $auth->id,
                            'path' => Str::replace('public', '/storage', $destinationPath)
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('leave')->with(['title' => 'Application for Leave', 'message' => 'You have successfully send an application for leave.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollback();

            return redirect()->back()->with(['title' => 'Application for Leave', 'message' => $th->getMessage(), 'status' => 'error']);
        }
        return back();
    }

    public function view(Request $request, Leave $leave)
    {
        $user = $leave->userWithoutScopes()->first();
        $medical = $leave->medical()->latest()->first();

        $leave->firstname = $user->firstname;
        $leave->lastname = $user->lastname;
        $leave->middlename = $user->middlename;
        $leave->role = $user->role;
        $leave->position = $user->position;
        $leave->avatar = $user->avatar;
        $leave->medical = $medical?->path ?? null;

        if ($request->user()->role == 'hr') {
            if ($request->expectsJson()) {
                return response()->json(collect([
                    'leave' => $leave,
                    'hr' => User::where('role', 'hr')->first()->name,
                    'applicant' => $leave->userWithoutScopes()->first()->only(['name', 'full_name', 'role']),
                    'principal' => User::where('role', 'principal')->first()?->only(['name', 'full_name', 'position'])
                ]));
            }

            return Inertia::render('Myapproval/Leave/LeaveView', [
                'leave' => $leave,
                'hr' => User::where('role', 'hr')->first()->name,
                'applicant' => $leave->userWithoutScopes()->first()->only(['name', 'full_name', 'role']),
                'principal' => User::where('role', 'principal')->first()?->only(['name', 'full_name', 'position'])
            ]);
        }

        return Inertia::render('Leave/LeaveView', [
            'leave' => $leave,
            'hr' => User::where('id', $leave->hr_id)->first()->name,
            'applicant' => $leave->userWithoutScopes()->first()->only(['name', 'full_name', 'role']),
            'principal' => User::where('id', $leave->principal_id)->first()?->only(['name', 'full_name', 'position'])
        ]);
    }

    public function leaveApproval(Request $request, Leave $leave)
    {
        $request->validate([
            "response" => ["in:disapproved,approved"],
            "message" => ['required_if:respond,disapproved', 'max:2000'],
            "from" => ['required_if:detailsofleave,monitization,terminal'],
            "to" => ['nullable','date']
        ]);

        DB::beginTransaction();
        try {
            if(!User::where('role', 'principal')->exists()){
                throw new Exception("Principal is not yet added.");
            }

            $auth = $request->user();
            $leaveApplicant = $leave->user;

            if ($auth->role == 'hr') {
                $leave->hrstatus = $request->response;
                $leave->hrdisapprovedmsg = $request->message;
                if(in_array($leave->details, ['monitization', 'terminal']) && $request->response === 'approved') {
                    $leave->from = $request->from ? Carbon::parse($request->from)->format('Y-m-d') : null;
                    $leave->to = $request->to ? Carbon::parse($request->to)->format('Y-m-d') : null;
                }

                // deduct credits for principal that applies leave
                if ($leave->user->role === "principal") {
                    if($leave->type !== "maternity" && $request->response === 'approved')
                        $this->processCreditDeduction($leaveApplicant, $leave);
                }
            } else if ($auth->role == 'principal') {
                $leave->principalstatus = $request->response;
                $leave->principaldisapprovedmsg = $request->message;
                if(in_array($leave->details, ['monitization', 'terminal']) && $request->response === 'approved') {
                    $leave->from = $request->from ? Carbon::parse($request->from)->format('Y-m-d') : null;
                    $leave->to = $request->to ? Carbon::parse($request->to)->format('Y-m-d') : null;
                }

                if ($leave->type !== "maternity" && $request->response == "approved") {
                    $this->processCreditDeduction($leaveApplicant, $leave);
                }
            }

            $leave->save();

            DB::commit();

            return redirect()->route('myapproval.leave')->with(['title' => 'Application for Leave', 'message' => 'You have ' . $request->response . ' application for leave.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Application for Leave', 'message' => $th->getMessage(), 'status' => 'error']);
        }
    }

    public function storeMedicalCertificate(Request $request, Leave $leave)
    {
        DB::beginTransaction();
        try {
            $file = $request->user()->temporary()->find($request->medical);
            $destinationPath = Str::replace('public/temporary', 'public/medical', $file->path);
            $move = Storage::move($file->path, $destinationPath);

            if (!$move) {
                throw new Exception("Unable to save medical.");
            } else {
                Medical::create([
                    'leave_id' => $leave->id,
                    'user_id' => $request->user()->id,
                    'path' => Str::replace('public', '/storage', $destinationPath)
                ]);
            }

            $file->delete();

            DB::commit();

            return redirect()->back()->with(['title' => 'Medical Upload', 'message' => 'Medical Certficate has been submitted successfully.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Medical Upload', 'message' => $th->getMessage() . 'Failed to submit Medical Certificate.', 'status' => 'error']);
        }
    }

    function processCreditDeduction(User $user, Leave $leave)
    {

        $approvedfor = collect([]);

        if ($user->role === "teaching") {
            $sr = $user->serviceRecord()
                ->where('status', 'approved')
                ->where('details->creditstatus', 'pending')
                ->get();

            $daysapplied = $leave->daysapplied;
            $usercredits = $user->credits - $daysapplied;

            $approvedfor['dayswithpay'] = $user->credits >= $daysapplied ? $daysapplied :  abs($daysapplied - abs($usercredits));
            $approvedfor['dayswithoutpay'] = $user->credits >= $daysapplied ? 0 : abs($usercredits);

            $leave->approvedfor = $approvedfor;

            $user->credits = $usercredits > 0 ? $usercredits : 0;
            $user->save();

            foreach ($sr as $value) {
                // get the service records details
                $srdetails = $value->details;

                $srcredit = $srdetails['remainingcredits'];

                // get the remaining days applied
                $remaindaysapplied = $srcredit >= abs($daysapplied) ? 0 : ($srcredit - abs($daysapplied));

                if($remaindaysapplied <= 0){
                    // update the remaining credits of service record
                    $srdetails['remainingcredits'] = ($srcredit - abs($daysapplied)) <= 0 ? 0 : ($srcredit - abs($daysapplied));
                    $srdetails['creditstatus'] = ($srcredit - abs($daysapplied)) <= 0 ? "used" : "pending";
                    $value->details = $srdetails;
                    $value->save();

                    $daysapplied = $remaindaysapplied;

                    if($daysapplied === 0) break;
                }
            }
        } else {
            if ($leave->type === "spl") {
                $approvedfor['dayswithpay'] = $leave->daysapplied;
                $approvedfor['dayswithoutpay'] = 0;
                $leave->approvedfor = $approvedfor;

                $user->splcredits = $user->splcredits - $leave->daysapplied;
                $user->save();
            } else {
                $daysapplied = $leave->daysapplied;
                $usercredit = $user->credits - $daysapplied;

                // get the remaining days applied (positive value)
                $daysapplied = $usercredit < 0 ? abs($usercredit) : 0;

                if ($usercredit < 0) {
                    // use service credits
                    $sr = $user->serviceRecord()
                        ->where('status', 'approved')
                        ->where('details->creditstatus', 'pending')
                        ->get();

                    $approvedfor['dayswithpay'] = $user->credits >= $daysapplied ? $daysapplied :  abs($daysapplied - abs($usercredit));
                    $approvedfor['dayswithoutpay'] = $user->credits >= $daysapplied ? 0 : abs($usercredit);

                    $leave->approvedfor = $approvedfor;

                    $user->credits = $usercredit > 0 ? $usercredit : 0;
                    $user->save();

                    foreach ($sr as $value) {
                        $details = $value->details;

                        $srcredit = $value->details['remainingcredits'];

                        // get the remaining days applied
                        $remaindaysapplied = $srcredit >= abs($daysapplied) ? 0 : ($srcredit - abs($daysapplied));

                        if($remaindaysapplied <= 0) {
                            $srremaincredit = $srcredit - abs($daysapplied);
                            $details['remainingcredits'] = $srremaincredit > 0 ? $srremaincredit : 0;
                            $details['creditstatus'] = $srremaincredit > 0 ? "pending" : "used";
                            $value->details = $details;
                            $value->save();

                            if($remaindaysapplied === 0) break;

                            $daysapplied = abs($remaindaysapplied);
                        }
                    }
                } else {
                    $approvedfor['dayswithpay'] = $leave->daysapplied;
                    $approvedfor['dayswithoutpay'] = 0;
                    $leave->approvedfor = $approvedfor;

                    $user->credits = $usercredit;
                    $user->save();
                }
            }
        }
    }

    function verifyDateFiveDaysAhead($filingfrom, $inputDate)
    {
        // Current date in UTC
        $currentDate = Carbon::now('Asia/Manila');

        // Add 5 business days to the current date (skipping weekends)
        $dateFiveBusinessDaysAhead = $currentDate->copy();
        $businessDaysAdded = 0;

        while ($businessDaysAdded < 5) {
            $dateFiveBusinessDaysAhead->addDay(); // Add one day
            if (!$dateFiveBusinessDaysAhead->isWeekend()) { // Skip weekends
                $businessDaysAdded++; // Only count business days
            }
        }

        // Parse the input date and normalize it to UTC
        try {
            $inputDateTime = Carbon::parse($inputDate)->setTimezone('Asia/Manila');
        } catch (\Exception $e) {
            throw new Exception("Error: Invalid date format. Please use a valid date.");
        }

        // Compare the normalized dates (ignoring timezone offsets)
        return $inputDateTime->isSameDay($dateFiveBusinessDaysAhead);
    }
}
