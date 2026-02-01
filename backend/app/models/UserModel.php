<?php

namespace App\Models;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class UserModel
{
    public static function getAuthenticatedUser(): ?array
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null;
        }

        try {
            $jwt = $matches[1];
            $secretKey = $_ENV['JWT_SECRET'] ?? 'namthuedu_secret'; // Dùng chung key

            $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));

            return [
                'uId' => $decoded->sub,
                'uName' => $decoded->name, // Lấy name thay vì phone
                'uRole' => $decoded->role
            ];
        } catch (Exception $e) {
            return null;
        }
    }
}
