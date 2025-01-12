<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRecord extends Model
{
    protected $fillable = [
        'user_id',
        'type', // certificate - coc
        'details', // json creditstatus = pending|used|reset
        'status',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'json'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function creditsRecord()
    {
        return $this->hasMany(UserCredit::class);
    }
}
