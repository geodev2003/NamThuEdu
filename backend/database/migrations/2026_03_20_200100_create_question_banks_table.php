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
        Schema::create('question_banks', function (Blueprint $table) {
            $table->id('qb_id');
            $table->string('qb_name');
            $table->text('qb_description')->nullable();
            $table->enum('qb_type', ['VSTEP', 'IELTS_ACADEMIC', 'IELTS_GENERAL', 'GENERAL']);
            $table->string('qb_skill'); // listening, reading, writing, speaking
            $table->string('qb_topic')->nullable(); // grammar, vocabulary, etc.
            $table->enum('qb_difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->unsignedBigInteger('qb_teacher_id');
            $table->boolean('qb_is_public')->default(false); // Can other teachers use?
            $table->integer('qb_question_count')->default(0);
            $table->json('qb_tags')->nullable(); // For categorization
            $table->timestamp('qb_created_at')->useCurrent();
            $table->timestamp('qb_updated_at')->useCurrent()->useCurrentOnUpdate();
            
            $table->foreign('qb_teacher_id')->references('uId')->on('users')->onDelete('cascade');
            
            $table->index(['qb_type', 'qb_skill']);
            $table->index(['qb_teacher_id', 'qb_is_public']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('question_banks');
    }
};