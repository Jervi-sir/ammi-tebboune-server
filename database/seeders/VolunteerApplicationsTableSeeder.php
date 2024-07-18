<?php

namespace Database\Seeders;

use App\Models\VolunteerApplication;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VolunteerApplicationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        VolunteerApplication::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '123-456-7890',
            'message' => 'I want to volunteer for the campaign.',
        ]);
    }

}
