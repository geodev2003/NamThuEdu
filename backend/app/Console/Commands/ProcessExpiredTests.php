<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TestRecoveryService;

class ProcessExpiredTests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tests:process-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process expired tests and auto-submit them';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Processing expired tests...');
        
        $processedCount = TestRecoveryService::handleInterruptedTests();
        
        $this->info("Processed {$processedCount} expired tests.");
        
        return 0;
    }
}