<?php

namespace App\Http\Controllers;

use App\Models\LogsReport;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogsReportController extends Controller
{
    public function index(Request $request)
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
            ->get();

        return response()->json($logs);
    }

    public function getCOCLogs(ServiceRecord $coc)
    {
        $coc->load(['user']);
        return response()->json($coc);
    }
}
