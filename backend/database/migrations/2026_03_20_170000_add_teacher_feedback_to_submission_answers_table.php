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
        Schema::table('submission_answers', function (Blueprint $table) {
            $table->text('saTeacher_feedback')->nullable()->after('saPoints_awarded');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('submission_answers', function (Blueprint $table) {
            $table->dropColumn('saTeacher_feedback');
        });
    }
};