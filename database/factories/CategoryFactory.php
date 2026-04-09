<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = [
            'bg-orange-100 text-orange-700 border-orange-200',
            'bg-blue-100 text-blue-700 border-blue-200',
            'bg-green-100 text-green-700 border-green-200',
            'bg-purple-100 text-purple-700 border-purple-200',
            'bg-pink-100 text-pink-700 border-pink-200',
        ];

        $icons = ['tag', 'star', 'heart', 'book', 'folder'];

        $names = ['Công việc', 'Học tập', 'Cá nhân', 'Ý tưởng', 'Nhật ký', 'Tài chính', 'Mục tiêu'];

        return [
            'name' => fake()->randomElement($names) . ' ' . fake()->numberBetween(1, 99), 
            'color' => fake()->randomElement($colors),
            'icon' => fake()->randomElement($icons),
            
        ];
    }
}
