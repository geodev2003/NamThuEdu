<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add class_id to users table (nullable initially for migration)
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('class_id')
                  ->nullable()
                  ->after('uClass')
                  ->comment('Foreign key to classes table - required for students');
            
            $table->foreign('class_id', 'fk_users_class_id')
                  ->references('cId')
                  ->on('classes')
                  ->onDelete('restrict');
            
            $table->index('class_id', 'idx_users_class_id');
            $table->index(['uRole', 'class_id'], 'idx_users_role_class');
        });
        }
        
        // Add class_id to course table (nullable initially for migration)
        if (Schema::hasTable('course')) {
            Schema::table('course', function (Blueprint $table) {
            $table->unsignedBigInteger('class_id')
                  ->nullable()
                  ->after('cTeacher')
                  ->comment('Foreign key to classes table - courses belong to a specific class');
            
            $table->foreign('class_id', 'fk_course_class_id')
                  ->references('cId')
                  ->on('classes')
                  ->onDelete('cascade');
            
            $table->index('class_id', 'idx_course_class_id');
            $table->index(['cStatus', 'class_id'], 'idx_course_status_class');
        });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('fk_users_class_id');
            $table->dropIndex('idx_users_class_id');
            $table->dropIndex('idx_users_role_class');
            $table->dropColumn('class_id');
        });
        }
        
        if (Schema::hasTable('course')) {
            Schema::table('course', function (Blueprint $table) {
            $table->dropForeign('fk_course_class_id');
            $table->dropIndex('idx_course_class_id');
            $table->dropIndex('idx_course_status_class');
            $table->dropColumn('class_id');
        });
        }
    }
};
