<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('uId');
            $table->string('uPhone', 20)->unique();
            $table->string('uPassword');
            $table->string('uName', 150)->nullable();
            $table->boolean('uGender')->nullable();
            $table->text('uAddress')->nullable();
            $table->unsignedBigInteger('uClass')->nullable();
            $table->enum('uRole', ['student', 'teacher', 'admin'])->default('student');
            $table->date('uDoB')->nullable();
            $table->enum('uStatus', ['active', 'inactive'])->default('active');
            $table->timestamp('uCreated_at')->useCurrent();
            $table->softDeletes('uDeleted_at');
            
            // Foreign key will be added after classes table is created
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
