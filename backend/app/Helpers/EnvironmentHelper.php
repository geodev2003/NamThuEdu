<?php

namespace App\Helpers;

class EnvironmentHelper
{
    /**
     * Check if current environment is development
     */
    public static function isDevelopment(): bool
    {
        return app()->environment(['local', 'development']);
    }

    /**
     * Check if current environment is staging
     */
    public static function isStaging(): bool
    {
        return app()->environment('staging');
    }

    /**
     * Check if current environment is production
     */
    public static function isProduction(): bool
    {
        return app()->environment('production');
    }

    /**
     * Get environment-specific database name
     */
    public static function getDatabaseName(): string
    {
        $baseName = 'namthuedu';
        
        if (self::isDevelopment()) {
            return $baseName . '_dev';
        }
        
        if (self::isStaging()) {
            return $baseName . '_staging';
        }
        
        return $baseName . '_prod';
    }

    /**
     * Get environment-specific app name
     */
    public static function getAppName(): string
    {
        $baseName = 'Nam Thu Edu API';
        
        if (self::isDevelopment()) {
            return $baseName . ' [DEV]';
        }
        
        if (self::isStaging()) {
            return $baseName . ' [STAGING]';
        }
        
        return $baseName;
    }

    /**
     * Get environment-specific URL
     */
    public static function getAppUrl(): string
    {
        if (self::isDevelopment()) {
            return 'http://localhost:8000';
        }
        
        if (self::isStaging()) {
            return 'https://staging-api.namthuedu.com';
        }
        
        return 'https://api.namthuedu.com';
    }

    /**
     * Get environment-specific frontend URL
     */
    public static function getFrontendUrl(): string
    {
        if (self::isDevelopment()) {
            return 'http://localhost:3000';
        }
        
        if (self::isStaging()) {
            return 'https://staging.namthuedu.com';
        }
        
        return 'https://namthuedu.com';
    }
}