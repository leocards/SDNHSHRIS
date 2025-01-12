<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdsOtherInformation extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'json',
        ];
    }
}
