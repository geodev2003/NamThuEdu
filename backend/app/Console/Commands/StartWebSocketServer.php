<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class StartWebSocketServer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'websocket:serve {--host=127.0.0.1} {--port=6001}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the WebSocket server for real-time test features';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $host = $this->option('host');
        $port = $this->option('port');
        
        $this->info("Starting WebSocket server on {$host}:{$port}");
        $this->info('Press Ctrl+C to stop the server');
        
        // Start Laravel WebSocket server
        $this->call('websockets:serve', [
            '--host' => $host,
            '--port' => $port
        ]);
        
        return 0;
    }
}