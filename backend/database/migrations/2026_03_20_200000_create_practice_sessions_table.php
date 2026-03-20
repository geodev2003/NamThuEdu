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
        Schema::create('practice_sessions', function (Blueprint $table) {
            $table->id('ps_id');
            $table->string('ps_title');
            $table->text('ps_description')->nullable();
            $table->enum('ps_type', ['topic_based', 'skill_based', 'random', 'template_based', 'custom']);
            $table->enum('ps_purpose', ['review', 'practice', 'drill', 'mock_test', 'homework']);
            $table->string('ps_target_skill')->nullable(); // listening, reading, writing, speaking
            $table->string('ps_topic')->nullable(); // grammar, vocabulary, pronunciation, etc.
            $table->enum('ps_difficulty', ['easy', 'medium', 'hard', 'mixed'])->default('medium');
            $table->integer('ps_duration_minutes')->default(30);
            $table->integer('ps_question_count')->default(10);
            $table->unsignedBigInteger('ps_teacher_id');
            $table->unsignedBigInteger('ps_exam_id')->nullable(); // Link to generated exam
            $table->json('ps_config')->nullable(); // Additional configuration
            $table->boolean('ps_is_active')->default(true);
            $table->timestamp('ps_created_at')->useCurrent();
            $table->timestamp('ps_updated_at')->useCurrent()->useCurrentOnUpdate();
            
            $table->foreign('ps_teacher_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('ps_exam_id')->references('eId')->on('exams')->onDelete('set null');
            
            $table->index(['ps_teacher_id', 'ps_type']);
            $table->index(['ps_target_skill', 'ps_difficulty']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('practice_sessions');
    }
};