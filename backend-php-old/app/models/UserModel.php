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

    public static function getStudentById(int $studentId)
    {
        $db = Database::getInstance()->getConnection();

        // 1. Sửa tên bảng 'class' -> 'classes', 'course' -> 'courses' (nếu bạn đặt tên có s)
        // 2. Sử dụng Alias rõ ràng để tránh trùng tên cột cName
        $sql = "
        SELECT u.uId, u.uName, u.uPhone, u.uDoB, u.uAddress, u.uGender, u.uStatus, 
               cl.cName AS className
        FROM users AS u
        LEFT JOIN classes AS cl ON u.uClass = cl.cId
        WHERE u.uId = ?
    ";

        $stmt = $db->prepare($sql);
        // 3. execute truyền mảng tham số
        $stmt->execute([$studentId]);

        // 4. Dùng fetch() vì chỉ lấy 1 dòng dữ liệu
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) return null;

        return [
            'id' => (int)$row['uId'],
            'name' => $row['uName'],
            'phone' => $row['uPhone'],
            'class' => $row['className'] ?? 'N/A',
            'DoB' => $row['uDoB'],
            'gender' => $row['uGender'] == 1 ? 'Nam' : 'Nữ',
            'address' => $row['uAddress'] ?? '',
            'status' => $row['uStatus'] ? ucfirst($row['uStatus']) : 'Active'
        ];
    }

    public static function createStudent(array $data): int
    {
        $db = Database::getInstance()->getConnection();

        // Kiểm tra trùng SĐT trước khi chèn
        $check = $db->prepare("SELECT uId FROM users WHERE uPhone = ?");
        $check->execute([$data['phone']]);
        if ($check->fetch()) {
            throw new \Exception("Số điện thoại '{$data['phone']}' đã tồn tại.");
        }

        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

        $sql = "INSERT INTO users (uPhone, uPassword, uName, uDoB, uClass, uRole, uStatus, uCreated_at)
            VALUES (?, ?, ?, ?, ?, 'student', 'active', NOW())";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            $data['phone'],
            $passwordHash,
            $data['name'],
            $data['dob'],
            $data['classId']
        ]);

        return (int)$db->lastInsertId();
    }

    public static function deleteStudent(int $id): bool
    {
        $db = Database::getInstance()->getConnection();

        $sql = "UPDATE users SET uDeleted_at = NOW(), uStatus = 'inactive' 
            WHERE uId = ? AND uRole = 'student' AND uDeleted_at IS NULL";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->rowCount() > 0;
    }

    public static function updateStudent(int $id, array $data): bool
    {
        $db = Database::getInstance()->getConnection();

        // SQL cập nhật các thông tin cơ bản và uClass (liên kết với bảng classes)
        $sql = "UPDATE users SET 
                uName = ?, 
                uPhone = ?, 
                uDoB = ?, 
                uAddress = ?, 
                uGender = ?, 
                uClass = ?, 
                uStatus = ?
            WHERE uId = ? AND uRole = 'student'";

        $stmt = $db->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['phone'],
            $data['birthday'],
            $data['address'],
            $data['gender'],
            $data['class_id'], // ID của lớp học mới
            $data['status'],
            $id
        ]);
    }
}
