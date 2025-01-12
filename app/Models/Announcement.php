<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        "title",
        "details",
    ];

    protected function casts(): array
    {
        return [
            "details" => "json"
        ];
    }
}
