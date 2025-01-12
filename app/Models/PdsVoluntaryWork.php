<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdsVoluntaryWork extends Model
{
    protected $fillable = [
        'user_id',
        'organization',
        'inclusivedates',
        'numberofhours',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'inclusivedates' => 'json',
        ];
    }
}
