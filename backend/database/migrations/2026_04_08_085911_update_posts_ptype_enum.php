<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdatePostsPtypeEnum extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Alter pType enum to include 'teaching' and 'news'
        DB::statement("ALTER TABLE posts MODIFY pType ENUM('grammar', 'tips', 'vocabulary', 'teaching', 'news') NOT NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE posts MODIFY pType ENUM('grammar', 'tips', 'vocabulary') NOT NULL");
    }
}
