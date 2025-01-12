<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HrLog extends Model
{
    protected $fillable = [
        'type',
        'details',
    ];
}
