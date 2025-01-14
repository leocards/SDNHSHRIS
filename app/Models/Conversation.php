<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'message_id',
        'sender',
        'message',
        'seen_at',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender', 'id')->select(['id', 'firstname', 'middlename', 'lastname', 'avatar']);
    }

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
