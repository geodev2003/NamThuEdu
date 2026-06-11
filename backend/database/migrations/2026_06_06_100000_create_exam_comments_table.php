<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('parent_id')->nullable()->index()
                  ->comment('NULL = top-level comment, có giá trị = reply');
            $table->text('content');
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('exam_id')->references('eId')->on('exams')->onDelete('cascade');
            $table->foreign('user_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('exam_comments')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_comments');
    }
};
