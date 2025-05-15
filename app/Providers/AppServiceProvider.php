<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\ClassAssumption;
use App\Models\Conversation;
use App\Models\Leave;
use App\Models\LocatorSlip;
use App\Models\Notification;
use App\Models\PersonalDataSheet;
use App\Models\Saln;
use App\Models\ServiceRecord;
use App\Models\User;
use App\Observers\AnnouncementObserver;
use App\Observers\ClassAssumptionObserver;
use App\Observers\ConversationObserver;
use App\Observers\LeaveObserver;
use App\Observers\LocatorSlipObserver;
use App\Observers\NotificationObserver;
use App\Observers\PersonalDataSheetObserver;
use App\Observers\SALNObserver;
use App\Observers\ServiceRecordObserver;
use App\Observers\UserCreate;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Notification::observe(NotificationObserver::class);
        Conversation::observe(ConversationObserver::class);
        User::observe(UserObserver::class);
        Leave::observe(LeaveObserver::class);
        ServiceRecord::observe(ServiceRecordObserver::class);
        Saln::observe(SALNObserver::class);
        PersonalDataSheet::observe(PersonalDataSheetObserver::class);
        LocatorSlip::observe(LocatorSlipObserver::class);
        ClassAssumption::observe(ClassAssumptionObserver::class);
        Announcement::observe(AnnouncementObserver::class);
    }
}
