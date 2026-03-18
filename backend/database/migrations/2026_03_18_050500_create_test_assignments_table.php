<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('test_assignments', function (Blueprint $table) {
            $table->id('taId');
            $table->unsignedBigInteger('exam_id');
            $table->enum('taTarget_type', ['class', 'student']);
            $table->unsignedBigInteger('taTarget_id');
            $table->dateTime('taDeadline')->nullable();
            $table->integer('taMax_attempt')->default(1);
            $table->boolean('taIs_public')->default(false);
            $table->timestamp('taCreated_at')->useCurrent();
            
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
        Schema::dropIfExists('test_assignments');
    }
}
