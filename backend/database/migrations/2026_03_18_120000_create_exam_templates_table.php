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
        Schema::create('exam_templates', function (Blueprint $table) {
            $table->id();
            $table->string('template_code', 20)->unique(); // 'STARTERS', 'MOVERS', 'KET', etc.
            $table->string('template_name', 100);
            $table->enum('category', ['cambridge_young', 'cambridge_main', 'international', 'specialized']);
            $table->enum('level', ['pre_a1', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']);
            $table->string('age_group', 20)->nullable(); // '6-8', '8-11', 'adult'
            $table->integer('total_duration_minutes');
            $table->json('skills'); // ['listening', 'reading', 'writing', 'speaking']
            $table->json('sections'); // Template structure
            $table->text('instructions')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exam_templates');
    }
};