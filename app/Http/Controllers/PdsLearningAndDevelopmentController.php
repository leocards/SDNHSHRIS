<?php

namespace App\Http\Controllers;

use App\Http\Requests\PdsLearningAndDevelopmentRequest;
use App\Models\Notification;
use App\Models\PdsLearningDevelopment;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsLearningAndDevelopmentController extends Controller
{
    public function store(PdsLearningAndDevelopmentRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->ld as $ld) {
                $request->user()->pdsLearningAndDevelopment()->create([
                    'title' => $ld['title'],
                    'inclusivedates' => $ld['inclusivedates'],
                    'numofhours' => $ld['numberofhours'],
                    'type' => $ld['typeofld'],
                    'conductedby' => $ld['conductedsponsoredby'],
                ]);
            }

            if($request->deletedLD && count($request->deletedLD) !== 0)
                PdsLearningDevelopment::destroy($request->deletedLD);

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
                'from_user_id' => $request->user()->id,
                'type' => 'pdsupdate',
                'details' => collect([
                    'link' => route('myapproval.pds'),
                    'name' =>  $request->user()->full_name,
                    'avatar' => $request->user()->avatar,
                    'message' => 'updated '.$pronoun.' PDS learning and development (l&d) interventions/training programs attended.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Learning and Development', 'message' => 'Learning and Development added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Learning and Development', 'message' => $th->getMessage().'Failed to add Learning and Development!', 'status' => 'error']);
        }
    }

    public function update(PdsLearningAndDevelopmentRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->ld as $ld) {
                $request->user()->pdsLearningAndDevelopment()->updateOrCreate([
                    'id' => $ld['ldid']
                ],[
                    'title' => $ld['title'],
                    'inclusivedates' => $ld['inclusivedates'],
                    'numofhours' => $ld['numberofhours'],
                    'type' => $ld['typeofld'],
                    'conductedby' => $ld['conductedsponsoredby'],
                ]);
            }

            if($request->deletedLD && count($request->deletedLD) !== 0)
                PdsLearningDevelopment::destroy($request->deletedLD);

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
                'from_user_id' => $request->user()->id,
                'type' => 'pdsupdate',
                'details' => collect([
                    'link' => route('myapproval.pds'),
                    'message' => 'updated '.$pronoun.' PDS learning and development (l&d) interventions/training programs attended.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Learning and Development', 'message' => 'Learning and Development updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Learning and Development', 'message' => $th->getMessage().'Failed to update Learning and Development!', 'status' => 'error']);
        }
    }
}
