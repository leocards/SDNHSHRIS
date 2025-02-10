<?php

namespace App\Http\Controllers;

use App\Imports\SALNImport;
use App\Models\SalnReport;
use App\Models\SchoolYear;
use App\Models\User;
use App\ResponseTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SalnReportController extends Controller
{
    use ResponseTrait;

    public function index(Request $request)
    {
        $year = SalnReport::select('year')->groupBy('year')->orderBy('year', 'DESC')->pluck('year');
        $filter = $request->query('filter') ?? $year?->first();

        if ($request->expectsJson()) {
            return response()->json(
                SalnReport::with(['user' => function ($query) {
                    $query->withoutGlobalScopes()
                        ->with('pdsPersonalInformation');
                }])
                ->where('year', $filter)->get()
            );
        }

        return Inertia::render('Myreports/SALN/SALN', [
            'principal' => User::where('role', 'principal')->first(),
            'saln' => Inertia::defer(fn() => SalnReport::with(['user' => function ($query) {
                $query->withoutGlobalScopes()
                    ->with('pdsPersonalInformation');
            }])->where('year', $year?->first())->get()),
            'years' => $year
        ]);
    }

    public function store(Request $request, SalnReport $saln = null)
    {
        $request->validate([
            'networth' => 'required|numeric',
            'filing' => 'required|in:joint,separate,not'
        ]);

        DB::beginTransaction();
        try {

            if (SalnReport::where('user_id', $request->personnel)->where('year', $request->year)->exists() && !$saln)
                throw new Exception('Personnel already have saln of year ' . $request->year);

            if ($saln && !$saln->user())
                throw new Exception('Cannot update the SALN; the personnel is no longer working at the school.');

            SalnReport::updateOrCreate([
                'id' => $saln?->id
            ], [
                'user_id' => $request->personnel,
                'year' => $request->year,
                'details' => collect([
                    'filing' => $request->filing,
                    'networth' => $request->networth,
                    'spouse' => $request->spouse
                ])->toArray()
            ]);

            DB::commit();

            return $this->returnResponse('SALN', 'Successfully ' . (!$saln ? 'added' : 'updated') . ' SALN.', 'success');
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->returnResponse('SALN', $th->getMessage()/* 'Failed to ' . (!$saln ? 'add' : 'update') . ' SALN.' */, 'error');
        }
    }

    public function importSALN(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        // import the file and read its contents.
        $data = Excel::toCollection(new SALNImport, $request->file('file'));

        DB::beginTransaction();

        try {
            // check if there is data.
            if ($data->count() > 0) {
                // check if there is data
                if ($data[0]->count() !== 0) {

                    foreach ($data[0] as $key => $value) {

                        // check if there is number indicator in the data to verify if it is the valid content to add
                        if (is_int($value[0])) {
                            $searchLName = strtolower($value[1]);
                            $searchFName = strtolower($value[2]);
                            $user = User::searchByLastAndFirstName($searchLName, $searchFName)->first('id');

                            // validate if user exist and check if it has already been added otherwise add the saln.
                            if ($user) {
                                $existIPCR = SalnReport::where('user_id', $user->id)->where('year', $request->year)->exists();
                                if (!$existIPCR)
                                    SalnReport::create([
                                        'user_id' => $user->id,
                                        'details' => collect([
                                            "networth" => $value[6],
                                            "spouse" => $value[7],
                                            "filing" => $value[8] === "/" ? ($value[7] ? 'joint' : 'separate') : ($value[7] ? 'separate' : 'not')
                                        ])->toArray(),
                                        "year" => $request->year
                                    ]);
                            }
                        } else {
                            // break the loop if there is no number indicator.
                            break;
                        }
                    }
                } else {
                    throw new Exception("The sheet is empty.", 1);
                }
            } else {
                throw new Exception("The uploaded file is empty.", 1);
            }

            DB::commit();

            return $this->returnResponse('SALN Import', 'SALN Imported successfully', 'success');
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->returnResponse('SALN Import', 'SALN failed import', 'error');
        }
    }

    public function personnelWithoutSaln($year)
    {
        return response()->json(
            User::whereDoesntHave('salnreport', function ($query) use ($year) {
                $query->where('year', $year);
            })
                ->with('salnreport:id')
                ->whereNot('role', 'hr')
                ->whereNot('role', 'principal')
                ->get(['id', 'firstname', 'lastname', 'middlename', 'extensionname', 'avatar'])
        );
    }
}
