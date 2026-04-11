<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class CleanupDeletedStudents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'students:cleanup-deleted';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Permanently delete students that have been soft-deleted for more than 24 hours';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting cleanup of deleted students...');

        // Find students deleted more than 24 hours ago
        $studentsToDelete = User::where('uRole', 'student')
                                ->onlyTrashed()
                                ->where('uDeleted_at', '<=', Carbon::now()->subHours(24))
                                ->get();

        $count = $studentsToDelete->count();

        if ($count === 0) {
            $this->info('No students to permanently delete.');
            return Command::SUCCESS;
        }

        $this->info("Found {$count} student(s) to permanently delete.");

        // Permanently delete each student
        foreach ($studentsToDelete as $student) {
            $this->line("Deleting: {$student->uName} (ID: {$student->uId}) - Deleted at: {$student->uDeleted_at}");
            $student->forceDelete();
        }

        $this->info("Successfully permanently deleted {$count} student(s).");

        return Command::SUCCESS;
    }
}
