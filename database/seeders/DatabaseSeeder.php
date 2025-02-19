<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'firstname' => 'Floramie',
            'lastname' => 'Lopez',
            'birthday' => '2000-02-23',
            'gender' => 'female',
            'personnelid' => 'SDNHS-123',
            'department' => 'N/A',
            'role' => 'hr',
            'hiredate' => '2024-06-20',
            'enable_email_notification' => true,
            'email' => 'sdnhs.lopez.floramie@gmail.com',
            'password' => Hash::make((12345678)),
        ]);
    }
}
