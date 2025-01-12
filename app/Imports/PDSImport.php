<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithColumnLimit;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStartRow;

class FirstSheetImport implements ToCollection, WithStartRow, SkipsEmptyRows, WithColumnLimit, WithChunkReading
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        return $collection;
    }

    public function startRow(): int
    {
        return 15;
    }

    public function endColumn(): string
    {
        return 'N';
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}

class SecondSheetImport implements ToCollection, WithStartRow, SkipsEmptyRows, WithChunkReading
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        return $collection;
    }

    public function startRow(): int
    {
        return 5;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}

class ThirdSheetImport implements ToCollection, WithStartRow, SkipsEmptyRows, WithChunkReading
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        return $collection;
    }

    public function startRow(): int
    {
        return 6;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}

class FourthSheetImport implements ToCollection, WithStartRow, WithChunkReading
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        return $collection;
    }

    public function startRow(): int
    {
        return 11;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}

class PDSImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'C1' => new FirstSheetImport(),
            'C2' => new SecondSheetImport(),
            'C3' => new ThirdSheetImport(),
            'C4' => new FourthSheetImport(),
        ];
    }
}
