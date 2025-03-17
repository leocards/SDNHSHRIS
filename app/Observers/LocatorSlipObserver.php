<?php

namespace App\Observers;

use App\Models\LocatorSlip;
use App\Models\LogsReport;
use App\Models\Notification;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class LocatorSlipObserver implements ShouldHandleEventsAfterCommit
{
    public function created(LocatorSlip $ls): void
    {
        $user = $ls->user;

        Notification::create([
            'user_id' => $ls->principal_id,
            'type' => 'locatorslip',
            'details' => collect([
                'link' => route('myapproval.locatorslip.view', [$ls->id]),
                'name' =>  $user->firstname.' '.$user->lastname,
                'avatar' => $user->avatar,
                'message' => 'sends a locator slip.'
            ])->toArray()
        ]);
    }

    public function updated(LocatorSlip $ls): void
    {
        $user = $ls->principal;

        Notification::create([
            'user_id' => $ls->user_id,
            'type' => 'locatorslip',
            'details' => collect([
                'link' => route('locatorslip.view', [$ls->id]),
                'name' =>  $user->firstname.' '.$user->lastname,
                'avatar' => $user->avatar,
                'message' => $ls->status.' your locator slip.'
            ])->toArray()
        ]);
    }
}
