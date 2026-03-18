<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id('sId');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('exam_id');
            $table->unsignedBigInteger('assignment_id')->nullable();
            $table->integer('sAttempt')->default(1);
            $table->dateTime('sStart_time')->nullable();
            $table->dateTime('sSubmit_time')->nullable();
            $table->decimal('sScore', 5, 2)->nullable();
            $table->text('sTeacher_feedback')->nullable();
            $table->text('sGemini_feedback')->nullable();
            $table->enum('sStatus', ['in_progress', 'submitted', 'graded'])->default('in_progress');
            
            $table->foreign('user_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('exam_id')->references('eId')->on('exams')->onDelete('cascade');
            $table->foreign('assignment_id')->references('taId')->on('test_assignments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('submissions');
    }
}
