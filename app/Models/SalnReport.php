<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalnReport extends Model
{
    protected $fillable = [
        'user_id',
        "year",
        "details",
    ];

    protected function casts(): array
    {
        return [
            'details' => 'json'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
