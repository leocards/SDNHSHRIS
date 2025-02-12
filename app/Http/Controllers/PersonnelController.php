<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Http\Requests\PersonnelRequest;
use App\Models\Leave;
use App\Models\PdsCivilService;
use App\Models\PdsCs4;
use App\Models\PdsEducationalBackground;
use App\Models\PdsFamilyBackground;
use App\Models\PdsLearningDevelopment;
use App\Models\PdsOtherInformation;
use App\Models\PdsPersonalInformation;
use App\Models\PdsVoluntaryWork;
use App\Models\PdsWorkExperience;
use App\Models\PersonalDataSheet;
use App\Models\ServiceRecord;
use App\Models\Tardiness;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    use DateParserTrait, ResponseTrait;

    public function index(Request $request, $pt = "teaching")
    {
        $filter = $request->query('filter');
        $sort = $request->query('sort') ?? "name";
        $order = $request->query('order') ?? "asc";

        $sortDataBy = $sort === "name" ? "lastname" : $sort;

        $personnel = User::excludeHr()
            ->when($pt === 'teaching', fn($query) => $query->where('role', $pt))
            ->when($pt === 'non-teaching', fn($query) => $query->where('role', $pt)->when(Auth::user()->role != "principal", fn($query) => $query->orWhere('role', 'principal')))
            ->when($filter, function ($query) use ($filter) {
                $query->where('department', $filter);
            })
            ->orderBy($sortDataBy, $order)
            ->paginate($this->page);

        if ($request->expectsJson()) {
            return response()->json($personnel);
        }

        return Inertia::render('Personnel/Personnel', [
            "personnels" => Inertia::defer(fn() => $personnel),
            "personneltype" => $pt,
            "jhs" => User::excludeHr()->where('department', 'junior')->count(),
            "shs" => User::excludeHr()->where('department', 'senior')->count(),
            "accounting" => User::excludeHr()->where('department', 'accounting')->count(),
        ]);
    }

    public function create($pt = "teaching", User $personnel = null)
    {
        $principal = User::where('role', 'principal')->exists();

        return Inertia::render('Personnel/NewPersonnel', [
            "hasPrincipal" => $principal,
            "personneltype" => $pt,
            "personnel" => $personnel
        ]);
    }

    public function store(PersonnelRequest $request, $personnelid = null)
    {
        DB::beginTransaction();
        try {

            $personnel = User::updateOrCreate(
                ['id' => $personnelid],
                [
                    'firstname' => $request->personal['firstname'],
                    'lastname' => $request->personal['lastname'],
                    'middlename' => $request->personal['middlename'],
                    'extensionname' => $request->personal['extensionname'],
                    'birthday' => $this->parseDate($request->personal['birthday']),
                    'gender' => $request->personal['gender'],
                    'email' => $request->contact['email'],
                    'mobilenumber' => $request->contact['mobilenumber'],
                    'personnelid' => $request->personnel['personnelid'],
                    'department' => $request->personnel['department'],
                    'role' => $request->personnel['role'],
                    'position' => $request->personnel['position'],
                    'hiredate' => $this->parseDate($request->personnel['datehired']),
                    'credits' => $request->personnel['credits'] != '0' && $request->personnel['credits'] ?
                        $request->personnel['credits'] : ($request->personnel['role'] != "teaching" ? 30 : 0),
                    'splcredits' => $request->personnel['role'] != "teaching" ?
                        ($request->personnel['splcredits'] != '0' && $request->personnel['splcredits'] ? $request->personnel['splcredits'] : 15)
                        : 0,
                    'enable_email_notification' => true,
                    'password' => Hash::make($request->password)
                ]
            );

            if (!$personnelid)
                PersonalDataSheet::create([
                    'user_id' => $personnel->id
                ]);

            DB::commit();

            return redirect()->route('personnel', [$request->query('pt')])->with([
                'title' => 'New personnel ' . (!$personnelid ? 'added!' : 'updated!'),
                'message' => 'New personnel successfully ' . (!$personnelid ? 'added.' : 'updated.'),
                'status' => 'success'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with([
                'title' => 'Process failed!',
                'message' => 'Unable to ' . (!$personnelid ? 'add' : 'update') . ' personnel.',
                'status' => 'error'
            ]);
        }
    }

    public function listOfPersonnel()
    {
        $jhs = User::excludeHr()->whereNull('status_updated_at')->where('department', 'junior')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname']);
        $shs = User::excludeHr()->whereNull('status_updated_at')->where('department', 'senior')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname']);
        $accounting = User::excludeHr()->whereNull('status_updated_at')->where('department', 'accounting')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname']);

        return Inertia::render('Myreports/ListOfPersonnel/ListOfPersonnel', [
            "list" => collect([
                "jhs" => $jhs,
                "shs" => $shs,
                "accounting" => $accounting,
                "principal" => User::where('role', 'principal')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname', 'position'])
            ]),
        ]);
    }

    public function updatePersonnelStatus(Request $request, User $user)
    {
        $request->validate([
            'action' => ['required', 'in:retired,resigned,transferred']
        ]);

        try {
            DB::transaction(function () use ($user, $request) {
                $user->status_updated_at = Carbon::now()->timestamp;
                $user->status = $request->action;
                $user->saveQuietly();
            });

            return $this->returnResponse('Update Employment Status', 'You have successfully updated the personnel\'s employment status', 'success');
        } catch (\Throwable $th) {
            return $this->returnResponse('Update Employment Status', 'Unable to update employment status', 'error');
        }
    }

    public function personnelArchive(Request $request)
    {
        $status = $request->status;

        $personnels = User::withoutGlobalScopes()
            ->whereNotNull('status_updated_at')
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->paginate($this->page);

        if ($request->expectsJson()) {
            return response()->json($personnels);
        }

        return Inertia::render('Personnel/PersonnelArchive/PersonnelArchive', [
            'personnels' => Inertia::defer(fn() => $personnels)
        ]);
    }

    public function personnelArchiveView(Request $request, $userId)
    {
        $user = User::withoutGlobalScopes()->find($userId);

        if (!$user->status_updated_at)
            return $this->returnResponse('Info', 'The personnel is still active in the school.', 'info');
        else if (!$user)
            return $this->returnResponse('Info', 'The personnel with the given details does not exist.', 'info');

        return Inertia::render('Personnel/PersonnelArchive/View', [
            'user' => $user->load(['pdsPersonalInformation' => function ($query) {
                $query->select('id', 'user_id', 'tin'); // Ensure foreign key is included
            }]),
            'tardinesses' => Inertia::defer(fn() =>
                Tardiness::with('schoolyear:id,start,end,resume')
                    ->where('user_id', $user->id)
                    ->latest()
                    ->get()
                    ->groupBy('school_year_id')
                    ->mapWithKeys(function ($tardiness) {
                        $schoolYear = $tardiness[0]->schoolyear->schoolyear;

                        return [$schoolYear => $tardiness];
                    })
                ),
            'certificates' => Inertia::defer(fn() => $user->serviceRecord),
            'leaves' => Inertia::defer(fn() => $user->leave()->get(['id','user_id','type'])),
            'saln' => Inertia::defer(fn() => $user->salnreport),
        ]);
    }

    public function personnelArchiveViewLeaveApplication(Leave $leave)
    {
        $user = $leave->userWithoutScopes()->first();
        $medical = $leave->medical()->latest()->first();

        $leave->firstname = $user->firstname;
        $leave->lastname = $user->lastname;
        $leave->middlename = $user->middlename;
        $leave->department = $user->department;
        $leave->position = $user->position;
        $leave->avatar = $user->avatar;
        $leave->medical = $medical?->path ?? null;

        return response()->json(collect([
            'leave' => $leave,
            'hr' => User::where('role', 'hr')->first()->name,
            'applicant' => $leave->userWithoutScopes()->first()->only(['name', 'full_name', 'role']),
            'principal' => User::where('role', 'principal')->first()?->only(['name', 'full_name', 'position'])
        ]));
    }
}
