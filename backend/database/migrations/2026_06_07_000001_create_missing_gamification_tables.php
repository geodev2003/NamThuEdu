<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Badges definition table
        if (!Schema::hasTable('badges')) {
            Schema::create('badges', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique()->nullable();
                $table->text('description')->nullable();
                $table->string('icon', 100)->nullable();
                $table->string('color', 20)->default('#FFD700');
                $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common');
                $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all');
                $table->json('requirements')->nullable();
                $table->integer('coin_reward')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // Student badges earned
        if (!Schema::hasTable('student_badges')) {
            Schema::create('student_badges', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('student_id');
                $table->unsignedBigInteger('badge_id');
                $table->timestamp('earned_at')->useCurrent();
                $table->timestamps();

                $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
                $table->foreign('badge_id')->references('id')->on('badges')->onDelete('cascade');
                $table->unique(['student_id', 'badge_id']);
            });
        }

        // Student coin wallet
        if (!Schema::hasTable('student_coins')) {
            Schema::create('student_coins', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('student_id')->unique();
                $table->integer('total_coins')->default(0);
                $table->integer('lifetime_coins')->default(0);
                $table->integer('spent_coins')->default(0);
                $table->timestamps();

                $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            });
        }

        // Coin transaction log
        if (!Schema::hasTable('coin_transactions')) {
            Schema::create('coin_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('student_id');
                $table->enum('type', ['earn', 'spend'])->default('earn');
                $table->integer('amount');
                $table->string('reason', 100)->nullable();
                $table->text('description')->nullable();
                $table->json('metadata')->nullable();
                $table->timestamps();

                $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
                $table->index(['student_id', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('coin_transactions');
        Schema::dropIfExists('student_coins');
        Schema::dropIfExists('student_badges');
        Schema::dropIfExists('badges');
    }
};
