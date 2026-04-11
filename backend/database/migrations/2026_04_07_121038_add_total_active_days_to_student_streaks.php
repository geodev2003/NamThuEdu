<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTotalActiveDaysToStudentStreaks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('student_streaks', function (Blueprint $table) {
            $table->integer('total_active_days')->default(0)->after('last_activity_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_streaks', function (Blueprint $table) {
            $table->dropColumn('total_active_days');
        });
    }
}
