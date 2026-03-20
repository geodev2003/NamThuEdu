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
        Schema::table('questions', function (Blueprint $table) {
            // Add VSTEP-specific fields
            $table->text('qPassage_text')->nullable()->after('qConfig'); // For reading passages
            $table->integer('qWord_count')->nullable()->after('qPassage_text'); // For writing tasks
            $table->integer('qTime_limit')->nullable()->after('qWord_count'); // For speaking tasks (seconds)
            $table->decimal('qWeight', 5, 2)->nullable()->after('qTime_limit'); // For weighted scoring (e.g., writing tasks)
            $table->string('qAudio_type', 50)->nullable()->after('qWeight'); // announcement, dialogue, lecture
            $table->integer('qPlay_limit')->default(2)->after('qAudio_type'); // How many times audio can be played
            $table->boolean('qTranscript_available')->default(true)->after('qPlay_limit'); // Whether transcript is available
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn([
                'qPassage_text',
                'qWord_count', 
                'qTime_limit',
                'qWeight',
                'qAudio_type',
                'qPlay_limit',
                'qTranscript_available'
            ]);
        });
    }
};