<?php

namespace App\Http\Controllers;

use App\Http\Requests\PdsCivilServiceRequest;
use App\Models\Notification;
use App\Models\PdsCivilService;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsCivilServiceController extends Controller
{
    public function store(PdsCivilServiceRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->cs as $cs) {
                $request->user()->pdsCivilService()->create([
                    'careerservice' => $cs['eligibility'],
                    'rating' => $cs['rating'],
                    'examination' => Carbon::parse($cs['dateofexaminationconferment'])->format('Y-m-d'),
                    'placeexamination' => $cs['placeofexaminationconferment'],
                    'licensenumber' => $cs['license']['number'],
                    'validity' => $cs['license']['dateofvalidity'] ? Carbon::parse($cs['license']['dateofvalidity'])->format('Y-m-d') : $cs['license']['dateofvalidity'],
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
                    'message' => 'updated '.$pronoun.' PDS civil service eligbility.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Civil Service', 'message' => 'Civil Service Added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Civil Service', 'message' => $th->getMessage().'Failed to add Civil Service!', 'status' => 'error']);
        }
    }

    public function update(PdsCivilServiceRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->cs as $cs) {
                $request->user()->pdsCivilService()->updateOrCreate([
                    'id' => $cs['csid']
                ],[
                    'careerservice' => $cs['eligibility'],
                    'rating' => $cs['rating'],
                    'examination' => Carbon::parse($cs['dateofexaminationconferment'])->format('Y-m-d'),
                    'placeexamination' => $cs['placeofexaminationconferment'],
                    'licensenumber' => $cs['license']['number'],
                    'validity' => $cs['license']['dateofvalidity'] ? Carbon::parse($cs['license']['dateofvalidity'])->format('Y-m-d') : $cs['license']['dateofvalidity'],
                ]);
            }

            if($request->deletedCS && count($request->deletedCS) !== 0)
                PdsCivilService::destroy($request->deletedCS);

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
                    'message' => 'updated '.$pronoun.' PDS civil service eligbility.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Civil Service', 'message' => 'Civil Service Updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Civil Service', 'message' => $th->getMessage().'Failed to update Civil Service!', 'status' => 'error']);
        }
    }
}
