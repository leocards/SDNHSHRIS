<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdsCivilService extends Model
{
    protected $fillable = [
        'user_id',
        'careerservice',
        'rating',
        'examination',
        'placeexamination',
        'licensenumber',
        'validity',
    ];

    protected function casts(): array
    {
        return [
            "examination" => "date"
        ];
    }
}
