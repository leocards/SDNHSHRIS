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
            'login' => "[Login here!](" . route('login') . ")",
        ];

        Mail::to($user->email)
            ->send(new EmailNotification(
                'Welcome to SDNHS-HRIS!',
                'newaccount',
                $data
            ));
    }
}
