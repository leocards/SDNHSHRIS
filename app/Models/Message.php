<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender', 'receiver'
    ];

    protected function casts(): array
    {
        return [
            'temporary' => 'boolean'
        ];
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender', 'id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver', 'id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'message_id', 'id');
    }

    public function conversationLatest()
    {
        return $this->hasMany(Conversation::class, 'message_id', 'id')->latest();
    }
}
