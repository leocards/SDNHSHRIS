<?php

namespace App\Console\Commands;

use App\Mail\EmailNotification;
use App\Models\Leave;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class DueMedicalCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:due-medical-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notification to user for medical certificate overdue 3 or more days.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hr = User::where('role', 'hr')->first();

        $leaveWithDueMedical = Leave::with('user:id,first_name,middle_name,last_name,email')
            ->doesntHave('medical')
            ->where('type', 'sick')
            ->where(function ($query) {
                $query->whereDate('from', '<=', Carbon::today()->subDays(3))
                    ->whereNull('to')
                    ->orWhereNotNull('to')
                    ->whereDate('to', '<=', Carbon::today()->subDays(3));
            })
            ->whereNull('notifiedDueMedical')
            ->get(['id', 'user_id']);

        $leaveWithDueMedical->each(function ($leave) use ($hr) {
            $leave->notifiedDueMedical = true;
            $leave->saveQuietly();

            Notification::create([
                'user_id' => $leave->user->id,
                'type' => 'medical',
                'details' => collect([
                    'link' => route('leave.view', [$leave->id]),
                    'name' => 'HR',
                    'avatar' => $hr->avatar,
                    'message' => ': Your medical certificate was due for submission.'
                ])->toArray()
            ]);

            Mail::to($leave->user->email)
                ->send(new EmailNotification(
                    'Medical Certificate Due',
                    'duemedical',
                    ['name' => $leave->user->full_name]
                ));
        });
    }
}
