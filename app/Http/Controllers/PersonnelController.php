<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Http\Requests\PersonnelRequest;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    use DateParserTrait;

    public function index(Request $request, $pt = "teaching")
    {
        $filter = $request->query('filter');
        $sort = $request->query('sort') ?? "name";
        $order = $request->query('order') ?? "asc";

        $sortDataBy = $sort === "name" ? "lastname" : $sort;

        $personnel = User::excludeHr()
            ->when($pt === 'teaching', fn ($query) => $query->where('role', $pt))
            ->when($pt === 'non-teaching', fn ($query) => $query->where('role', $pt)->when(Auth::user()->role != "principal", fn ($query) => $query->orWhere('role', 'principal')))
            ->when($filter, function ($query) use ($filter) {
                $query->where('department', $filter);
            })
            ->orderBy($sortDataBy, $order)
            ->paginate($this->page);

        if ($request->expectsJson()) {
            return response()->json($personnel);
        }

        return Inertia::render('Personnel/Personnel', [
            "personnels" => Inertia::defer(fn () => $personnel),
            "personneltype" => $pt,
            "jhs" => User::where('department', 'junior')->count(),
            "shs" => User::where('department', 'senior')->count(),
            "accounting" => User::where('department', 'accounting')->count(),
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
                    'credits' => $request->personnel['role'] != "teaching" ? 45 : 0,
                    'enable_email_notification' => true,
                    'password' => Hash::make($request->password)
                ]
            );

            if(!$personnelid)
                PersonalDataSheet::create([
                    'user_id' => $personnel->id
                ]);

            DB::commit();

            return redirect()->route('personnel', [$request->query('pt')])->with([
                'title' => 'New personnel '.(!$personnelid?'added!':'updated!'),
                'message' => 'New personnel successfully '.(!$personnelid?'added.':'updated.'),
                'status' => 'success'
            ]);

        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with([
                'title' => 'Process failed!',
                'message' => 'Unable to '.(!$personnelid?'add':'update').' personnel.',
                'status' => 'error'
            ]);
        }
    }

    public function listOfPersonnel()
    {

        $jhs = User::where('department', 'junior')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname']);
        $shs = User::where('department', 'senior')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname']);
        $accounting = User::where('department', 'accounting')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname']);

        return Inertia::render('Myreports/ListOfPersonnel/ListOfPersonnel', [
            "list" => collect([
                "jhs" => $jhs,
                "shs" => $shs,
                "accounting" => $accounting,
                "principal" => User::where('role', 'principal')->get(['id', 'gender', 'department', 'firstname', 'lastname', 'middlename', 'extensionname', 'position'])
            ]),
        ]);
    }
}
