<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    protected $fillable = [
        "user_id",
        "hr_id",
        "principal_id",
        "schoolyearid",
        "filingfrom",
        "filingto",
        "salary",
        "type",
        "others",
        "daysapplied",
        "from",
        "to",
        "inclusivedates",
        "commutation",
        "principalstatus",
        "principaldisapprovedmsg",
        "hrstatus",
        "hrdisapprovedmsg",
        "details",
        "detailsinput",
        "approvedfor",
        "notifiedDueMedical",
    ];

    protected function casts(): array
    {
        return [
            "notifiedDueMedical" => "boolean",
            "approvedfor" => "json",
            "inclusivedates" => "json"
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function userWithoutScopes()
    {
        return $this->user()->withoutGlobalScopes();
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
