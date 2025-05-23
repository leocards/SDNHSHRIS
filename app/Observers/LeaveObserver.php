<?php

namespace App\Observers;

use App\Mail\EmailNotification;
use App\Models\Leave;
use App\Models\LogsReport;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Mail;

class LeaveObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the Leave "created" event.
     */
    public function created(Leave $leave): void
    {
        $user = User::find($leave->user_id);
        $hr = User::where('role', 'hr')->first()->id;

        Notification::create([
            'user_id' => $hr,
            'from_user_id' => $user->id,
            'type' => 'leave',
            'details' => collect([
                'link' => route('myapproval.leave.view', [$leave->id]),
                'message' => 'sends an application for leave.'
            ])->toArray()
        ]);
    }

    /**
     * Handle the Leave "updated" event.
     */
    public function updated(Leave $leave): void
    {
        $user = User::find($leave->user_id);
        $hr = User::where('role', 'hr')->first();

        // if the leave application is not from principal
        if($user->role != 'principal') {
            $principal = User::where('role', 'principal')->first();

            // if hr have responded, send notification to personnel
            if($leave->hrstatus != "pending" && $leave->principalstatus == "pending") {

                Notification::create([
                    'user_id' => $user->id,
                    'from_user_id' => $hr->id,
                    'type' => 'leave',
                    'details' => collect([
                        'link' => route('leave.view', [$leave->id]),
                        'message' => 'has '.$leave->hrstatus.' your application for leave, and it is now pending the principal\'s approval.'
                    ])->toArray()
                ]);

                Notification::create([
                    'user_id' => $principal->id,
                    'from_user_id' => $hr->id,
                    'type' => 'leave',
                    'details' => collect([
                        'link' => route('myapproval.leave.view', [$leave->id]),
                        'message' => 'has '.$leave->hrstatus.' application for leave of '.$user->full_name.', and it is now pending for your approval.'
                    ])->toArray()
                ]);

                LogsReport::create([
                    'user_id' => $leave->user_id,
                    'type' => 'leave',
                    'status' => $leave->hrstatus,
                    'details' => collect([
                        'leaveid' => $leave->id,
                        'userid' => $user->id,
                        'username' => $user->name,
                        'type' => $leave->type,
                    ])->toArray()
                ]);

            } else if($leave->hrstatus != "pending" && $leave->principalstatus != "pending") {
                Notification::create([
                    'user_id' => $user->id,
                    'from_user_id' => $principal->id,
                    'type' => 'leave',
                    'details' => collect([
                        'link' => route('myapproval.leave.view', [$leave->id]),
                        'message' => 'has '.$leave->hrstatus.' your application for leave.'
                    ])->toArray()
                ]);

                if($user->enable_email_notification)
                    Mail::to($user->email)
                        ->send(new EmailNotification(
                            'APPLICATION FOR LEAVE',
                            'leave',
                            [
                                'name' => $user->name,
                                'status' => $leave->principalstatus,
                                'message' => $leave->principalstatus,
                                'sender' => [
                                    'name' => $principal->name,
                                    'position' => $principal->position,
                                ],
                            ]
                        ));
            }
        } else {
            Notification::create([
                'user_id' => $leave->user_id,
                'from_user_id' => $hr->id,
                'type' => 'leave',
                'details' => collect([
                    'link' => route('leave.view', [$leave->id]),
                    'message' => 'has '.$leave->hrstatus.' your application for leave.'
                ])->toArray()
            ]);

            LogsReport::create([
                'user_id' => $leave->user_id,
                'type' => 'leave',
                'status' => $leave->hrstatus,
                'details' => collect([
                    'leaveid' => $leave->id,
                    'userid' => $user->id,
                    'username' => $user->name,
                    'type' => $leave->type,
                ])->toArray()
            ]);
        }
    }
}
