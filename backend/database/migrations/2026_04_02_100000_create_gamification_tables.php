<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateGamificationTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Achievements table - defines available achievements
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique(); // e.g., 'first_test', 'streak_7'
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('icon', 100)->nullable(); // emoji or icon name
            $table->string('category', 50)->default('general'); // general, streak, score, practice
            $table->integer('points')->default(10); // points awarded
            $table->json('criteria')->nullable(); // criteria to earn (e.g., {"tests_completed": 1})
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Student achievements - tracks which students earned which achievements
        Schema::create('student_achievements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('achievement_id');
            $table->timestamp('earned_at')->useCurrent();
            $table->json('metadata')->nullable(); // extra data about how it was earned
            
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('achievement_id')->references('id')->on('achievements')->onDelete('cascade');
            $table->unique(['student_id', 'achievement_id']);
        });

        // Student points - tracks point transactions
        Schema::create('student_points', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->integer('points');
            $table->string('source', 50); // test, practice, achievement, streak, bonus
            $table->unsignedBigInteger('source_id')->nullable(); // e.g., submission_id
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            $table->index(['student_id', 'created_at']);
        });

        // Student streaks - tracks daily activity streaks
        Schema::create('student_streaks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->integer('current_streak')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->date('last_activity_date')->nullable();
            $table->timestamps();
            
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
            $table->unique('student_id');
        });

        DB::table('achievements')->insert([
            [
                'code' => 'first_submission',
                'name' => 'Bài nộp đầu tiên',
                'description' => 'Hoàn thành bài nộp đầu tiên.',
                'icon' => 'trophy',
                'category' => 'general',
                'points' => 10,
                'criteria' => json_encode(['submissions_gte' => 1]),
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'ten_submissions',
                'name' => '10 bài nộp',
                'description' => 'Hoàn thành ít nhất 10 bài nộp.',
                'icon' => 'medal',
                'category' => 'progress',
                'points' => 30,
                'criteria' => json_encode(['submissions_gte' => 10]),
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'high_score_90',
                'name' => 'Điểm cao 90+',
                'description' => 'Đạt ít nhất một bài có điểm từ 90 trở lên.',
                'icon' => 'star',
                'category' => 'score',
                'points' => 25,
                'criteria' => json_encode(['score_gte' => 90]),
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_streaks');
        Schema::dropIfExists('student_points');
        Schema::dropIfExists('student_achievements');
        Schema::dropIfExists('achievements');
    }
}
