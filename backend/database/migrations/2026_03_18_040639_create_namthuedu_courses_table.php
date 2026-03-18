<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNamthueduCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('course', function (Blueprint $table) {
            $table->id('cId');
            $table->string('cName', 100);
            $table->unsignedBigInteger('cCategory')->nullable();
            $table->integer('cNumberOfStudent')->nullable();
            $table->string('cTime', 50)->nullable();
            $table->text('cSchedule')->nullable();
            $table->date('cStartDate')->nullable();
            $table->date('cEndDate')->nullable();
            $table->enum('cStatus', ['active', 'draft', 'ongoing', 'complete'])->default('active');
            $table->unsignedBigInteger('cTeacher')->nullable();
            $table->text('cDescription')->nullable();
            $table->dateTime('cDeleteAt')->nullable();
            $table->timestamp('cCreateAt')->useCurrent();
            $table->timestamp('cUpdateAt')->nullable();
            
            $table->foreign('cCategory')->references('caId')->on('category')->onDelete('cascade');
            $table->foreign('cTeacher')->references('uId')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course');
    }
}
