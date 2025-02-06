<?php

namespace App\Http\Controllers;

use App\Http\Requests\TardinessRequest;
use App\Models\Notification;
use App\Models\SchoolYear;
use App\Models\Tardiness;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TardinessController extends Controller
{
    private $sy;

    function __construct()
    {
        $this->sy = SchoolYear::latest()->first();
    }

    public function index(Request $request)
    {
        $auth = $request->user();

        $sy = $request->query('sy') ?? $this->sy?->id;
        $month = $request->query('month') ?? Carbon::now()->isoFormat('MMMM');

        $tardiness = Tardiness::when($auth->role == "hr", function ($query) {
                $query->with('user:id,firstname,lastname,middlename,extensionname,avatar');
            })
            ->with('schoolyear:id,start,end,resume')
            ->where("school_year_id", $sy)
            ->when($auth->role == 'hr', function ($query) use ($month) {
                $query->where("month", $month);
            })
            ->when($auth->role == "hr", function ($query) {
                $query->orderBy(
                    User::select('lastname')
                        ->whereColumn('tardinesses.user_id', 'users.id')
                        ->orderBy('lastname')
                        ->limit(1)
                );
            })
            ->when($auth->role != "hr", function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)->latest();
            })
            ->when($auth->role != 'hr', function ($query) use ($month) {
                $query->orderBy('month');
            })
            ->paginate($this->page);

        if ($request->expectsJson()) {
            return response()->json($tardiness);
        }

        if($auth->role == "hr") {
            return Inertia::render('Personnel/Tardiness/Tardiness', [
                "tardinesses" => Inertia::defer(fn() => $tardiness),
                "schoolyears" => SchoolYear::latest()->get()
            ]);
        }

        return Inertia::render('Tardiness/Tardiness', [
            "tardinesses" => Inertia::defer(fn() => $tardiness),
            "schoolyears" => SchoolYear::latest()->get()
        ]);
    }

    public function personnelWithoutTardiness(Request $request, $sy, $month)
    {
        if ($request->expectsJson()) {
            return response()->json(
                User::whereDoesntHave('tardiness', function ($query) use ($sy, $month) {
                    $query->where('school_year_id', $sy)->where('month', $month);
                })
                ->excludeHr()
                ->orderByRaw("CONCAT(lastname, ' ', firstname) ASC")
                ->get(['id', 'firstname', 'lastname', 'middlename', 'extensionname', 'avatar'])
                ->map(fn ($user) => collect([
                    "user" => [
                        "id" => $user->id,
                        "name" => $user->name
                    ],
                    "present" => "",
                    "absent" => "",
                    "timetardy" => "",
                    "undertime" => "",
                ]))
            );
        }

        return null;
    }

    public function store(TardinessRequest $request, $sy, $month)
    {
        DB::beginTransaction();
        try {

            foreach ($request->attendances as $attendance) {
                Tardiness::create([
                    "user_id" => $attendance['user']['id'],
                    "school_year_id" => $sy,
                    "present" => $attendance['present'],
                    "absent" => $attendance['absent'],
                    "timetardy" => $attendance['timetardy'],
                    "undertime" => $attendance['undertime'],
                    "month" => $month,
                ]);

                Notification::create([
                    'user_id' => $attendance['user']['id'],
                    'type' => 'tardiness',
                    'details' => collect([
                        'link' => route('tardiness'),
                        'name' =>  "HR",
                        'avatar' => $request->user()->avatar,
                        'message' => 'has uploaded your attendance.'
                    ])->toArray()
                ]);
            }

            DB::commit();

            return redirect()->back()->with([
                'title' => "Attendance recorded!",
                "message" => "The attendance of ".count($request->attendances)." personnel for $request->month of SY $request->sy has been recorded.",
                "status" => "success"
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with([
                'title' => "Unable to record attendance.",
                "message" => "The attendance of ".count($request->attendances)." personnel for $request->month of SY $request->sy could not be processed.",
                "status" => "error"
            ]);
        }
    }

    public function update(TardinessRequest $request, Tardiness $tardiness)
    {
        $personnel = $tardiness->load('user');

        try {
            DB::transaction(function () use ($request, $tardiness) {
                $tardiness->present = $request->attendances[0]['present'];
                $tardiness->absent = $request->attendances[0]['absent'];
                $tardiness->timetardy = $request->attendances[0]['timetardy'];
                $tardiness->undertime = $request->attendances[0]['undertime'];
                $tardiness->save();
            });


            return redirect()->back()->with([
                "title" => "Attendance updated!",
                "message" => "Attendance of ".$personnel->user['name']." has been updated.",
                "status" => "success"
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with([
                "title" => "Unable to update attendance",
                "message" => $th->getMessage()."Attendance of ".$personnel->user['name']." could not be processed.",
                "status" => "error"
            ]);
        }
    }
}
