<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Event::create([
            'title' => 'Town Hall Meeting',
            'description' => 'A town hall meeting to discuss policies.',
            'event_date' => '2024-07-25',
            'location' => 'City Hall',
            'image_url' => 'https://example.com/event.jpg',
        ]);
    }
}
