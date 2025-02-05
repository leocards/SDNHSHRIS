<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'middlename',
        'extensionname',
        'birthday',
        'gender',
        'birthplace',
        'status',
        'email',
        'mobilenumber',
        'personnelid',
        'department',
        'role',
        'position',
        'hiredate',
        'credits',
        'splcredits',
        'enable_email_notification',
        'enable_email_message_notification',
        'enable_email_announcement_reminder',
        'employmentstatus',
        'salary',
        'avatar',
        'email_verified_at',
        'password',
        'status_updated_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'status_updated_at' => 'datetime',
            'birthday' => 'date',
            'hiredate' => 'date',
            'password' => 'hashed',
            'enable_email_notification' => 'boolean',
            'enable_email_message_notification' => 'boolean',
            'enable_email_announcement_reminder' => 'boolean',
        ];
    }

    /**
     * Get the role of a user
     *
     * @param string $role
     * @return Boolean
     */

    public function hasRole($role)
    {
        return $this->role == $role;
    }

    public function scopeExcludeHr(Builder $query): void
    {
        $query->whereNot('role', 'hr');
    }

    protected $appends = ['name', 'full_name'];

    public function getNameAttribute()
    {
        // Construct the full name
        $name = $this->lastname . ', ' . $this->firstname;

        // Append the middle name if it exists
        if (!empty($this->middlename) && $this->middlename != "N/A") {
            $name .= ' ' . Str::charAt($this->middlename, 0) . '.';
        }

        // Append the extension name (e.g., Jr., Sr.) if it exists
        if (!empty($this->extensionname) && $this->extensionname != "N/A") {
            $name .= ', ' . $this->extensionname;
        }

        return Str::of($name)->replaceMatches('/\s+/', ' ');
    }

    public function getFullNameAttribute()
    {
        // Construct the full name
        $name = $this->firstname;

        // Append the middle name if it exists
        if (!empty($this->middlename) && $this->middlename != "N/A") {
            $name .= ' ' . Str::charAt($this->middlename, 0) . '.';
        }

        $name .= ' ' . $this->lastname;

        // Append the extension name (e.g., Jr., Sr.) if it exists
        if (!empty($this->extensionname) && $this->extensionname != "N/A") {
            $name .= ' ' . $this->extensionname;
        }

        return Str::of($name)->replaceMatches('/\s+/', ' ');
    }

    public function scopeSearchByLastAndFirstName($query, $lname, $fname)
    {
        return $query->where(DB::raw("LOWER(lastname)"), 'LIKE', "%{$lname}%")
            ->where(DB::raw("LOWER(firstname)"), 'LIKE', "%{$fname}%")
            ->whereNot('role', 'hr');
    }

    public function sender()
    {
        return $this->hasMany(Message::class, 'sender', 'id');
    }

    public function receiver()
    {
        return $this->hasMany(Message::class, 'receiver', 'id');
    }

    public function latestSenderConversation()
    {
        return $this->hasOneThrough(
            Conversation::class,
            Message::class,
            'sender',
            'message_id',
            'id',
            'id'
        )->latest('conversations.created_at');
    }

    public function latestReceiverConversation()
    {
        return $this->hasOneThrough(
            Conversation::class,
            Message::class,
            'receiver',
            'message_id',
            'id',
            'id'
        )->latest('conversations.created_at');
    }

    public function personalDataSheet(): HasOne
    {
        return $this->hasOne(PersonalDataSheet::class);
    }

    public function pdsPersonalInformation(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(PdsPersonalInformation::class);
    }

    public function pdsFamilyBackground(): HasMany
    {
        return $this->hasMany(PdsFamilyBackground::class);
    }

    public function pdsEducationalBackground(): HasMany
    {
        return $this->hasMany(PdsEducationalBackground::class);
    }

    public function pdsCivilService(): HasMany
    {
        return $this->hasMany(PdsCivilService::class);
    }

    public function pdsWorkExperience(): HasMany
    {
        return $this->hasMany(PdsWorkExperience::class);
    }

    public function pdsVoluntaryWork(): HasMany
    {
        return $this->hasMany(PdsVoluntaryWork::class);
    }

    public function pdsLearningAndDevelopment(): HasMany
    {
        return $this->hasMany(PdsLearningDevelopment::class);
    }

    public function pdsOtherInformation(): HasMany
    {
        return $this->hasMany(PdsOtherInformation::class);
    }

    public function pdsC4(): HasMany
    {
        return $this->hasMany(PdsCs4::class);
    }

    public function temporary()
    {
        return $this->hasMany(Temporary::class);
    }

    public function serviceRecord()
    {
        return $this->hasMany(ServiceRecord::class);
    }

    public function ipcrratings()
    {
        return $this->hasMany(IpcrReport::class);
    }

    public function salnreport()
    {
        return $this->hasMany(SalnReport::class);
    }

    public function tardiness()
    {
        return $this->hasMany(Tardiness::class);
    }

    public function leave()
    {
        return $this->hasMany(Leave::class);
    }

    public function userCredit()
    {
        return $this->hasMany(UserCredit::class);
    }
}
