<?php

namespace App;

use Carbon\Carbon;

trait DateParserTrait
{
    public function parseDate(string $date): string
    {
        return Carbon::parse($date)->toDateString();
    }
}
