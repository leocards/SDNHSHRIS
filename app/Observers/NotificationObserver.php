<?php

namespace App\Observers;

use App\Events\NotificationEvent;
use App\Models\Notification;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class NotificationObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the Notification "created" event.
     */
    public function created(Notification $notification): void
    {
        NotificationEvent::dispatch($notification);
    }

    /**
     * Handle the Notification "updated" event.
     */
    public function updated(Notification $notification): void
    {
        //
    }

    /**
     * Handle the Notification "deleted" event.
     */
    public function deleted(Notification $notification): void
    {
        //
    }

    /**
     * Handle the Notification "restored" event.
     */
    public function restored(Notification $notification): void
    {
        //
    }

    /**
     * Handle the Notification "force deleted" event.
     */
    public function forceDeleted(Notification $notification): void
    {
        //
    }
}
