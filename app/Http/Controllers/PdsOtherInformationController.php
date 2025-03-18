<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsOtherInformationController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {

            $request->user()->pdsOtherInformation()->create([
                'type' => 'skills',
                'details' => $request->skills
            ]);

            $request->user()->pdsOtherInformation()->create([
                'type' => 'recognition',
                'details' => $request->nonacademicrecognition
            ]);

            $request->user()->pdsOtherInformation()->create([
                'type' => 'association',
                'details' => $request->membership
            ]);

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
                    'message' => 'updated '.$pronoun.' PDS other information.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Other Information', 'message' => 'Other Information added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Other Information', 'message' => 'Failed to add Other Information!', 'status' => 'error']);
        }
    }

    public function update(Request $request)
    {
        DB::beginTransaction();
        try {

            $request->user()->pdsOtherInformation()->where('type', 'skills')->update([
                'type' => 'skills',
                'details' => $request->skills
            ]);

            $request->user()->pdsOtherInformation()->where('type', 'recognition')->update([
                'type' => 'recognition',
                'details' => $request->nonacademicrecognition
            ]);

            $request->user()->pdsOtherInformation()->where('type', 'association')->update([
                'type' => 'association',
                'details' => $request->membership
            ]);

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
                    'message' => 'updated '.$pronoun.' PDS other information.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Other Information', 'message' => 'Other Information updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Other Information', 'message' => 'Failed to updated Other Information!', 'status' => 'error']);
        }
    }
}
