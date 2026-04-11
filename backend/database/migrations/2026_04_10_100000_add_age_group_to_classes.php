<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add age_group and max_students to classes table
        Schema::table('classes', function (Blueprint $table) {
            $table->enum('age_group', ['kids', 'teens', 'adults'])
                  ->after('cDescription')
                  ->comment('Age group for the class: kids (6-12), teens (13-17), adults (18-45)');
            
            $table->unsignedInteger('max_students')
                  ->default(30)
                  ->after('age_group')
                  ->comment('Maximum number of students allowed in this class');
            
            $table->index('age_group', 'idx_classes_age_group');
        });
        
        // Assign age_group to existing classes based on student demographics
        DB::statement("
            UPDATE classes c
            SET c.age_group = (
                SELECT CASE
                    WHEN AVG(YEAR(CURDATE()) - YEAR(u.uDoB)) BETWEEN 6 AND 12 THEN 'kids'
                    WHEN AVG(YEAR(CURDATE()) - YEAR(u.uDoB)) BETWEEN 13 AND 17 THEN 'teens'
                    ELSE 'adults'
                END
                FROM class_enrollments ce
                JOIN users u ON ce.student_id = u.uId
                WHERE ce.class_id = c.cId AND u.uDoB IS NOT NULL
                GROUP BY ce.class_id
            )
            WHERE c.age_group IS NULL
        ");
        
        // Default to 'adults' for classes with no enrollments or no birth dates
        DB::statement("UPDATE classes SET age_group = 'adults' WHERE age_group IS NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropIndex('idx_classes_age_group');
            $table->dropColumn(['age_group', 'max_students']);
        });
    }
};
