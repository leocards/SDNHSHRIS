<?php

namespace App\Observers;

use App\Models\LogsReport;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class PersonalDataSheetObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the PersonalDataSheet "updated" event.
     */
    public function updated(PersonalDataSheet $personalDataSheet): void
    {
        if($personalDataSheet->status != "pending") {
            $user = User::find($personalDataSheet->user_id);
            LogsReport::create([
                'user_id' => $personalDataSheet->user_id,
                'type' => 'pds',
                'status' => $personalDataSheet->status,
                'details' => collect([
                    'userid' => $personalDataSheet->user_id,
                    'username' => $user->name,
                ])->toArray()
            ]);
        }
    }
}
