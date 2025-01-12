<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Http\Requests\LeaveRequest;
use App\Models\Leave;
use App\Models\Medical;
use App\Models\SchoolYear;
use App\Models\ServiceRecord;
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
                $query->with('user')->where('hrstatus', $status)
                    ->whereHas('user', function ($query) use ($search) {
                        $query->where('firstname', 'LIKE', "%$search%")
                            ->orWhere('lastname', 'LIKE', "%$search%")
                            ->orWhere('middlename', 'LIKE', "%$search%");
                    });
            })
            ->when($role == "principal" && $approvalLeave, function ($query) use ($status, $search) {
                $query->with('user')
                    ->whereHas('user', function ($query) use ($search) {
                        $query->where('firstname', 'LIKE', "%$search%")
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
                    ->where('hrstatus', $status)
                    ->orWhere('principalstatus', $status);
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
                    if ($this->verifyDateFiveDaysAhead($request->from)) {
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
                if (Carbon::parse($auth->datehired)->greaterThan(Carbon::now()->subMonths(3))) {
                    throw new Exception("You are not yet allowed to use this type of leave.", 1);
                }
            } else {
                if ($auth->role === "non-teaching" || $auth->role === "principal") {
                    $servicecredits = $auth->serviceRecord()
                        ->where('status', 'approved')
                        ->get()
                        ->reduce(function ($carry, $sr) {
                            return $carry + $sr['credits'];
                        }, 0);

                    if ($servicecredits < (int) $request->daysapplied) {
                        throw new Exception("You don't have enough credits.", 1);
                    }
                }
            }

            $leave = Leave::create([
                "user_id" => $auth->id,
                "schoolyearid" => $sy->id,
                "filingfrom" => $this->parseDate($request->filingfrom),
                "filingto" => $request->filingto ? $this->parseDate($request->filingto) : null,
                "salary" => $request->salary,
                "type" => $request->type,
                "others" => $request->others,
                "daysapplied" => (int) $request->daysapplied,
                "from" => $this->parseDate($request->from),
                "to" => $request->to ? $this->parseDate($request->to) : null,
                "commutation" => $request->commutation,
                "details" => $request->details,
                "detailsinput" => $request->detailsinput,
                "principalstatus" => $auth->role == "principal" ? "approved" : "pending"
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
        $user = $leave->user()->first();
        $medical = $leave->medical()->latest()->first();

        $leave->firstname = $user->firstname;
        $leave->lastname = $user->lastname;
        $leave->middlename = $user->middlename;
        $leave->department = $user->department;
        $leave->position = $user->position;
        $leave->avatar = $user->avatar;
        $leave->medical = $medical?->path ?? null;

        if ($request->user()->role == 'hr') {
            if ($request->expectsJson()) {
                return response()->json(collect([
                    'leave' => $leave,
                    'hr' => User::where('role', 'hr')->first()->name,
                    'principal' => User::where('role', 'principal')->first()?->only(['name', 'full_name', 'position'])
                ]));
            }

            return Inertia::render('Myapproval/Leave/LeaveView', [
                'leave' => $leave,
                'hr' => User::where('role', 'hr')->first()->name,
                'principal' => User::where('role', 'principal')->first()?->only(['name', 'full_name', 'position'])
            ]);
        }

        return Inertia::render('Leave/LeaveView', [
            'leave' => $leave,
            'hr' => User::where('role', 'hr')->first()->name,
            'principal' => User::where('role', 'principal')->first()?->only(['name', 'full_name', 'position'])
        ]);
    }

    public function leaveApproval(Request $request, Leave $leave)
    {
        $request->validate([
            "response" => ["in:disapproved,approved"],
            "message" => ['required_if:respond,disapproved', 'max:2000']
        ]);

        DB::beginTransaction();
        try {
            $auth = $request->user();

            if ($auth->role == 'hr') {
                $leave->hrstatus = $request->response;
                $leave->hrdisapprovedmsg = $request->message;

                // deduct credits for principal that applies leave
                if ($leave->user->role === "principal") {
                    $this->processCreditDeduction($auth, $leave);
                }
            } else if ($auth->role == 'principal') {
                $leave->principalstatus = $request->response;
                $leave->principaldisapprovedmsg = $request->message;

                if ($leave->type !== "maternity" && $request->response == "approved") {
                    $this->processCreditDeduction($auth, $leave);
                }
            }

            $leave->save();

            DB::commit();

            return redirect()->route('myapproval.leave')->with(['title' => 'Application for Leave', 'message' => 'You have ' . $request->response . ' application for leave.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => $th->getMessage() . 'Application for Leave', 'message' => 'Failed to send response.', 'status' => 'error']);
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

            DB::commit();

            return redirect()->back()->with(['title' => 'Medical Upload', 'message' => 'Medical Certficate has been submitted successfully.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Medical Upload', 'message' => $th->getMessage() . 'Failed to submit Medical Certificate.', 'status' => 'error']);
        }
    }

    function processCreditDeduction(User $user, Leave $leave)
    {
        if ($user->role === "teaching") {
            $sr = $user->serviceRecord()
                ->where('status', 'approved')
                ->where('details->creditstatus', 'pending')
                ->get();

            $credits = $leave->daysapplied;

            foreach ($sr as $key => $value) {
                $srcredit = $value->details['credits'];
                $credits = $srcredit + $credits;

                if ($credits < 0) {
                    $value->details['remainingcredits'] = 0;
                    $value->details['creditstatus'] = "used";
                    $value->save();
                } else if ($credits === 0) {
                    $value->details['remainingcredits'] = 0;
                    $value->details['creditstatus'] = "used";
                    $value->save();

                    $user->credit = 0;
                    $user->save();

                    break;
                } else {
                    $value->details['remainingcredits'] = $credits;
                    $value->details['creditstatus'] = "pending";
                    $value->save();

                    $user->credit = 0;
                    $user->save();

                    break;
                }
            }


            $user->save();
        } else {
            if ($leave->type === "spl") {
                $user->splcredits = $user->splcredits - $leave->daysapplied;
                $user->save();
            } else {
                $remaincredit = $user->credit - $leave->daysapplied;

                if ($remaincredit < 0) {
                    // use credits
                    $sr = $user->serviceRecord()
                        ->where('status', 'approved')
                        ->where('details->creditstatus', 'pending')
                        ->get();

                    $totalremain = $remaincredit;

                    foreach ($sr as $value) {
                        $srcredit = $value->details['credits'];
                        $totalremain = $srcredit + $totalremain;

                        if ($totalremain < 0) {
                            $value->details['remainingcredits'] = 0;
                            $value->details['creditstatus'] = "used";
                            $value->save();
                        } else if ($totalremain === 0) {
                            $value->details['remainingcredits'] = 0;
                            $value->details['creditstatus'] = "used";
                            $value->save();

                            $user->credit = 0;
                            $user->save();

                            break;
                        } else {
                            $value->details['remainingcredits'] = $totalremain;
                            $value->details['creditstatus'] = "pending";
                            $value->save();

                            $user->credit = 0;
                            $user->save();

                            break;
                        }
                    }
                } else {
                    $user->credit = $remaincredit;
                    $user->save();
                }
            }
        }
    }

    function verifyDateFiveDaysAhead($inputDate)
    {
        // Current date
        $currentDate = Carbon::now();
        // Add 5 days to the current date
        $dateFiveDaysAhead = $currentDate->copy()->addDays(5);

        // Parse the input date
        try {
            $inputDateTime = Carbon::parse($inputDate);
        } catch (\Exception $e) {
            throw new Exception("Error: Invalid date format. Please use a valid date.");
        }

        return $inputDateTime->isSameDay($dateFiveDaysAhead);
    }
}
