<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('exam_templates')->onDelete('cascade');
            $table->string('section_name', 50); // 'Part 1', 'Reading', 'Listening', etc.
            $table->integer('section_order');
            $table->integer('duration_minutes');
            $table->integer('question_count');
            $table->json('question_types'); // ['multiple_choice', 'fill_blank', 'matching', etc.]
            $table->text('instructions')->nullable();
            $table->json('section_config')->nullable(); // Additional configuration
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('template_sections');
    }
};