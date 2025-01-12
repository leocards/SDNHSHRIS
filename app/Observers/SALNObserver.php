<?php

namespace App\Observers;

use App\Models\Notification;
use App\Models\Saln;
use App\Models\SalnReport;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class SALNObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the Saln "created" event.
     */
    public function created(Saln $saln): void
    {
        $hr = User::where('role', 'hr')->first();
        $user = User::find($saln->user_id);

        Notification::create([
            'user_id' => $hr->id,
            'type' => 'leave',
            'details' => collect([
                'link' => route('myapproval.saln'),
                'name' =>  $user->full_name,
                'avatar' => $user->avatar,
                'message' => 'has submitted a SALN.'
            ])->toArray()
        ]);
    }

    /**
     * Handle the Saln "updated" event.
     */
    public function updated(Saln $saln): void
    {
        if($saln->status === "approved") {
            // add personnel SALN to SALN report

            $year = Carbon::parse($saln->asof)->format('Y');

            if (!SalnReport::where('year', $year)->where('user_id', $saln->user_id)->exists())
            {
                // Calculate total assets
                $assetscost = 0;
                $liabilities = 0;

                foreach($saln->assets['real'] as $realasset) {
                    $cost = is_numeric($realasset['acquisitioncost']) ? floatval($realasset['acquisitioncost']) : 0;
                    $assetscost = $assetscost + $cost;
                }
                foreach($saln->assets['personal'] as $personalasset) {
                    $cost = is_numeric($personalasset['acquisitioncost']) ? floatval($personalasset['acquisitioncost']) : 0;
                    $assetscost = $assetscost + $cost;
                }
                foreach($saln->liabilities as $liability) {
                    $cost = is_numeric($liability['outstandingbalances']) ? floatval($liability['outstandingbalances']) : 0;
                    $liabilities = $liabilities + $cost;
                }

                $spouse = $saln->spouse;

                $spousename = '';

                if($spouse['familyname']) {
                    $spousename .= $spouse['familyname'].' ';

                    if($spouse['middleinitial'])
                        $spousename .= $spouse['middleinitial'].' ';

                    $spousename .= $spouse['familyname'];

                    $spousename = $spousename.'/'.$spouse['office'].'/'.$spouse['officeaddress'];
                }

                SalnReport::create([
                    'user_id' => $saln->user_id,
                    'details' => collect([
                        "networth" => $assetscost - $liabilities,
                        "spouse" => $spousename,
                        "filing" => $saln->isjoint
                    ])->toArray(),
                    "year" => $year
                ]);
            }
        } else {
            // notify hr for a saln update
            $hr = User::where('role', 'hr')->first();
            $user = User::find($saln->user_id);

            Notification::create([
                'user_id' => $hr->id,
                'type' => 'leave',
                'details' => collect([
                    'link' => route('myapproval.saln'),
                    'name' =>  $user->full_name,
                    'avatar' => $user->avatar,
                    'message' => 'has updated a SALN.'
                ])->toArray()
            ]);
        }
    }
}
