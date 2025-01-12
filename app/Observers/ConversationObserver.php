<?php

namespace App\Observers;

use App\Events\MessageEvent;
use App\Mail\EmailNotification;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Mail;

class ConversationObserver implements ShouldHandleEventsAfterCommit
{
    public function created(Conversation $conversation): void
    {
        MessageEvent::dispatch($conversation);

        $message = Message::find($conversation->message_id);

        $userid = $conversation->sender == $message->sender ? $message->receiver : $message->sender;

        $user = User::find($userid);

        if($user->enable_email_message_notification) {
            $userSender = User::find($conversation->sender)->full_name;

            Mail::to($user->email)
                ->send(new EmailNotification(
                    $userSender." sent you a message",
                    "message",
                    [
                        "user" => $userSender,
                        "message" => $conversation->message,
                        "time" => Carbon::parse($conversation->created_at)->parse('F d Y h:i A')
                    ]
                ));
        }
    }
}
