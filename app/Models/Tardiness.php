<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tardiness extends Model
{
    protected $fillable = [
        "user_id",
        "school_year_id",
        "present",
        "absent",
        "month",
    ];

    public function schoolyear()
    {
        return $this->belongsTo(SchoolYear::class, "school_year_id");
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
