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
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        if (Category::where('user_id', $testUser->id)->count() === 0) {
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
}
