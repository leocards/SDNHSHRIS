<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCredit extends Model
{
    protected $fillable = [
        "user_id",
        "service_record_id",
        "credits",
        "usedcredits",
        "details"
    ];

    protected function casts(): array
    {
        return [
            "details" => 'json'
        ];
    }
}
