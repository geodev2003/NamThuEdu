<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['caName' => 'TOEIC'],
            ['caName' => 'VSTEP'],
            ['caName' => 'IELTS'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
