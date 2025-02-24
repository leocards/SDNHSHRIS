<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogsReport extends Model
{
    protected $fillable = [
        "user_id",
        "type",
        "status",
        "details",
    ];

    public function casts(): array
    {
        return [
            "details" => "json"
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
