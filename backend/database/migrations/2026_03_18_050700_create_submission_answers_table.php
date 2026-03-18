<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubmissionAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('submission_answers', function (Blueprint $table) {
            $table->id('saId');
            $table->unsignedBigInteger('submission_id');
            $table->unsignedBigInteger('question_id');
            $table->text('saAnswer_text')->nullable();
            $table->boolean('saIs_correct')->nullable();
            $table->decimal('saPoints_awarded', 5, 2)->nullable();
            
            $table->foreign('submission_id')->references('sId')->on('submissions')->onDelete('cascade');
            $table->foreign('question_id')->references('qId')->on('questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('submission_answers');
    }
}
