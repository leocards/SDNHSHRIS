<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassAssumption extends Model
{
    protected $fillable = [
        'user_id',
        'principal_id',
        'curriculumnhead_id',
        'academichead_id',
        'details',
        'status',
    ];

    public function casts(): array
    {
        return [
            'details' => 'json'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function principal()
    {
        return $this->belongsTo(User::class, 'principal_id', 'id');
    }

    public function curriculumnhead()
    {
        return $this->belongsTo(User::class, 'curriculumnhead_id', 'id');
    }

    public function academichead()
    {
        return $this->belongsTo(User::class, 'academichead_id', 'id');
    }
}
