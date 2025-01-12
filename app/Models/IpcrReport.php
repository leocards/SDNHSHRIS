<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IpcrReport extends Model
{
    protected $fillable = [
        'user_id',
        'syid',
        'rating'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schoolyear()
    {
        return $this->belongsTo(SchoolYear::class, 'syid', 'id');
    }
}
