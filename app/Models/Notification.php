<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'details',
        'viewed'
    ];

    protected function casts(): array
    {
        return [
            'viewed' => 'boolean',
            'details' => 'json'
        ];
    }
}
