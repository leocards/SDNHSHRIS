<?php

namespace App\Observers;

use App\Models\ClassAssumption;
use App\Models\Notification;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class ClassAssumptionObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the ClassAssumption "created" event.
     */
    public function created(ClassAssumption $classAssumption): void
    {
        // NOTE: Please add retriction for head personnel
        $user = $classAssumption->user;

        Notification::create([
            'user_id' => $classAssumption->principal_id,
            'from_user_id' => $user->id,
            'type' => 'ca',
            'details' => collect([
                'link' => route('myapproval.classassumption.view', [$classAssumption->id]),
                'message' => 'sent a class assumption.'
            ])->toArray()
        ]);
    }

    /**
     * Handle the ClassAssumption "updated" event.
     */
    public function updated(ClassAssumption $classAssumption): void
    {
        $user = $classAssumption->user;

        Notification::create([
            'user_id' => $user->id,
            'from_user_id' => $classAssumption->principal_id,
            'type' => 'ca',
            'details' => collect([
                'link' => route('classassumption.view', [$classAssumption->id]),
                'message' => 'has '.$classAssumption->status.' your class assumption.'
            ])->toArray()
        ]);
    }
}
