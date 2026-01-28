<?php

    namespace App\Core;

    class RateLimiter {

        private static array $attempts = [];

        public static function limit (
            string $key,
            int $maxAttempts = 5,
            int $seconds = 60
        ) : void {
            $now = time();

            self::$attempts[$key] = array_filter(
                self::$attempts[$key] ?? [],
                fn($t) => $t >  $now - $seconds,
            );

            if (count(self::$attempts[$key]) >= $maxAttempts) {
                Response::error(
                    'RATE_LIMIT_EXCEEDED',
                    'Bạn đăng nhập quá nhiều lần, vui lòng thử lại sau',
                    ['retry_after' => $seconds],
                    429
                );
            }

            self::$attempts[$key][] = $now;
        }
    }


?>