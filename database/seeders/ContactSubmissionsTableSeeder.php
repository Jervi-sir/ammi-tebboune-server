<?php

namespace Database\Seeders;

use App\Models\ContactSubmission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSubmissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        ContactSubmission::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Inquiry',
            'message' => 'I have a question about the new policy.',
        ]);
    }

}
