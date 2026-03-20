<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Tự động xử lý bài thi hết thời gian mỗi 5 phút
        $schedule->command('tests:process-expired')
                 ->everyFiveMinutes()
                 ->withoutOverlapping()
                 ->runInBackground();
                 
        // Monitor WebSocket connections mỗi phút
        $schedule->call(function () {
            \App\Services\TestWebSocketService::checkInactiveSessions();
        })->everyMinute()->name('websocket-monitor');
        
        // Cleanup WebSocket statistics mỗi ngày
        $schedule->command('websockets:clean')
                 ->daily()
                 ->at('02:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
        
        // Register test commands
        if (app()->environment(['local', 'testing'])) {
            $this->commands([
                Commands\TestWebSocketLoad::class,
            ]);
        }
    }
}
