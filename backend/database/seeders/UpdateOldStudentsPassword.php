<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateOldStudentsPassword extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder updates old students (created before plain_password feature)
     * with a default password so teachers can view their passwords.
     */
    public function run(): void
    {
        $defaultPassword = '123456'; // Default password for old students
        
        // Find all students without plain_password
        $oldStudents = User::where('uRole', 'student')
                          ->whereNull('plain_password')
                          ->whereNull('uDeleted_at')
                          ->get();

        $count = 0;
        foreach ($oldStudents as $student) {
            // Update both hashed password and encrypted plain password
            $student->update([
                'uPassword' => Hash::make($defaultPassword),
                'plain_password' => encrypt($defaultPassword)
            ]);
            $count++;
        }

        $this->command->info("Updated {$count} old students with default password: {$defaultPassword}");
        $this->command->info("Teachers can now view these passwords in the system.");
        $this->command->warn("IMPORTANT: Inform students to change their passwords after first login!");
    }
}
