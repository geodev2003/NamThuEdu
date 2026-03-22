<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_types', function (Blueprint $table) {
            $table->id('etId');
            $table->string('type_code', 50)->nullable();
            $table->string('type_name', 100)->nullable();
            $table->text('etDescription')->nullable();
            $table->boolean('etHas_reading')->default(false);
            $table->boolean('etHas_listening')->default(false);
            $table->boolean('etHas_writing')->default(false);
            $table->boolean('etHas_speaking')->default(false);
            $table->string('etScoring_system', 50)->nullable();
            $table->decimal('etMax_score', 5, 2)->nullable();
            $table->decimal('etMin_pass_score', 5, 2)->nullable();
            $table->string('etOfficial_website')->nullable();
            $table->boolean('etIs_active')->default(true);
            $table->timestamp('etCreated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exam_types');
    }
}
