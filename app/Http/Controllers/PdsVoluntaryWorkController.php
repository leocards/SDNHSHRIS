<?php

namespace App\Http\Controllers;

use App\Http\Requests\PdsVoluntaryWorkRequest;
use App\Models\Notification;
use App\Models\PdsVoluntaryWork;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsVoluntaryWorkController extends Controller
{
    public function store(PdsVoluntaryWorkRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->vw as $vw) {
                $request->user()->pdsVoluntaryWork()->create([
                    'organization' => $vw['nameandaddress'],
                    'inclusivedates' => $vw['inclusivedates'],
                    'numberofhours' => $vw['numberofhours'],
                    'position' => $vw['positionornatureofwork'],
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
                    'message' => 'updated '.$pronoun.' PDS voluntary work or involvement in civic/non-government/people/voluntary organization/s.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Voluntary Work', 'message' => 'Voluntary Work added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Voluntary Work', 'message' => $th->getMessage().'Failed to add Voluntary Work!', 'status' => 'error']);
        }
    }

    public function update(PdsVoluntaryWorkRequest $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request->vw as $vw) {
                $request->user()->pdsVoluntaryWork()->updateOrCreate([
                    'id' => $vw['vwid']
                ],[
                    'organization' => $vw['nameandaddress'],
                    'inclusivedates' => $vw['inclusivedates'],
                    'numberofhours' => $vw['numberofhours'],
                    'position' => $vw['positionornatureofwork'],
                ]);
            }

            if($request->deletedVW && count($request->deletedVW) !== 0)
                PdsVoluntaryWork::destroy($request->deletedVW);

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
                    'message' => 'updated '.$pronoun.' PDS voluntary work or involvement in civic/non-government/people/voluntary organization/s.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Voluntary Work', 'message' => 'Voluntary Work updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Voluntary Work', 'message' => $th->getMessage().'Failed to update Voluntary Work!', 'status' => 'error']);
        }
    }
}
