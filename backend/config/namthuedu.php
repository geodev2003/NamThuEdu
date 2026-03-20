<?php

return [

    /*
    |--------------------------------------------------------------------------
    | NamThuEdu Application Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration specific to NamThuEdu application
    | including feature flags, rate limits, and environment-specific settings.
    |
    */

    'app' => [
        'name' => env('APP_NAME', 'Nam Thu Edu API'),
        'timezone' => env('APP_TIMEZONE', 'Asia/Ho_Chi_Minh'),
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | Control feature availability across different environments
    |
    */
    'features' => [
        'registration_enabled' => env('FEATURE_REGISTRATION_ENABLED', true),
        'otp_enabled' => env('FEATURE_OTP_ENABLED', true),
        'ai_grading_enabled' => env('FEATURE_AI_GRADING_ENABLED', false),
        'exam_templates_enabled' => env('FEATURE_EXAM_TEMPLATES_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | Configure rate limits for different endpoints and actions
    | More relaxed limits for development, stricter for production
    |
    */
    'rate_limits' => [
        'login' => app()->environment('production') ? 5 : 10,
        'otp' => app()->environment('production') ? 3 : 5,
        'api' => app()->environment('production') ? 60 : 120,
    ],

    /*
    |--------------------------------------------------------------------------
    | SMS/OTP Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for SMS and OTP providers based on environment
    |
    */
    'sms' => [
        'provider' => app()->environment(['local', 'development']) ? 'mock' : env('SMS_PROVIDER', 'esms'),
        'providers' => [
            'esms' => [
                'api_key' => env('ESMS_API_KEY'),
                'secret_key' => env('ESMS_SECRET_KEY'),
                'brandname' => env('ESMS_BRANDNAME', 'NAMTHUEDU'),
                'url' => 'https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/',
            ],
            'twilio' => [
                'sid' => env('TWILIO_SID'),
                'token' => env('TWILIO_TOKEN'),
                'verify_sid' => env('TWILIO_VERIFY_SID'),
            ],
            'aws_sns' => [
                'region' => env('AWS_SNS_REGION', 'ap-southeast-1'),
            ],
        ],
        'otp' => [
            'length' => 6,
            'expiry_minutes' => 5,
            'max_attempts' => app()->environment('production') ? 3 : 5,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Development Tools Configuration
    |--------------------------------------------------------------------------
    |
    | Enable/disable development and debugging tools based on environment
    |
    */
    'dev_tools' => [
        'telescope_enabled' => app()->environment(['local', 'development', 'staging']),
        'debugbar_enabled' => app()->environment(['local', 'development']),
        'query_log_enabled' => app()->environment(['local', 'development']),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | Security-related settings based on environment
    |
    */
    'security' => [
        'cors_allowed_origins' => app()->environment('production') 
            ? ['https://namthuedu.com', 'https://www.namthuedu.com']
            : (app()->environment('staging') 
                ? ['https://staging.namthuedu.com']
                : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173']
            ),
        'jwt_secret' => env('JWT_SECRET'),
        'session_secure' => app()->environment(['staging', 'production']),
        'force_https' => app()->environment('production'),
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for file uploads and storage
    |
    */
    'uploads' => [
        'max_file_size' => 10 * 1024 * 1024, // 10MB
        'allowed_extensions' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp3', 'wav'],
        'exam_media_path' => 'exams/media',
        'user_avatars_path' => 'users/avatars',
    ],

    /*
    |--------------------------------------------------------------------------
    | Exam Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for exam system
    |
    */
    'exams' => [
        'default_duration_minutes' => 60,
        'max_duration_minutes' => 180,
        'auto_submit_buffer_minutes' => 5,
        'question_types' => [
            'multiple_choice',
            'fill_blank',
            'true_false',
            'matching',
            'matching_lines',
            'coloring',
            'short_answer',
            'essay',
            'speaking_identification',
            'speaking_comparison',
            'multiple_choice_cloze',
            'word_completion',
            'open_cloze',
            'information_transfer',
            'short_writing'
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring & Analytics
    |--------------------------------------------------------------------------
    |
    | Configuration for monitoring and analytics services
    |
    */
    'monitoring' => [
        'sentry_dsn' => env('SENTRY_LARAVEL_DSN'),
        'google_analytics_id' => env('GOOGLE_ANALYTICS_ID'),
    ],

];

    /*
    |--------------------------------------------------------------------------
    | Database Configuration per Environment
    |--------------------------------------------------------------------------
    |
    | Different database settings based on environment
    |
    */
    'database' => [
        'strict_mode' => app()->environment(['staging', 'production']),
        'query_log' => app()->environment(['local', 'development']),
        'connection_timeout' => app()->environment('production') ? 60 : 30,
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration per Environment
    |--------------------------------------------------------------------------
    |
    | Different cache settings based on environment
    |
    */
    'cache' => [
        'default_driver' => app()->environment(['staging', 'production']) ? 'redis' : 'file',
        'default_ttl' => app()->environment('production') ? 3600 : (app()->environment('staging') ? 1800 : 300),
        'config_cache' => app()->environment(['staging', 'production']),
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging Configuration per Environment
    |--------------------------------------------------------------------------
    |
    | Different logging settings based on environment
    |
    */
    'logging' => [
        'level' => app()->environment('production') ? 'error' : (app()->environment('staging') ? 'info' : 'debug'),
        'channel' => app()->environment(['staging', 'production']) ? 'daily' : 'single',
        'days' => app()->environment('production') ? 14 : 7,
    ],

    /*
    |--------------------------------------------------------------------------
    | Mail Configuration per Environment
    |--------------------------------------------------------------------------
    |
    | Different mail settings based on environment
    |
    */
    'mail' => [
        'driver' => app()->environment(['local', 'development']) ? 'log' : 'smtp',
        'from_address' => app()->environment('production') 
            ? 'noreply@namthuedu.com' 
            : (app()->environment('staging') 
                ? 'staging@namthuedu.com' 
                : 'dev@namthuedu.local'
            ),
    ],
