<?php

namespace App\Models;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use App\Core\Database;
use PDO;

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

    public static function getAllStudents(): array
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
            SELECT uId, uName, uPhone, uRole, uDoB, uStatus, uCreated_at
            FROM users
            WHERE uRole = 'student'
            ORDER BY uId ASC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id' => (int)$row['uId'],
                'name' => $row['uName'],
                'phone' => $row['uPhone'],
                'DoB' => $row['uDoB'],
                'status' => $row['uStatus'] ? ucfirst($row['uStatus']) : 'Active'
            ];
        }, $rows);
    }
}
