<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTimestampsToStudentBadgesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('student_badges')) {
            return;
        }
        Schema::table('student_badges', function (Blueprint $table) {
            if (!Schema::hasColumn('student_badges', 'created_at')) {
                $table->timestamps();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('student_badges', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
}
