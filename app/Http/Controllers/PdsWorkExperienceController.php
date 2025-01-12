<?php

namespace App\Http\Controllers;

use App\Http\Requests\PdsWorkExperienceRequest;
use App\Models\Notification;
use App\Models\PdsWorkExperience;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PdsWorkExperienceController extends Controller
{
    public function store(PdsWorkExperienceRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->we as $we) {
                $request->user()->pdsWorkExperience()->create([
                    'inlcusivedates' => $we['inclusivedates'],
                    'positiontitle' => $we['positiontitle'],
                    'department' => $we['department'],
                    'monthlysalary' => $we['monthlysalary'],
                    'salarygrade' => $we['salarygrade'],
                    'statusofappointment' => $we['statusofappointment'],
                    'isgovernment' => $we['isgovernment'],
                ]);
            }

            $request->user()->personalDataSheet()->updateOrCreate([
                'user_id' => $request->user()->id
            ],[
                'status' => 'pending'
            ]);

            DB::commit();

            $pronoun = $request->user()->gender === 'female' ? 'her' : 'his';
            $hr = User::where('role', 'hr')->first();

            Notification::create([
                'user_id' => $hr->id,
                'type' => 'pdsupdate',
                'details' => collect([
                    'link' => route('myapproval.pds'),
                    'name' =>  $request->user()->full_name,
                    'avatar' => $request->user()->avatar,
                    'message' => 'updated '.$pronoun.' PDS work experience.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title'=>'Work Experience', 'message'=>'Work Experience Added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title'=>'Work Experience', 'message'=>$th->getMessage().'Failed to add Work Experience!', 'status' => 'error']);
        }
    }

    public function update(PdsWorkExperienceRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->we as $we) {
                $request->user()->pdsWorkExperience()->updateOrCreate([
                    'id' => $we['weid']
                ],[
                    'inlcusivedates' => $we['inclusivedates'],
                    'positiontitle' => $we['positiontitle'],
                    'department' => $we['department'],
                    'monthlysalary' => $we['monthlysalary'],
                    'salarygrade' => $we['salarygrade'],
                    'statusofappointment' => $we['statusofappointment'],
                    'isgovernment' => $we['isgovernment'],
                ]);
            }

            if($request->deletedWE && count($request->deletedWE) !== 0)
                PdsWorkExperience::destroy($request->deletedWE);

            $request->user()->personalDataSheet()->updateOrCreate([
                'user_id' => $request->user()->id
            ],[
                'status' => 'pending'
            ]);

            DB::commit();

            $pronoun = $request->user()->gender === 'female' ? 'her' : 'his';
            $hr = User::where('role', 'hr')->first();

            Notification::create([
                'user_id' => $hr->id,
                'type' => 'pdsupdate',
                'details' => collect([
                    'link' => route('myapproval.pds'),
                    'name' =>  $request->user()->full_name,
                    'avatar' => $request->user()->avatar,
                    'message' => 'updated '.$pronoun.' PDS work experience.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title'=>'Work Experience', 'message'=>'Work Experience Updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title'=>'Work Experience', 'message'=>$th->getMessage().'Failed to update Work Experience!', 'status' => 'error']);
        }
    }
}
