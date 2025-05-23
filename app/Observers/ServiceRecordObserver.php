<?php

namespace App\Observers;

use App\Models\LogsReport;
use App\Models\Notification;
use App\Models\ServiceRecord;
use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class ServiceRecordObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the ServiceRecord "created" event.
     */
    public function created(ServiceRecord $serviceRecord): void
    {
        $hr = User::where('role', 'hr')->first()->id;
        $user = User::where('id', $serviceRecord->user_id)->first();

        $type = $serviceRecord->type === 'coc' ? strtoupper($serviceRecord->type) : $serviceRecord->type;

        Notification::create([
            'user_id' => $hr,
            'from_user_id' => $user->id,
            'type' => 'leave',
            'details' => collect([
                'link' => route('myapproval.sr'),
                'message' => 'uploaded a '.$serviceRecord->details['name']??"service record".' '.$type.'.'
            ])->toArray()
        ]);
    }

    /**
     * Handle the ServiceRecord "updated" event.
     */
    public function updated(ServiceRecord $serviceRecord): void
    {
        $hr = User::where('role', 'hr')->first();

        $type = $serviceRecord->type === 'coc' ? strtoupper($serviceRecord->type) : $serviceRecord->type;

        if($serviceRecord->status !== "pending") {
            $user = User::find($serviceRecord->user_id);

            $details = $serviceRecord->type === 'coc' ? collect([
                'cocid' => $serviceRecord->id,
                'username' => $user->name,
            ]) : collect([
                'certificateid' => $serviceRecord->id,
                'username' => $user->name,
            ]);

            LogsReport::create([
                'user_id' => $serviceRecord->user_id,
                'type' => $serviceRecord->type,
                'status' => $serviceRecord->status,
                'details' => $details->toArray()
            ]);
        }

        Notification::create([
            'user_id' => $serviceRecord->user_id,
            'from_user_id' => $hr->id,
            'type' => 'leave',
            'details' => collect([
                'link' => route('sr'),
                'message' => 'has '.$serviceRecord->status.' your '.$serviceRecord->details['name']??"service record".' '.$type.'.'
            ])->toArray()
        ]);
    }
}
