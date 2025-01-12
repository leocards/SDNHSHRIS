<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class PersonalDataSheet extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'file',
        'original'
    ];

    public function user(): Relation
    {
        return $this->belongsTo(User::class);
    }
}
