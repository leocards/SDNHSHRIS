<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'from_user_id',
        'type',
        'details',
        'viewed'
    ];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id', 'id');
    }

    protected function casts(): array
    {
        return [
            'viewed' => 'boolean',
            'details' => 'json'
        ];
    }
}
