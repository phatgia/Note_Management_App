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
            'password' => bcrypt('password'), // Mật khẩu là: password
        ]);

        $categories = Category::factory()->count(6)->create();

        Note::factory()->count(2)->create([
            'user_id' => $testUser->id,
            'category_id' => $categories->random()->id,
        ]);
    }
}
