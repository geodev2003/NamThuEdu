<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Skip data migration on empty databases (e.g. test environment)
        if (!DB::table('users')->exists()) {
            return;
        }

        // Step 1: Migrate student class assignments from class_enrollments
        Log::info('Starting class enrollment data migration');
        
        // Copy most recent class enrollment to users.class_id
        $migratedFromEnrollments = DB::statement("
            UPDATE users u
            JOIN (
                SELECT ce1.student_id, ce1.class_id
                FROM class_enrollments ce1
                INNER JOIN (
                    SELECT student_id, MAX(enrolled_at) as latest
                    FROM class_enrollments
                    GROUP BY student_id
                ) ce2 ON ce1.student_id = ce2.student_id AND ce1.enrolled_at = ce2.latest
            ) ce ON u.uId = ce.student_id
            SET u.class_id = ce.class_id
            WHERE u.uRole = 'student'
        ");
        
        Log::info('Migrated students from class_enrollments', ['affected' => $migratedFromEnrollments]);
        
        // Handle students with uClass but no class_enrollments
        // Only migrate if the class exists
        $migratedFromUClass = DB::update("
            UPDATE users u
            INNER JOIN classes c ON u.uClass = c.cId
            SET u.class_id = u.uClass
            WHERE u.uRole = 'student' AND u.class_id IS NULL AND u.uClass IS NOT NULL
        ");
        
        Log::info('Migrated students from uClass field', ['affected' => $migratedFromUClass]);
        
        // Create default classes for orphaned students
        $defaultClasses = $this->createDefaultClasses();
        
        // Assign orphaned students to default classes by age_group
        $orphanedStudents = DB::select("
            SELECT uId, age_group
            FROM users
            WHERE uRole = 'student' AND class_id IS NULL
        ");
        
        foreach ($orphanedStudents as $student) {
            $ageGroup = $student->age_group ?? 'adults';
            DB::update("
                UPDATE users
                SET class_id = ?
                WHERE uId = ?
            ", [$defaultClasses[$ageGroup], $student->uId]);
        }
        
        Log::info('Assigned orphaned students to default classes', ['count' => count($orphanedStudents)]);
        
        // Step 2: Migrate course class assignments
        // Assign courses to classes based on most common student class in enrollments
        DB::statement("
            UPDATE course c
            SET c.class_id = (
                SELECT u.class_id
                FROM course_enrollments ce
                JOIN users u ON ce.student_id = u.uId
                WHERE ce.course_id = c.cId AND u.class_id IS NOT NULL
                GROUP BY u.class_id
                ORDER BY COUNT(*) DESC
                LIMIT 1
            )
            WHERE c.class_id IS NULL
        ");
        
        // Assign remaining courses to default adult class
        DB::update("
            UPDATE course
            SET class_id = ?
            WHERE class_id IS NULL
        ", [$defaultClasses['adults']]);
        
        Log::info('Migrated course class assignments');
        
        // Step 3: Validate data before finalizing
        // Verify all students have class_id
        $studentsWithoutClass = DB::select("
            SELECT uId, uName, uRole
            FROM users
            WHERE uRole = 'student' AND class_id IS NULL
        ");
        
        if (count($studentsWithoutClass) > 0) {
            Log::error('Found students without class_id', ['students' => $studentsWithoutClass]);
            throw new \Exception('Cannot proceed: ' . count($studentsWithoutClass) . ' students still have NULL class_id');
        }
        
        // Verify all courses have class_id
        $coursesWithoutClass = DB::select("
            SELECT cId, cName
            FROM course
            WHERE class_id IS NULL
        ");
        
        if (count($coursesWithoutClass) > 0) {
            Log::error('Found courses without class_id', ['courses' => $coursesWithoutClass]);
            throw new \Exception('Cannot proceed: ' . count($coursesWithoutClass) . ' courses still have NULL class_id');
        }
        
        Log::info('All students and courses have valid class_id');
        
        // Make course.class_id NOT NULL (all courses must belong to a class)
        DB::statement("
            ALTER TABLE course
            MODIFY COLUMN class_id BIGINT UNSIGNED NOT NULL
            COMMENT 'Foreign key to classes table - courses belong to a specific class'
        ");
        
        // Step 4: Validate and log conflicts
        $conflicts = DB::select("
            SELECT ce.id, ce.student_id, ce.course_id, 
                   u.class_id as student_class, c.class_id as course_class,
                   u.uName as student_name, c.cName as course_name
            FROM course_enrollments ce
            JOIN users u ON ce.student_id = u.uId
            JOIN course c ON ce.course_id = c.cId
            WHERE u.class_id != c.class_id
        ");
        
        if (count($conflicts) > 0) {
            Log::warning('Course enrollment conflicts found', [
                'count' => count($conflicts),
                'conflicts' => $conflicts
            ]);
        }
        
        // Step 5: Validate and log conflicts
        // We don't make class_id NOT NULL at database level because teachers/admins don't need it
        // Instead, we'll enforce this at application level (Model validation)
        
        $studentsWithoutClass = DB::select("
            SELECT uId, uName, uRole
            FROM users
            WHERE uRole = 'student' AND class_id IS NULL
        ");
        
        if (count($studentsWithoutClass) > 0) {
            Log::error('Found students without class_id', ['students' => $studentsWithoutClass]);
            throw new \Exception('Cannot proceed: ' . count($studentsWithoutClass) . ' students still have NULL class_id');
        }
        
        Log::info('All students have valid class_id');
        
        // Step 6: Drop class_enrollments table
        Schema::dropIfExists('class_enrollments');
        
        Log::info('Dropped class_enrollments table');
        
        // Step 7: Remove uClass column from users
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('uClass');
        });
        }
        
        Log::info('Removed uClass column from users table');
        Log::info('Class enrollment data migration completed successfully');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate class_enrollments table
        Schema::create('class_enrollments', function (Blueprint $table) {
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('student_id');
            $table->timestamp('enrolled_at')->useCurrent();
            
            $table->primary(['class_id', 'student_id']);
            
            $table->foreign('class_id')->references('cId')->on('classes')->onDelete('cascade');
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
        });
        
        // Restore data from users.class_id to class_enrollments
        DB::statement("
            INSERT INTO class_enrollments (class_id, student_id, enrolled_at)
            SELECT class_id, uId, uCreated_at
            FROM users
            WHERE uRole = 'student' AND class_id IS NOT NULL
        ");
        
        // Restore uClass column
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('uClass')->nullable()->after('uAddress');
        });
        }
        
        DB::statement("UPDATE users SET uClass = class_id WHERE uRole = 'student'");
        
        // Make class_id nullable again for users (teachers/admins don't need class)
        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN class_id BIGINT UNSIGNED NULL
        ");
        
        DB::statement("
            ALTER TABLE course
            MODIFY COLUMN class_id BIGINT UNSIGNED NULL
        ");
        
        Log::info('Rolled back class enrollment data migration');
    }
    
    /**
     * Create default classes for each age group
     */
    private function createDefaultClasses(): array
    {
        $adminUser = DB::table('users')->where('uRole', 'admin')->first();
        $teacherId = $adminUser ? $adminUser->uId : 1;
        
        $defaultClasses = [];
        
        foreach (['kids', 'teens', 'adults'] as $ageGroup) {
            // Check if default class already exists
            $existing = DB::table('classes')
                ->where('cName', "Default " . ucfirst($ageGroup) . " Class")
                ->first();
            
            if ($existing) {
                $defaultClasses[$ageGroup] = $existing->cId;
            } else {
                $defaultClasses[$ageGroup] = DB::table('classes')->insertGetId([
                    'cName' => "Default " . ucfirst($ageGroup) . " Class",
                    'cTeacher_id' => $teacherId,
                    'cDescription' => "Auto-generated default class for {$ageGroup} students during migration",
                    'age_group' => $ageGroup,
                    'max_students' => 100,
                    'cStatus' => 'active',
                    'cCreated_at' => now()
                ]);
            }
        }
        
        Log::info('Created/verified default classes', $defaultClasses);
        
        return $defaultClasses;
    }
};
