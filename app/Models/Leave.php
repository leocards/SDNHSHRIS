<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    protected $fillable = [
        "user_id",
        "schoolyearid",
        "filingfrom",
        "filingto",
        "salary",
        "type",
        "others",
        "daysapplied",
        "from",
        "to",
        "commutation",
        "principalstatus",
        "principaldisapprovedmsg",
        "hrstatus",
        "hrdisapprovedmsg",
        "details",
        "detailsinput",
        "notifiedDueMedical"
    ];

    protected function casts(): array
    {
        return [
            "notifiedDueMedical" => "boolean"
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'schoolyearid', 'id');
    }

    public function medical()
    {
        return $this->HasMany(Medical::class);
    }
}
