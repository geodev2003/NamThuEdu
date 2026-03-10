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

        // 1. Sửa 'class' thành 'classes'
        // 2. Đặt AS cho các cột để PDO nhận diện đúng key trong mảng
        $sql = "
        SELECT u.uId, u.uName, u.uPhone, u.uRole, u.uDoB, uAddress, c.cName, u.uStatus, u.uCreated_at
        FROM users AS u 
        JOIN classes AS c ON u.uClass = c.cId
        WHERE u.uRole = 'student' AND u.uStatus = 'active'
        ORDER BY u.uId ASC
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id' => (int)$row['uId'], // Bỏ 'u.' ở key
                'name' => $row['uName'],
                'phone' => $row['uPhone'],
                'class' => $row['cName'], // Key là cName từ SQL
                'DoB' => $row['uDoB'],
                'address' => $row['uAddress'] ?? '',
                'status' => $row['uStatus'] ? ucfirst($row['uStatus']) : 'Active'
            ];
        }, $rows);
    }
}
