<?php

namespace App\Http\Controllers;

use App\Models\SchoolYear;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SchoolYearController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'resume' => 'required|date',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            $recentSchoolYear = SchoolYear::latest()->first();

            if ($recentSchoolYear && Carbon::now()->lessThanOrEqualTo(Carbon::parse($recentSchoolYear->end))) {
                throw new Error('You cannot create a new school year while the current school year is still active.');
            }

            SchoolYear::create([
                'start' => Carbon::parse($request->start)->format('Y-m-d'),
                'end' => Carbon::parse($request->end)->format('Y-m-d'),
                'resume' => Carbon::parse($request->resume)->format('Y-m-d'),
            ]);

            User::whereIn('role', ['non-teaching', 'principal'])->update([
                'credits' => 30,
                'splcredits' => DB::raw('splcredits + 15')
            ]);
            User::where('role', 'teaching')->update(['credits' => 0]);

            $teachings = User::where('role', 'teaching')->pluck('id');

            ServiceRecord::whereIn('user_id', $teachings)->update([
                'details->remainingcredits' => 0,
                'details->creditstatus' => 'reset'
            ]);

            DB::commit();

            return back()->with(['title' => 'New School Year created!', 'message' => 'School Year created successfully.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with(['title' => 'Cannot create School Year', 'message' => $th->getMessage(), 'status' => 'error']);
        }
    }

    public function update(Request $request, SchoolYear $schoolYear)
    {
        $request->validate([
            'resume' => 'required|date',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);

        DB::beginTransaction();
        try {

            $schoolYear->update([
                'start' => Carbon::parse($request->start)->format('Y-m-d'),
                'end' => Carbon::parse($request->end)->format('Y-m-d'),
                'resume' => Carbon::parse($request->resume)->format('Y-m-d'),
            ]);

            DB::commit();

            return redirect()->back()->with(['title' => 'School Year updated!', 'message' => 'School Year updated successfully.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with(['title' => 'Cannot update School Year', 'message' => $th->getMessage(), 'status' => 'error']);
        }
    }
}
