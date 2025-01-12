<?php

namespace App\Observers;

use App\Mail\EmailNotification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        Mail::to($user->email)
            ->send(new EmailNotification(
                'Welcome to SDNHS-HRIS!',
                'newaccount',
                [
                    'name' => $user->name,
                    'email' => $user->email,
                    'login' => "[Login here!](".route('login').")",
                ]
            ));
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
