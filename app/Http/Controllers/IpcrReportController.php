<?php

namespace App\Http\Controllers;

use App\Imports\IPCRImport;
use App\Models\IpcrReport;
use App\Models\SchoolYear;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class IpcrReportController extends Controller
{
    public function index(Request $request)
    {
        $sy = SchoolYear::latest()->get();

        $filter = $request->query('filter')??$sy[0]->id;

        $ipcr = IpcrReport::with([
            'user' => function ($query) {
                $query->withoutGlobalScopes();
            },
            'schoolyear'
        ])->where('syid', $filter)->get();

        if($request->expectsJson()) {
            return response()->json($ipcr);
        }

        return Inertia::render('Myreports/IPCR/IPCR', [
            'schoolyears' => $sy,
            'ipcr' => Inertia::defer(fn () => $ipcr),
            'hr' => User::where('role', 'hr')->first()?->full_name,
            'principal' => User::where('role', 'principal')->first()?->only(['full_name', 'position'])
        ]);
    }

    public function store(Request $request, IpcrReport $ipcrid = null)
    {
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5'
        ]);

        try {

            DB::transaction(function () use ($request, $ipcrid) {
                if($ipcrid) {
                    $ipcrid->rating = $request->rating;
                    $ipcrid->save();
                } else {
                    IpcrReport::create([
                        'user_id' => $request->personnel,
                        'syid' => $request->schoolyear,
                        'rating' => $request->rating
                    ]);
                }
            });

            return back()->with(['title' => 'IPCR', 'message' => 'Successfully '.(!$ipcrid?'added':'updated').' IPCR', 'status' => 'success']);
        } catch (\Throwable $th) {

            return back()->with(['title' => 'IPCR', 'message' => $th->getMessage().'Failed to '.(!$ipcrid?'add':'update').' IPCR', 'status' => 'success']);
        }
    }

    public function importIPCR(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        // import the file and read its contents.
        $data = Excel::toCollection(new IPCRImport, $request->file('file'));

        $exist = null;

        DB::beginTransaction();

        try {
            // check if there is data.
            if ($data->count() > 0) {
                // check if there is data
                if ($data[0]->count() !== 0) {

                    foreach ($data[0] as $key => $value) {
                        // check if there is number indicator in the data to verify if it is the valid content to add
                        if (is_int($value[0]) && !empty($value[1]) && !empty($value[2])) {
                            $searchName = strtolower($value[1]);
                            $searchName = explode(',', $searchName);
                            $searchName = array_map(function ($str) {
                                // Remove spaces
                                $str = preg_replace('/\b\w\.\s*/', '', $str);

                                // Remove middle initial (like 'h.' or 'k.')
                                return Str::trim($str);
                            }, $searchName);

                            $user = User::where(DB::raw('firstname'), $searchName[1])
                                ->where(DB::raw('lastname'), $searchName[0])
                                ->whereNot('role', 'hr')
                                ->first(['id']);

                            // validate if user exist and check if it has already been added otherwise add the rating.
                            if ($user) {
                                $existIPCR = IpcrReport::where('user_id', $user->id)->where('syid', $request->schoolyear)->exists();
                                if (floatval($value[3]) >= 1 || floatval($value[3]) <= 5) {
                                    if (!$existIPCR)
                                        IpcrReport::create([
                                            'user_id' => $user->id,
                                            'rating' => $value[3]??0,
                                            'syid' => $request->schoolyear
                                        ]);
                                } else throw new Exception('The ratings should be between 1 to 5');
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

            // dd($exist);

            DB::commit();

            return back()->with(['title' => 'Import IPCR', 'message' => 'IPCR import successfull', 'status'=>'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with(['title' => 'Import IPCR', 'message' => 'IPCR import failed', 'status'=>'error']);
        }
    }

    public function personnelWithoutIpcr($schoolyearid)
    {
        return response()->json(
            User::whereNotIn('id', function ($query) use ($schoolyearid) {
                $query->select('user_id')
                    ->from('ipcr_reports')
                    ->where('syid', $schoolyearid);
            })
            ->excludeHr()
            ->get(['id', 'firstname', 'lastname', 'middlename', 'extensionname', 'avatar'])
        );
    }
}
