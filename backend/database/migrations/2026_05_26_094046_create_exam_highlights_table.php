<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamHighlightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_highlights', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('exam_id');
            $table->string('skill', 20)->default('reading');
            $table->unsignedTinyInteger('part_number');
            $table->unsignedInteger('start_offset');
            $table->unsignedInteger('end_offset');
            $table->string('color', 20)->default('yellow');
            $table->text('selected_text');
            $table->timestamps();

            $table->index(['user_id', 'exam_id', 'part_number']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exam_highlights');
    }
}
