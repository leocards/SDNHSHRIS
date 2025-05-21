<?php

namespace App\Http\Controllers;

use App\Models\ClassAssumption;
use App\Models\User;
use App\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClassAssumptionController extends Controller
{
    use ResponseTrait;

    public function index(Request $request)
    {
        $role = $request->user()->role;
        $status = $request->query('status') ?? "pending";
        $filter = $request->query('filter');
        $search = $request->query('search');
        $sort = $request->query('sort') ?? "date";
        $order = $request->query('order') ?? "desc";

        $classAssumption = ClassAssumption::when(
                request()->routeIs('myapproval.classassumption'),
                function ($query) use ($status, $filter, $search) {
                    $query->with('user')
                    ->where(function ($query) use ($status) {
                        $query->where('status', $status);
                    })->when($filter != 'all' && $filter, function ($query) use ($filter) {
                        dd('asdf');
                        $query->where('details->details->type', $filter);
                    })->when($search, fn($query) => $query->whereHas('user', function ($query) use ($search) {
                        $query->where('firstname', 'LIKE', "%$search%")
                            ->orWhere('lastname', 'LIKE', "%$search%")
                            ->orWhere('middlename', 'LIKE', "%$search%");
                    }));
                },
                function ($query) use ($status, $filter) {
                    $query->where(function ($query) use ($status) {
                        $query->where('status', $status);
                    })->when($filter != 'all' && $filter, function ($query) use ($filter) {
                        $query->where('details->details->type', $filter);
                    })->where('user_id', Auth::id());
                }
            )
            ->when(
                $sort == 'date',
                fn($query) => $query->orderBy('created_at', $order),
                fn($query) => $query->orderByRaw('(SELECT lastname FROM users WHERE users.id = class_assumptions.user_id) ' . strtoupper($order))
            )
            ->paginate($this->page);

        if ($request->expectsJson())
            return response()->json($classAssumption);

        return Inertia::render('ClassAssumption/ClassAssumption', [
            "classassumptions" => Inertia::defer(fn() => $classAssumption)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'details.type' => ['required'],
            'details.others' => ['required_if:details.type,others'],
            'classloads.*.time' => ['required'],
            'classloads.*.timeTo' => ['required'],
            'classloads.*.gradesection' => ['required'],
            'classloads.*.subject' => ['required'],
            'classloads.*.teacher' => ['required'],
        ], [
            'details.type.required' => 'Please select a reason for out/absent.',
            'details.others.required_if' => 'Please specify reason for out/absent.',
            'classloads.*.time.required' => 'The time from field is required.',
            'classloads.*.timeTo.required' => 'The time to field is required.',
            'classloads.*.gradesection.required' => 'The grade and section field is required.',
            'classloads.*.subject.required' => 'The subject field is required.',
            'classloads.*.teacher.required' => 'The teacher field is required.'
        ]);

        DB::beginTransaction();
        try {
            $gradelevel = $request->user()->gradelevel;
            $department = $request->user()->department;

            $users = User::where('role', 'principal')
                ->orWhere('curriculumnhead', $gradelevel)
                ->orWhere('academichead', $department)
                ->get(['id', 'curriculumnhead', 'academichead', 'role']);

            $principal = $users->where('role', 'principal')->pluck('id')->first();
            $curriculumnhead = $users->where('curriculumnhead', $gradelevel)->pluck('id')->first();
            $academichead = $users->where('academichead', $department)->pluck('id')->first();

            if (!$curriculumnhead || !$academichead) {
                DB::rollBack();

                if (!$curriculumnhead)
                    return $this->returnResponse('Class Assumption', 'Request cannot be processed due to the absence of an assigned curriculum head for grade ' . $gradelevel . '.', 'error');

                if (!$academichead)
                    return $this->returnResponse('Class Assumption', 'Request cannot be processed due to the absence of an assigned academic head.', 'error');
            }

            // NOTE: Please add auto approve if the academic head is the one submiting a request.
            ClassAssumption::create([
                'user_id' => $request->user()->id,
                'principal_id' => $principal,
                'curriculumnhead_id' => $curriculumnhead,
                'academichead_id' => $academichead,
                'details' => $request->all(),
            ]);

            DB::commit();

            return $this->returnResponse('Class Assumption', 'You have successfully send your class assumption.', 'success');
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->returnResponse('Class Assumption', 'Failed to send your class assumption.', 'error');
        }
    }

    public function update(Request $request, ClassAssumption $ca)
    {
        try {
            $ca->details = $request->all();
            $ca->saveQuietly();

            return $this->returnResponse('Class Assumption', 'You have successfully updated your class assumption.', 'success');
        } catch (\Throwable $th) {
            return $this->returnResponse('Class Assumption', 'Failed to update your class assumption.', 'error');
        }
    }

    public function view(ClassAssumption $ca)
    {

        $ca->load([
            'user' => function ($query) {
                $query->withoutGlobalScopes();
            },
            'principal' => function ($query) {
                $query->withoutGlobalScopes()->select('id', 'firstname', 'lastname', 'middlename', 'position');
            },
            'curriculumnhead' => function ($query) {
                $query->withoutGlobalScopes()->select('id', 'firstname', 'lastname', 'middlename', 'position');
            },
            'academichead' => function ($query) {
                $query->withoutGlobalScopes()->select('id', 'firstname', 'lastname', 'middlename', 'position');
            }
        ]);

        $details = $ca->details;

        foreach ($details['classloads'] as $key => $value) {
            $teacher = User::find($value['teacher']);
            $mappedTeacher = $details['classloads'][$key];
            $mappedTeacher['teacher'] = $teacher->full_name;
            $details['classloads'][$key] = $mappedTeacher;
        }
        $ca->details = $details;

        return Inertia::render('ClassAssumption/ViewClassAssumption', [
            'ca' => $ca
        ]);
    }

    public function approval(Request $request, ClassAssumption $ca)
    {
        try {
            DB::transaction(function () use ($ca, $request) {
                $ca->status = $request->status.'d';
                $ca->save();
            });

            return $this->returnResponse('Class Assumption', 'Class Assumption has been '.$request->status.'.', 'success');
        } catch (\Throwable $th) {
            return $this->returnResponse('Class Assumption', 'Failed to '.$request->status, 'success');
        }
    }

    public function getTeachers()
    {
        return response()->json(
            User::where('id', '!=', Auth::id())
                ->where('role', 'teaching')
                ->get(['id', 'firstname', 'lastname', 'middlename', 'avatar'])
                ->map(function ($value) {
                    $value['checked'] = false;

                    return $value;
                })
        );
    }
}
