<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\IpcrReport;
use App\Models\Leave;
use App\Models\SchoolYear;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $isChangePassword = Hash::check('12345678', Auth::user()->password);
        $user = Auth::user();

        $lastSevenSchoolYears = SchoolYear::latest()->limit(7)->get()?->pluck('id');

        return Inertia::render('Dashboard/Dashboard', [
            "isChangePassword" => $isChangePassword,
            "totalpersonnel" => User::whereNot('role', 'hr')->count(),
            "leave" => collect([
                "approved" => Leave::when($user->role != "hr", fn($query) => $query->where('user_id', $user->id))
                    ->where('hrstatus', 'approved')
                    ->where('principalstatus', 'approved')
                    ->count(),
                "pending" => Leave::when($user->role != "hr", fn($query) => $query->where('user_id', $user->id))
                    ->where('hrstatus', 'pending')
                    ->where('principalstatus', 'pending')
                    ->count(),
                "disapproved" => Leave::when($user->role != "hr", fn($query) => $query->where('user_id', $user->id))
                    ->where('hrstatus', 'disapproved')
                    ->where('principalstatus', 'disapproved')
                    ->count()
            ]),
            "activeleave" => Leave::with('user')
            ->when($user->role != "hr", function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->where('principalstatus', 'approved')
            ->where('hrstatus', 'approved')
            ->where(function ($query) {
                $query->whereDate('from', '<=', Carbon::now()->format('Y-m-d'))
                    ->whereDate('to', '>=', Carbon::now()->format('Y-m-d'))
                    ->orWhereDate('from', '>=', Carbon::now()->format('Y-m-d'))
                    ->whereNull('to');
            })
            ->get(['id', 'user_id', 'type', 'from', 'to']),
            "announcements" => Announcement::all(),
            "schoolyears" => SchoolYear::all(),
            "personnelperformance" => $user->role === 'hr' ? [] : IpcrReport::with('schoolyear')
                ->where('user_id', $user->id)
                ->whereIn('syid', $lastSevenSchoolYears)
                ->get()
                ->map(function ($item) {
                    return collect([
                        "sy" => $item->schoolyear['schoolyear'],
                        "rating" => (float) $item->rating
                    ]);
                }),
            "outstandingpersonnel" => $user->role === 'hr' ? $this->getMostOutstandingPersonnel() : [],
            "genderProportion" => $this->getPersonnelGenderDemographics(),
            "leaveapplications" => $user->role === 'hr' ? collect([
                "approved" => Leave::select('type', DB::raw('COUNT(id) as total'))
                    ->where('hrstatus', 'approved')
                    ->where('principalstatus', 'approved')
                    ->where('schoolyearid', count($lastSevenSchoolYears) > 0 ? $lastSevenSchoolYears[0] : "")
                    ->groupBy('type')
                    ->get(),
                "disapproved" => Leave::select('type', DB::raw('COUNT(id) as total'))
                    ->where('hrstatus', 'disapproved')
                    ->where('principalstatus', 'disapproved')
                    ->where('schoolyearid', count($lastSevenSchoolYears) > 0 ? $lastSevenSchoolYears[0] : null)
                    ->groupBy('type')
                    ->get(),
                "appliedleaves" => Leave::select('type')
                    ->whereIn('id', function ($query) use ($lastSevenSchoolYears) {
                        $query->selectRaw('MAX(id)')
                            ->from('leaves')
                            ->where('schoolyearid', count($lastSevenSchoolYears) > 0 ? $lastSevenSchoolYears[0] : null)
                            ->whereIn('principalstatus', ['approved', 'disapproved'])
                            ->whereIn('hrstatus', ['approved', 'disapproved'])
                            ->groupBy('type');
                    })
                    ->latest('created_at')
                    ->get()
            ]) : null,
            "servicecredits" => ServiceRecord::where('user_id', Auth::id())
                    ->where('status', 'approved')
                    ->where('details->creditstatus', 'pending')
                    ->get()
                    ->reduce(function ($carry, $item) {
                        return $carry + $item->details['remainingcredits'];
                    }, 0)
        ]);
    }

    public function getLeaveapplications($sy)
    {
        return response()->json(
            collect([
                "approved" => Leave::select('type', DB::raw('COUNT(id) as total'))
                    ->where('hrstatus', 'approved')
                    ->where('principalstatus', 'approved')
                    ->where('schoolyearid', $sy)
                    ->groupBy('type')
                    ->get(),
                "disapproved" => Leave::select('type', DB::raw('COUNT(id) as total'))
                    ->where('hrstatus', 'disapproved')
                    ->where('principalstatus', 'disapproved')
                    ->where('schoolyearid', $sy)
                    ->groupBy('type')
                    ->get(),
                "appliedleaves" => Leave::select('type')
                    ->whereIn('id', function ($query) use ($sy) {
                        $query->selectRaw('MAX(id)')
                            ->from('leaves')
                            ->where('schoolyearid', $sy)
                            ->whereIn('principalstatus', ['approved', 'disapproved'])
                            ->whereIn('hrstatus', ['approved', 'disapproved'])
                            ->groupBy('type');
                    })
                    ->latest('created_at')
                    ->get()
            ])
        );
    }

    function getPersonnelGenderDemographics()
    {
        $user = User::whereNot('role', 'hr')->get();

        return collect([
            'PT1' => collect([
                'male' => $user->whereIn('department', ['junior', 'senior'])->where('gender', 'male')->count(),
                'female' => $user->whereIn('department', ['junior', 'senior'])->where('gender', 'female')->count(),
            ]),
            'PT2' => collect([
                'male' => $user->where('department', 'accounting')->where('gender', 'male')->count(),
                'female' => $user->where('department', 'accounting')->where('gender', 'female')->count(),
            ]),
            'PT3' => collect([
                'male' => $user->where('role', 'principal')->where('gender', 'male')->count(),
                'female' => $user->where('role', 'principal')->where('gender', 'female')->count(),
            ])
        ]);
    }

    function getMostOutstandingPersonnel($year = "all")
    {
        $users = User::select(['id', 'firstname', 'middlename', 'lastname', 'avatar'])
            ->withAvg('ipcrratings as ratings', 'rating')
            ->where('role', 'teaching')
            ->get();

        [$aboveThreshold, $belowThreshold] = $users->partition(function ($user) {
            return $user->ratings >= 3.5;
        });

        return collect([
            'outstanding' => $aboveThreshold->sortByDesc('ratings')->values(),
            'leastperforming' => $belowThreshold->sortByDesc('ratings')->values()
        ]);
    }
}
