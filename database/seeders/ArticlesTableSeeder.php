<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticlesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        for ($i=0; $i < 50; $i++) { 
            $author = User::inRandomOrder()->first();
            $category = Category::inRandomOrder()->first();
            Article::create([
                'title' => 'article ' . $i,
                'content' => 'Details of the new policy...',
                'summary' => 'Summary of the new policy...',
                'image_url' => 'https://example.com/image.jpg',
                'published_date' => now(),
                'author_id' => $author->id,
                'category_id' => $category->id,
            ]);
        }
        
    }
}
