<?php

namespace App\Http\Controllers;

use App\Http\Requests\PdsEducationalBackgroundRequest;
use App\Models\Notification;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsEducationalBackgroundController extends Controller
{
    public function store(PdsEducationalBackgroundRequest $request)
    {
        DB::beginTransaction();
        try {

            $request->user()->pdsEducationalBackground()->create([
                "type" => "elementary",
                "details" => $request->elementary
            ]);

            $request->user()->pdsEducationalBackground()->create([
                "type" => "secondary",
                "details" => $request->secondary
            ]);

            $request->user()->pdsEducationalBackground()->create([
                "type" => "senior",
                "details" => $request->senior
            ]);

            $request->user()->pdsEducationalBackground()->create([
                "type" => "vocational",
                "details" => $request->vocational
            ]);

            $request->user()->pdsEducationalBackground()->create([
                "type" => "college",
                "details" => $request->college
            ]);

            $request->user()->pdsEducationalBackground()->create([
                "type" => "graduate",
                "details" => $request->graduatestudies
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
                    'message' => 'updated '.$pronoun.' PDS educational background.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Educational Background', 'message' => 'Educational Background added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Educational Background', 'message' => $th->getMessage() . 'Failed to add Educational Background', 'status' => 'error']);
        }
    }

    public function update(PdsEducationalBackgroundRequest $request)
    {
        DB::beginTransaction();
        try {

            $request->user()->pdsEducationalBackground()->where('type', 'elementary')->update([
                "type" => "elementary",
                "details" => $request->elementary
            ]);

            $request->user()->pdsEducationalBackground()->where('type', 'secondary')->update([
                "type" => "secondary",
                "details" => $request->secondary
            ]);

            $request->user()->pdsEducationalBackground()->where('type', 'senior')->update([
                "type" => "senior",
                "details" => $request->senior
            ]);

            $request->user()->pdsEducationalBackground()->where('type', 'vocational')->update([
                "type" => "vocational",
                "details" => $request->vocational
            ]);

            $request->user()->pdsEducationalBackground()->where('type', 'college')->update([
                "type" => "college",
                "details" => $request->college
            ]);

            $request->user()->pdsEducationalBackground()->where('type', 'graduate')->update([
                "type" => "graduate",
                "details" => $request->graduatestudies
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
                    'message' => 'updated '.$pronoun.' PDS educational background.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Educational Background', 'message' => 'Educational Background updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Educational Background', 'message' => 'Failed to update Educational Background', 'status' => 'error']);
        }
    }
}
