<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogsReport extends Model
{
    protected $fillable = [
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
}
