<?php

namespace Database\Seeders;

use App\Models\SocialMediaPost;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialMediaPostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SocialMediaPost::create([
            'platform' => 'Twitter',
            'content' => 'Check out our new policy initiative!',
            'post_url' => 'https://twitter.com/example/status/123456789',
            'post_date' => now(),
        ]);

    }
}
