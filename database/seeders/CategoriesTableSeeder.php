<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'أحدث الأخبار',
            'code' => 'latest_news',
        ]);
        Category::create([
            'name' => 'الإنجازات',
            'code' => 'achievements',
        ]);
        Category::create([
            'name' => 'الأحداث الأخيرة',
            'code' => 'news',
        ]);
    }
}
