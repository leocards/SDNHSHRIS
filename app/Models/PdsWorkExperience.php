<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdsWorkExperience extends Model
{
    protected $fillable = [
        'user_id',
        'inlcusivedates',
        'positiontitle',
        'department',
        'monthlysalary',
        'salarygrade',
        'statusofappointment',
        'isgovernment', // 'y' | 'n'
    ];

    protected function casts(): array
    {
        return [
            'inlcusivedates' => 'json',
        ];
    }
}
