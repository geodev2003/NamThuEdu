<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id('qId');
            $table->unsignedBigInteger('exam_id');
            $table->text('qContent');
            $table->string('qMedia_url')->nullable();
            $table->integer('qPoints')->default(1);
            $table->text('qTranscript')->nullable();
            $table->text('qExplanation')->nullable();
            $table->integer('qListen_limit')->default(1);
            $table->timestamp('qCreated_at')->useCurrent();
            
            $table->foreign('exam_id')->references('eId')->on('exams')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
