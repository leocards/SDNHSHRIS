<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saln extends Model
{
    protected $fillable = [
        'user_id',
        'asof',
        'spouse',
        'children',
        'assets',
        'liabilities',
        'biandfc',
        'relativesingovernment',
        'date',
        'isjoint',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'spouse' => 'json',
            'children' => 'json',
            'assets' => 'json',
            'liabilities' => 'json',
            'biandfc' => 'json',
            'relativesingovernment' => 'json',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
