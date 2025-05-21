<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\LogsReport;
use App\Models\ServiceRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogsReportController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type') ?? "leave";
        $status = $request->query('status') ?? "all";
        $filterYear = $request->query('filterYear') ?? "all";

        $logs = User::withoutGlobalScopes()
            ->with(['logs' => function ($query) use ($type, $status, $filterYear) {
                $query->where('type', $type)
                    ->when($status != "all", function ($query) use ($status) {
                        $query->where('status', $status);
                    })
                    ->when($filterYear != "all", function ($query) use ($filterYear) {
                        $query->whereYear('created_at', $filterYear);
                    })
                    ->latest();
            }])
            ->excludeHr()
            ->whereHas('logs', function ($query) use ($type, $status, $filterYear) {
                $query->where('type', $type)
                    ->when($status != "all", function ($query) use ($status) {
                        $query->where('status', $status);
                    })
                    ->when($filterYear != "all", function ($query) use ($filterYear) {
                        $query->whereYear('created_at', $filterYear);
                    });
            })
            ->select('id', 'firstname', 'lastname', 'middlename', 'avatar')
            ->orderBy('lastname')
            ->paginate($this->page);

        if ($request->expectsJson())
            return response()->json($logs);

        return Inertia::render('Myreports/Logs/Logs', [
            'years' => LogsReport::selectRaw('YEAR(created_at) as year')
                ->where('type', $type)
                ->distinct()
                ->orderBy('year', 'desc')
                ->pluck('year'),
            'logs' => Inertia::defer(fn() => $logs),
            'principal' => User::where('role', 'principal')
                ->first()
        ]);
    }

    public function getYearsOnLogsType($type)
    {
        return response()->json(LogsReport::selectRaw('YEAR(created_at) as year')
            ->where('type', $type)
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year'));
    }

    public function getAllLogs(Request $request)
    {
        $type = $request->query('type') ?? "leave";
        $status = $request->query('status') ?? "all";
        $filterYear = $request->query('filterYear') ?? "all";

        $logs = LogsReport::where('type', $type)
            ->when($status != "all", function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($filterYear != "all", function ($query) use ($filterYear) {
                $query->whereYear('created_at', $filterYear);
            })
            ->latest()
            ->get();

        if($type === "leave") {
            $logs = $logs->map(function ($log) {
                $log['days'] = Leave::find($log->details['leaveid'])?->daysapplied;

                return $log;
            });
        }

        if($type === "certificate" || $type === "coc") {
            $logs = $logs->map(function ($log) use ($type) {
                $log['credit'] = ServiceRecord::find($type == "certificate" ? $log->details['certificateid'] : $log->details['cocid'])?->details['credits'];

                return $log;
            });
        }

        return response()->json($logs);
    }

    public function getMoreRecords(Request $request, $userId)
    {
        $type = $request->query('type') ?? "leave";
        $status = $request->query('status') ?? "all";
        $filterYear = $request->query('filterYear') ?? "all";
        $rows = $request->query('rows') ?? "all";

        $logs = LogsReport::where('user_id', $userId)
            ->where('type', $type)
            ->when($status != "all", function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($filterYear != "all", function ($query) use ($filterYear) {
                $query->whereYear('created_at', $filterYear);
            })
            ->latest()
            ->when($rows != "all", function ($query) use ($rows) {
                $query->take($rows);
            })
            ->get();

        return response()->json($logs);
    }

    public function getCOCLogs(ServiceRecord $coc)
    {
        $coc->load(['user']);
        return response()->json($coc);
    }

    public function getCertificateLogs(ServiceRecord $certificate)
    {
        $certificate->load(['user']);
        return response()->json($certificate);
    }
}
