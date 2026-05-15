<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add default_duration column to kids_exam_types table
        if (Schema::hasTable('kids_exam_types')) {
            Schema::table('kids_exam_types', function (Blueprint $table) {
            $table->integer('default_duration')->default(60)->after('vocabulary_size')->comment('Default exam duration in minutes');
        });

        // Update existing records with official Cambridge durations
        DB::table('kids_exam_types')->where('code', 'yle_starters')->update(['default_duration' => 45]);
        DB::table('kids_exam_types')->where('code', 'yle_movers')->update(['default_duration' => 60]);
        DB::table('kids_exam_types')->where('code', 'yle_flyers')->update(['default_duration' => 75]);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('kids_exam_types')) {
            Schema::table('kids_exam_types', function (Blueprint $table) {
            $table->dropColumn('default_duration');
        });
        }
    }
};
