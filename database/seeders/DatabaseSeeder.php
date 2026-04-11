<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $categories = Category::factory()->count(6)->create([
            'user_id' => $testUser->id,
        ]);

        $notes = Note::factory()->count(2)->create([
            'user_id' => $testUser->id,
        ]);

        foreach ($notes as $note) {
            $randomCategoryIds = $categories->random(rand(1, 3))->pluck('id');
            
            $note->categories()->attach($randomCategoryIds);
        }
    }
}
