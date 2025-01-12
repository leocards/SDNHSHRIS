<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Temporary extends Model
{
    protected $fillable = [
        'user_id',
        'path',
        'originalfilename'
    ];
}
