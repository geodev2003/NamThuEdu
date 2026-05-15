<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssignmentRemindersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assignment_reminders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->text('message')->nullable();
            $table->timestamp('dismissed_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('assignment_id')->references('taId')->on('test_assignments')->onDelete('cascade');
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('teacher_id')->references('uId')->on('users')->onDelete('set null');

            $table->index(['student_id', 'dismissed_at']);
            $table->index(['assignment_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('assignment_reminders');
    }
}
