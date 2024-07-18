<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AchievementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Achievement::create([
            'title' => 'Unemployment Reduction',
            'description' => 'Successfully reduced unemployment by 20%.',
            'date' => '2023-06-15',
            'image_url' => 'https://example.com/achievement.jpg',
        ]);
    }

}
