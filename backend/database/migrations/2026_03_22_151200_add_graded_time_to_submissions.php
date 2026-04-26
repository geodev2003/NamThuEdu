<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGradedTimeToSubmissions extends Migration
{
    public function up()
    {
        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('submissions', 'sGraded_time')) {
                $table->timestamp('sGraded_time')->nullable()->after('sSubmit_time');
            }
        });
        }
    }

    public function down()
    {
        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
            if (Schema::hasColumn('submissions', 'sGraded_time')) {
                $table->dropColumn('sGraded_time');
            }
        });
        }
    }
}
