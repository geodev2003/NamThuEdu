<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'pTitle' => $this->faker->sentence(),
            'pContent' => $this->faker->paragraphs(3, true),
            'pAuthor_id' => User::factory()->create(['uRole' => 'teacher'])->uId,
            'pType' => $this->faker->randomElement(['grammar', 'tips', 'vocabulary']),
            'pCategory' => Category::factory(),
            'pStatus' => $this->faker->randomElement(['active', 'inactive', 'draft']),
            'pView' => $this->faker->numberBetween(0, 1000),
            'pLike' => $this->faker->numberBetween(0, 100),
        ];
    }
}
