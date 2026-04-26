<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blog_types', function (Blueprint $table) {
            $table->id();
            $table->string('type_value')->unique(); // grammar, tips, vocabulary, etc.
            $table->string('type_label'); // Grammar, Tips, Vocabulary, etc.
            $table->string('type_icon')->default('FileText'); // Icon name from lucide-react
            $table->boolean('is_default')->default(false); // Default types cannot be deleted
            $table->integer('sort_order')->default(0); // For ordering
            $table->timestamps();
        });

        // Insert default types
        DB::table('blog_types')->insert([
            [
                'type_value' => 'grammar',
                'type_label' => 'Grammar',
                'type_icon' => 'BookOpen',
                'is_default' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'tips',
                'type_label' => 'Tips',
                'type_icon' => 'Lightbulb',
                'is_default' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'vocabulary',
                'type_label' => 'Vocabulary',
                'type_icon' => 'BookMarked',
                'is_default' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'teaching',
                'type_label' => 'Teaching',
                'type_icon' => 'GraduationCap',
                'is_default' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'news',
                'type_label' => 'News',
                'type_icon' => 'Newspaper',
                'is_default' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_types');
    }
};
