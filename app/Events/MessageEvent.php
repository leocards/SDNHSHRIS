<?php

namespace App\Events;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $toUser;
    public $message;

    public function __construct(
        public Conversation $convo
    ) {
        $message = $convo->message()->first();

        // return the user id where the message needs to be sent.
        $this->toUser = $convo->sender === $message->sender ? $message->receiver : $message->sender;

        $user = User::find($convo->sender)->only(['id', 'full_name', 'avatar']);

        $this->message = collect([
            "id" => $message->id,
            "sender" => $message->sender,
            "receiver" => $message->receiver,
            "created_at" => $message->created_at,
            "updated_at" => $message->updated_at,
            "conversations" => $convo,
            "user" => $user
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('message.'.$this->toUser),
        ];
    }
}
