<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStartRow;

class FirstSheetImport implements ToCollection, WithStartRow, SkipsEmptyRows
{
    public function collection(Collection $collection)
    {
        return $collection;
    }

    public function startRow(): int
    {
        return 13;
    }
}

class IPCRImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            0 => new FirstSheetImport() // Only process the first sheet (index 0)
        ];
    }
}
