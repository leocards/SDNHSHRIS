<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocatorSlip extends Model
{
    protected $fillable = [
        'user_id',
        'principal_id',
        'dateoffiling',
        'purposeoftravel',
        'type',
        'destination',
        'agenda',
        'status',
        'memo',
        'approved_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function principal()
    {
        return $this->belongsTo(User::class);
    }

    public function casts(): array
    {
        return [
            'agenda' => 'json'
        ];
    }
}
