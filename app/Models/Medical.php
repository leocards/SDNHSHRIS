<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medical extends Model
{
    protected $fillable = [
        'leave_id',
        'user_id',
        'path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leave()
    {
        return $this->belongsTo(Leave::class);
    }
}
