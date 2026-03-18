<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNamthueduOtpLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('otp_logs', function (Blueprint $table) {
            $table->id('oId');
            $table->unsignedBigInteger('userId');
            $table->string('oCode', 6);
            $table->dateTime('oExpired_at');
            $table->boolean('oVerified')->default(false);
            $table->timestamp('oCreated_at')->useCurrent();
            
            $table->foreign('userId')->references('uId')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('otp_logs');
    }
}
