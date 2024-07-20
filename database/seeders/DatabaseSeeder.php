<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UsersTableSeeder;
use Database\Seeders\EventsTableSeeder;
use Database\Seeders\ArticlesTableSeeder;
use Database\Seeders\DonationsTableSeeder;
use Database\Seeders\CategoriesTableSeeder;
use Database\Seeders\AchievementsTableSeeder;
use Database\Seeders\SocialMediaPostsTableSeeder;
use Database\Seeders\ContactSubmissionsTableSeeder;
use Database\Seeders\VolunteerApplicationsTableSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            UsersTableSeeder::class,
            CategoriesTableSeeder::class,
            ArticlesTableSeeder::class,
            EventsTableSeeder::class,
            AchievementsTableSeeder::class,
            ContactSubmissionsTableSeeder::class,
            VolunteerApplicationsTableSeeder::class,
            DonationsTableSeeder::class,
            SocialMediaPostsTableSeeder::class,
        ]);
    }
}
