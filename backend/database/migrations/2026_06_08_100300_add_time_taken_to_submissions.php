<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add `sTime_taken` (seconds) to submissions — đã có trong model fillable
     * nhưng thiếu cột thật. Dùng cho THPT (và các loại đề khác) để lưu thời gian làm bài.
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('submissions', 'sTime_taken')) {
                $table->integer('sTime_taken')->nullable()->after('sSubmit_time');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            if (Schema::hasColumn('submissions', 'sTime_taken')) {
                $table->dropColumn('sTime_taken');
            }
        });
    }
};
