<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AutoDeletePastLeaveApplicationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:auto-delete-past-leave-application-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            \App\Models\Leave::
                where(function ($query) {
                    $query->where('to', '<', now('Asia/Manila')->addDay())
                        ->orWhere('from', '<', now('Asia/Manila')->addDay())
                        ->whereNull('to');
                })
                ->where('principalstatus', 'pending')
                ->where('hrstatus', 'pending')
                ->update([
                    'principalstatus' => 'disapproved',
                    'hrstatus' => 'disapproved',
                    'principaldisapprovedmsg' => 'Auto Disapproved',
                    'hrdisapprovedmsg' => 'Auto Disapproved',
                    'updated_at' => Carbon::now()
                ]);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }
}
