<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category', function (Blueprint $table) {
            $table->text('caDescription')->nullable()->after('caName');
            $table->enum('caType', ['VSTEP', 'IELTS', 'GENERAL'])->default('GENERAL')->after('caDescription');
            $table->timestamp('caCreated_at')->useCurrent()->after('caType');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('category', function (Blueprint $table) {
            $table->dropColumn(['caDescription', 'caType', 'caCreated_at']);
        });
    }
};