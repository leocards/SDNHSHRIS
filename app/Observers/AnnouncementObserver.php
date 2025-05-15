<?php

namespace App\Observers;

use App\Mail\EmailNotification;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Mail;

class AnnouncementObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the Announcement "created" event.
     */
    public function created(Announcement $announcement): void
    {
        $users = User::excludeHr()->get(['id', 'email', 'enable_email_announcement_reminder']);

            $users->each(function ($user) use ($announcement) {
                if($user->enable_email_announcement_reminder) {
                    Mail::to($user->email)
                        ->send(new EmailNotification(
                            'ANNOUNCEMENT',
                            'announcement',
                            [
                                'announcement' => $announcement->title,
                                'login' => "[Login here!](" . route('login') . ")"
                            ]
                        ));
                }
            });
    }
}
