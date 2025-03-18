<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PdsFamilyBackground;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsFamilyBackgroundController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            "spouse.familyname" => "required",
            "spouse.firstname" => "required",
            "spouse.middlename" => "required",
            "spouse.extensionname" => "required",
            "spouse.occupation" => "required",
            "spouse.employerbusiness" => "required",
            "spouse.businessaddress" => "required",
            "spouse.telephone" => "required",
            "father.familyname" => "required",
            "father.firstname" => "required",
            "father.middlename" => "required",
            "father.extensionname" => "required",
            "mother.familyname" => "required",
            "mother.firstname" => "required",
            "mother.middlename" => "required",
            "chldren.*.name" => "required",
            "chldren.*.dateofbirth" => "required|date",
        ], [
            "spouse.familyname.required" => "The surname field is required.",
            "spouse.extensionname.required" => "The extension name field is required.",
            "spouse.employerbusiness.required" => "The employer/business name field is required.",
            "spouse.businessaddress.required" => "The business address field is required.",
            "father.middlename.required" => "The extension name field is required.",
            "chldren.*.name.required" => "The name field is required.",
            "chldren.*.dateofbirth.required" => "The date of birth field is required.",
        ]);

        DB::beginTransaction();
        try {

            $request->user()->pdsFamilyBackground()->create([
                "type" => "spouse",
                "details" => $request->spouse
            ]);

            $request->user()->pdsFamilyBackground()->create([
                "type" => "father",
                "details" => $request->father
            ]);

            $request->user()->pdsFamilyBackground()->create([
                "type" => "mother",
                "details" => $request->mother
            ]);

            $request->user()->pdsFamilyBackground()->create([
                "type" => "child",
                "details" => $request->children
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
                    'message' => 'updated '.$pronoun.' PDS family background.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Family Background', 'message' => 'Family Background Added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with(['title' => 'Family Background', 'message' => 'Failed to add Family Background!', 'status' => 'error']);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            "spouse.familyname" => "required",
            "spouse.firstname" => "required",
            "spouse.middlename" => "required",
            "spouse.extensionname" => "required",
            "spouse.occupation" => "required",
            "spouse.employerbusiness" => "required",
            "spouse.businessaddress" => "required",
            "spouse.telephone" => "required",
            "father.familyname" => "required",
            "father.firstname" => "required",
            "father.middlename" => "required",
            "father.extensionname" => "required",
            "mother.familyname" => "required",
            "mother.firstname" => "required",
            "mother.middlename" => "required",
            "chldren.*.name" => "required",
            "chldren.*.dateofbirth" => "required|date",
        ], [
            "spouse.familyname.required" => "The surname field is required.",
            "spouse.extensionname.required" => "The extension name field is required.",
            "spouse.employerbusiness.required" => "The employer/business name field is required.",
            "spouse.businessaddress.required" => "The business address field is required.",
            "father.middlename.required" => "The extension name field is required.",
            "chldren.*.name.required" => "The name field is required.",
            "chldren.*.dateofbirth.required" => "The date of birth field is required.",
        ]);

        DB::beginTransaction();
        try {

            $request->user()->pdsFamilyBackground()->where('type', 'spouse')->update([
                "type" => "spouse",
                "details" => $request->spouse
            ]);

            $request->user()->pdsFamilyBackground()->where('type', 'father')->update([
                "type" => "father",
                "details" => $request->father
            ]);

            $request->user()->pdsFamilyBackground()->where('type', 'mother')->update([
                "type" => "mother",
                "details" => $request->mother
            ]);

            $request->user()->pdsFamilyBackground()->where('type', 'child')->update([
                "type" => "child",
                "details" => $request->children
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
                    'message' => 'updated '.$pronoun.' PDS family background.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Family Background', 'message' => 'Family Background Updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with(['title' => 'Family Background', 'message' => 'Failed to update Family Background!', 'status' => 'error']);
        }
    }
}
