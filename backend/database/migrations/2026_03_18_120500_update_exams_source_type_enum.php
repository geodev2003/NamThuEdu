<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update the enum to include template source type
        DB::statement("ALTER TABLE exams MODIFY COLUMN eSource_type ENUM(
            'manual', 'upload', 'template'
        ) NOT NULL DEFAULT 'manual'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert back to original enum
        DB::statement("ALTER TABLE exams MODIFY COLUMN eSource_type ENUM(
            'manual', 'upload'
        ) NOT NULL DEFAULT 'manual'");
    }
};