<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Disable User model events during seeding to prevent validation constraint exceptions
        \App\Models\User::flushEventListeners();

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            TestSystemSeeder::class, // Real VSTEP exam data
            CambridgeTemplateSeeder::class, // Cambridge exam templates
            TeacherExamSeeder::class, // Teacher test data for exam & assignment features
        ]);
    }
}
