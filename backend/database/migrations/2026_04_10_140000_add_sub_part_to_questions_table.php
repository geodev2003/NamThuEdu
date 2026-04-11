<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Thêm field qSubPart để support Cambridge YLE Parts structure
     * - qPart: Main part (1=Listening, 2=Reading/Writing, 3=Speaking)
     * - qSubPart: Cambridge sub-part number (Part 1, Part 2, etc. within a skill)
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Add qSubPart for Cambridge YLE structure
            if (!Schema::hasColumn('questions', 'qSubPart')) {
                $table->integer('qSubPart')
                      ->nullable()
                      ->after('qPart')
                      ->comment('Cambridge sub-part number (Part 1, Part 2, etc. within a skill section)');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'qSubPart')) {
                $table->dropColumn('qSubPart');
            }
        });
    }
};
