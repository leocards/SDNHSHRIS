<?php

namespace App\Console\Commands;

use App\Models\Temporary;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RemoveTemporariesTableCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-temporaries-table-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete temporaries record to the database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        try {
            DB::transaction(function () {
                Temporary::where('created_at', '<=', Carbon::now()->subMinute())
                    ->get()
                    ->each(function ($temporary) {
                        if (Storage::exists($temporary->path)) {
                            Storage::delete($temporary->path);
                        }

                        $temporary->delete();
                    });
            });
        } catch (\Throwable $th) {
            Log::info('Error deleting temporaries: ' . $th->getMessage());
        }
    }
}
