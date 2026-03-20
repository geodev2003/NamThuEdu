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
        Schema::create('class_transfers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('from_class_id');
            $table->unsignedBigInteger('to_class_id');
            $table->unsignedBigInteger('teacher_id'); // Teacher who performed the transfer
            $table->string('reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('transferred_at')->useCurrent();
            $table->timestamps();

            // Foreign keys
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('from_class_id')->references('cId')->on('classes')->onDelete('cascade');
            $table->foreign('to_class_id')->references('cId')->on('classes')->onDelete('cascade');
            $table->foreign('teacher_id')->references('uId')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index(['student_id', 'transferred_at']);
            $table->index(['from_class_id', 'to_class_id']);
            $table->index('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('class_transfers');
    }
};