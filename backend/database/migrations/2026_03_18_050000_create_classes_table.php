<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id('cId');
            $table->string('cName', 100);
            $table->unsignedBigInteger('cTeacher_id');
            $table->text('cDescription')->nullable();
            $table->enum('cStatus', ['active', 'inactive'])->default('active');
            $table->timestamp('cCreated_at')->useCurrent();
            $table->unsignedBigInteger('course')->nullable();
            
            $table->foreign('cTeacher_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('course')->references('cId')->on('classes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classes');
    }
}
