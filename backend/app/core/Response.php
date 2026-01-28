<?php

    namespace App\Core;

    class Response {

        public static function error(
            string $code,
            string $message,
            ?array $details = null,
            int $httpcode = 400
        ) : void {
            http_response_code($httpcode);
            header('Content-Type: application/json');
            echo json_encode([
                'code' => $code,
                'message' => $message,
                'details' => $details,
                'requestId' => self::requestId()
            ]);
            exit;
        }

        public static function success(array $data=[]) : void {
            echo json_encode([
                'code' => 'SUCCESS',
                'data' => $data,
                'requestId' => self::requestId()
            ]);
            exit;
        }

        private static function requestId() : string {
            return $_SERVER['HTTP_X_REQUEST_ID'] ?? 'req_' . bin2hex(random_bytes(6));
        }

    }

?>