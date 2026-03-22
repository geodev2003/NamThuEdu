<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddPartiallyGradedStatus extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE submissions MODIFY COLUMN sStatus ENUM('in_progress', 'submitted', 'graded', 'partially_graded') DEFAULT 'in_progress'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE submissions MODIFY COLUMN sStatus ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress'");
    }
}
