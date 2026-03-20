<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnvironmentServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Register environment-specific services
        $this->registerEnvironmentServices();
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Configure environment-specific settings
        $this->configureEnvironment();
        
        // Setup database query logging for development
        $this->setupQueryLogging();
        
        // Configure CORS based on environment
        $this->configureCors();
    }

    /**
     * Register environment-specific services
     */
    private function registerEnvironmentServices()
    {
        // Register SMS service based on environment
        $this->app->singleton('sms.service', function ($app) {
            $provider = config('namthuedu.sms.provider', 'mock');
            
            switch ($provider) {
                case 'esms':
                    return new \App\Services\SMS\ESMSService();
                case 'twilio':
                    return new \App\Services\SMS\TwilioService();
                case 'aws':
                    return new \App\Services\SMS\AWSService();
                default:
                    return new \App\Services\SMS\MockSMSService();
            }
        });

        // Register feature flag service
        $this->app->singleton('feature.flags', function ($app) {
            return new \App\Services\FeatureFlagService();
        });
    }

    /**
     * Configure environment-specific settings
     */
    private function configureEnvironment()
    {
        $env = app()->environment();
        $envConfig = config("environments.environments.{$env}", []);

        // Set timezone
        if ($timezone = config('namthuedu.app.timezone')) {
            date_default_timezone_set($timezone);
        }

        // Configure logging level
        if (isset($envConfig['log_level'])) {
            Config::set('logging.channels.single.level', $envConfig['log_level']);
            Config::set('logging.channels.daily.level', $envConfig['log_level']);
        }

        // Configure optimization settings
        if (isset($envConfig['optimize']) && $envConfig['optimize']) {
            // Enable route caching in production/staging
            if (file_exists(base_path('bootstrap/cache/routes.php'))) {
                Config::set('route.cache', true);
            }
        }
    }

    /**
     * Setup database query logging for development environments
     */
    private function setupQueryLogging()
    {
        if (app()->environment(['local', 'development'])) {
            DB::listen(function ($query) {
                Log::channel('daily')->info('Database Query', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time . 'ms'
                ]);
            });
        }
    }

    /**
     * Configure CORS based on environment
     */
    private function configureCors()
    {
        $allowedOrigins = config('namthuedu.security.cors_allowed_origins', ['*']);
        Config::set('cors.allowed_origins', $allowedOrigins);
    }
}