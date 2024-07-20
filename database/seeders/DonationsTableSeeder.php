<?php

namespace Database\Seeders;

use App\Models\Donation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DonationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Donation::create([
            'donor_name' => 'Alice Johnson',
            'amount' => 100.00,
            'date' => now(),
            'email' => 'alice@example.com',
        ]);

    }
}
