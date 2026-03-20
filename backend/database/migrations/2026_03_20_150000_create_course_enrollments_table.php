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
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('status', ['enrolled', 'completed', 'dropped'])->default('enrolled');
            $table->decimal('fee_paid', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('course_id')->references('cId')->on('course')->onDelete('cascade');
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            
            // Unique constraint - một học sinh chỉ có thể đăng ký một khóa học một lần
            $table->unique(['course_id', 'student_id']);
            
            // Indexes
            $table->index(['course_id', 'status']);
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course_enrollments');
    }
};