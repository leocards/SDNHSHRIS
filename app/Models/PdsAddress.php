<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdsAddress extends Model
{
    protected $fillable = [
        'pdspi_id',
        'type',
        'same',
        'houselotblockno',
        'street',
        'subdivision',
        'barangay',
        'citymunicipality',
        'province',
        'zipcode',
    ];

    protected function casts(): array
    {
        return [
            'same' => 'boolean'
        ];
    }
}
