<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    protected $fillable = [
        'start',
        'end',
        'resume',
    ];

    protected $appends = ['schoolyear'];

    public function getSchoolyearAttribute()
    {
        $start = Carbon::parse($this->start)->format('Y');
        $end = Carbon::parse($this->end)->format('Y');

        return "$start-$end";
    }
}
