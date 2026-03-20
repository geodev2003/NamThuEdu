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
        // Update the enum to include Cambridge test types
        DB::statement("ALTER TABLE exams MODIFY COLUMN eType ENUM(
            'VSTEP', 'IELTS', 'GENERAL',
            'STARTERS', 'MOVERS', 'FLYERS', 
            'KET', 'PET', 'FCE', 'CAE', 'CPE',
            'TOEFL_IBT', 'PTE_ACADEMIC', 'APTIS'
        ) NOT NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert back to original enum
        DB::statement("ALTER TABLE exams MODIFY COLUMN eType ENUM(
            'VSTEP', 'IELTS', 'GENERAL'
        ) NOT NULL");
    }
};