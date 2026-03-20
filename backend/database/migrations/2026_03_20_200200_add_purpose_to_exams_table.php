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
        Schema::table('exams', function (Blueprint $table) {
            $table->enum('ePurpose', ['exam', 'practice', 'review', 'drill', 'mock_test', 'homework'])->default('exam')->after('eSource_type');
            $table->string('eTopic')->nullable()->after('ePurpose'); // Chủ đề ôn tập
            $table->enum('eDifficulty', ['easy', 'medium', 'hard', 'mixed'])->nullable()->after('eTopic');
            $table->json('eTags')->nullable()->after('eDifficulty'); // Tags for categorization
            $table->unsignedBigInteger('eParent_exam_id')->nullable()->after('eTags'); // Link to original exam if cloned
            
            $table->foreign('eParent_exam_id')->references('eId')->on('exams')->onDelete('set null');
            $table->index(['ePurpose', 'eType']);
            $table->index(['eTeacher_id', 'ePurpose']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropForeign(['eParent_exam_id']);
            $table->dropIndex(['ePurpose', 'eType']);
            $table->dropIndex(['eTeacher_id', 'ePurpose']);
            $table->dropColumn(['ePurpose', 'eTopic', 'eDifficulty', 'eTags', 'eParent_exam_id']);
        });
    }
};