<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SwitchEnvironment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'env:switch {environment : The environment to switch to (local|development|staging|production)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Switch application environment';

    /**
     * Available environments
     */
    protected $environments = ['local', 'development', 'staging', 'production'];

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $environment = $this->argument('environment');

        // Validate environment
        if (!in_array($environment, $this->environments)) {
            $this->error("Invalid environment: {$environment}");
            $this->info("Available environments: " . implode(', ', $this->environments));
            return 1;
        }

        // Update .env file
        $envPath = base_path('.env');
        
        if (!File::exists($envPath)) {
            $this->error('.env file not found');
            return 1;
        }

        // Read current .env content
        $envContent = File::get($envPath);

        // Update APP_ENV
        $envContent = preg_replace('/^APP_ENV=.*/m', "APP_ENV={$environment}", $envContent);

        // Update environment-specific values
        $envContent = $this->updateEnvironmentSpecificValues($envContent, $environment);

        // Write back to .env file
        File::put($envPath, $envContent);

        $this->info("✓ Switched to '{$environment}' environment");

        // Clear caches
        $this->info("🔄 Clearing caches...");
        $this->call('config:clear');
        $this->call('cache:clear');
        $this->call('route:clear');
        $this->call('view:clear');

        // Environment-specific optimizations
        if (in_array($environment, ['staging', 'production'])) {
            $this->info("⚡ Running optimizations...");
            $this->call('config:cache');
            $this->call('route:cache');
            $this->call('view:cache');
        }

        $this->info("🎉 Environment switch completed!");
        $this->showEnvironmentInfo($environment);

        return 0;
    }

    /**
     * Update environment-specific values in .env content
     */
    protected function updateEnvironmentSpecificValues(string $content, string $environment): string
    {
        // Update APP_DEBUG
        $debug = in_array($environment, ['local', 'development']) ? 'true' : 'false';
        $content = preg_replace('/^APP_DEBUG=.*/m', "APP_DEBUG={$debug}", $content);

        // Update APP_URL
        $urls = [
            'local' => 'http://localhost:8000',
            'development' => 'http://localhost:8000',
            'staging' => 'https://staging-api.namthuedu.com',
            'production' => 'https://api.namthuedu.com',
        ];
        $content = preg_replace('/^APP_URL=.*/m', "APP_URL={$urls[$environment]}", $content);

        // Update FRONTEND_URL
        $frontendUrls = [
            'local' => 'http://localhost:3000',
            'development' => 'http://localhost:3000',
            'staging' => 'https://staging.namthuedu.com',
            'production' => 'https://namthuedu.com',
        ];
        $content = preg_replace('/^FRONTEND_URL=.*/m', "FRONTEND_URL={$frontendUrls[$environment]}", $content);

        // Update database name
        $dbNames = [
            'local' => 'namthuedu_dev',
            'development' => 'namthuedu_dev',
            'staging' => 'namthuedu_staging',
            'production' => 'namthuedu_prod',
        ];
        $content = preg_replace('/^DB_DATABASE=.*/m', "DB_DATABASE={$dbNames[$environment]}", $content);

        return $content;
    }

    /**
     * Show environment information
     */
    protected function showEnvironmentInfo(string $environment): void
    {
        $this->info("\n📋 Environment Information:");
        $this->line("- Environment: {$environment}");
        $this->line("- Debug mode: " . (in_array($environment, ['local', 'development']) ? 'ON' : 'OFF'));
        $this->line("- Cache driver: " . (in_array($environment, ['staging', 'production']) ? 'redis' : 'file'));
        $this->line("- Log level: " . $this->getLogLevel($environment));
        
        if ($environment === 'production') {
            $this->warn("\n⚠️  Production environment active!");
            $this->warn("- Debug mode is OFF");
            $this->warn("- Error reporting is minimal");
            $this->warn("- Caches are enabled");
        }
    }

    /**
     * Get log level for environment
     */
    protected function getLogLevel(string $environment): string
    {
        return match($environment) {
            'local', 'development' => 'debug',
            'staging' => 'info',
            'production' => 'error',
            default => 'debug'
        };
    }
}