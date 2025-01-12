<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Relation;

class PdsPersonalInformation extends Model
{
    protected $fillable = [
        'user_id',
        'placeofbirth',
        'civilstatus',
        'height',
        'weight',
        'bloodtype',
        'gsis',
        'pagibig',
        'philhealth',
        'sss',
        'tin',
        'agencyemployee',
        'telephone',
        'mobile',
        'email',
        'citizenship',
    ];

    protected function casts(): array
    {
        return [
            // 'mobile' => 'number',
            'civilstatus' => "json",
            'citizenship' => "json"
        ];
    }

    public function scopeJsonAddresses($query)
    {
        return $query->get()->keyBy('type'); // Fetch and key by type
    }

    public function user(): Relation
    {
        return $this->belongsTo(User::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(PdsAddress::class, 'pdspi_id');
    }
}
