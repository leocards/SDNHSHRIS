<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

Schedule::command('app:due-medical-command')->dailyAt("07:00")->timezone("Asia/Manila")->withoutOverlapping();

Schedule::command('app:remove-temporaries-table-command')->quarterly()->timezone("Asia/Manila")->withoutOverlapping();
