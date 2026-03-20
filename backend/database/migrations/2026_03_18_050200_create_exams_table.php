<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id('eId');
            $table->string('eTitle');
            $table->text('eDescription')->nullable();
            $table->enum('eType', ['VSTEP', 'IELTS', 'GENERAL']);
            $table->enum('eSkill', ['listening', 'reading', 'writing', 'speaking']);
            $table->unsignedBigInteger('eTeacher_id');
            $table->integer('eDuration_minutes')->default(60);
            $table->boolean('eIs_private')->default(true);
            $table->enum('eSource_type', ['manual', 'upload'])->default('manual');
            $table->timestamp('eCreated_at')->useCurrent();
            
            $table->foreign('eTeacher_id')->references('uId')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exams');
    }
}
