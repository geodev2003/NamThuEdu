<?php
namespace App\Middlewares;

class RateLimitMiddleware {

    public static function handle(
        string $key,
        int $maxAttempts = 5,
        int $decaySeconds = 60
    ): void {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $now = time();

        if (!isset($_SESSION['rate_limit'][$key])) {
            $_SESSION['rate_limit'][$key] = [
                'count' => 1,
                'start' => $now
            ];
            return;
        }

        $record = &$_SESSION['rate_limit'][$key];

        // Reset nếu hết thời gian
        if ($now - $record['start'] > $decaySeconds) {
            $record = [
                'count' => 1,
                'start' => $now
            ];
            return;
        }

        // Vượt quá giới hạn
        if ($record['count'] >= $maxAttempts) {
            http_response_code(429);
            echo json_encode([
                'code' => 'RATE_LIMIT_EXCEEDED',
                'message' => 'Too many login attempts. Please try again later.',
                'details' => [
                    'retryAfter' => $decaySeconds - ($now - $record['start'])
                ],
                'requestId' => uniqid()
            ]);
            exit;
        }

        $record['count']++;
    }
}
