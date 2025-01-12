<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdsLearningDevelopment extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'inclusivedates',
        'numofhours',
        'type',
        'conductedby',
    ];

    protected function casts(): array
    {
        return [
            'inclusivedates' => 'json',
        ];
    }
}
