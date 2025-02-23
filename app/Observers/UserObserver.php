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
        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'login' => "[Login here!](".route('login').")",
        ];
        
        Mail::to($user->email)
            ->send(new EmailNotification(
                'Welcome to SDNHS-HRIS!',
                'newaccount',
                $data
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
