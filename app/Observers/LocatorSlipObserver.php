<?php

namespace App\Observers;

use App\Mail\EmailNotification;
use App\Models\LocatorSlip;
use App\Models\LogsReport;
use App\Models\Notification;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Mail;

class LocatorSlipObserver implements ShouldHandleEventsAfterCommit
{
    public function created(LocatorSlip $ls): void
    {
        $user = $ls->user;

        Notification::create([
            'user_id' => $ls->principal_id,
            'from_user_id' => $user->id,
            'type' => 'locatorslip',
            'details' => collect([
                'link' => route('myapproval.locatorslip.view', [$ls->id]),
                'message' => 'sends a locator slip.'
            ])->toArray()
        ]);
    }

    public function updated(LocatorSlip $ls): void
    {
        $user = $ls->principal;

        Notification::create([
            'user_id' => $ls->user_id,
            'from_user_id' => $user->id,
            'type' => 'locatorslip',
            'details' => collect([
                'link' => route('locatorslip.view', [$ls->id]),
                'message' => $ls->status.' your locator slip.'
            ])->toArray()
        ]);

        // Mail::to($ls->user->email)
        //     ->send(new EmailNotification(
        //         'LOCATOR SLIP APPROVAL',
        //         'ls',
        //         [
        //             'name' => $user->name,
        //             'status' => $ls->status,
        //             'sender' => [
        //                 'name' => $user->name,
        //                 'position' => $user->position,
        //             ],
        //         ]
        //     ));
    }
}
