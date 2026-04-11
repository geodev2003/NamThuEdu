<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProfileFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Avatar URL for profile picture
            $table->string('avatar_url', 255)->nullable()->after('uAddress');
            
            // Bio/description for student profile
            $table->text('bio')->nullable()->after('avatar_url');
            
            // Language preference (vi = Vietnamese, en = English)
            $table->string('language_preference', 10)->default('vi')->after('theme_preference');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar_url', 'bio', 'language_preference']);
        });
    }
}
