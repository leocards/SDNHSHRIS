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
            'firstname' => 'Test',
            'lastname' => 'User',
            'birthday' => '2000-02-23',
            'gender' => 'male',
            'personnelid' => 'SDNHS-123',
            'department' => 'junior',
            'role' => 'hr',
            'hiredate' => '2001-03-01',
            'enable_email_notification' => true,
            'email' => 'test@example.com',
            'password' => Hash::make((12345678)),
        ]);
    }
}
