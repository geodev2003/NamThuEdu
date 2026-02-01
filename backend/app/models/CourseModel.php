<?php

namespace App\Models; // Phải là Models

use App\Core\Database;
use PDO;

class CourseModel
{
    public static function getCoursesByTeacherId(int $teacherId): array
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
            SELECT c.*, cat.caName 
            FROM course c
            LEFT JOIN category cat ON c.cCategory = cat.caId
            WHERE c.cTeacher = ?
            ORDER BY c.cId DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacherId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id' => (int)$row['cId'],
                'name' => $row['cName'],
                'type' => $row['caName'] ?? 'General',
                'numberOfStudent' => (int)$row['cNumberOfStudent'],
                'time' => $row['cTime'],
                // Chuyển chuỗi sang mảng cho v-for trong CourseRow.vue
                'schedule' => $row['cSchedule'] ? explode(', ', $row['cSchedule']) : [],
                'startDate' => $row['cStartDate'],
                'endDate' => $row['cEndDate'],
                'status' => ucfirst($row['cStatus']) // 'active' -> 'Active'
            ];
        }, $rows);
    }

    public static function createCourse(int $teacherId, string $courseName, string $time, int $categoryId, string $schedule, string $startDate, string $endDate, int $numberOfStudent, string $description): int
    {
        $db = Database::getInstance()->getConnection();
        $sql = "
        INSERT INTO course (cTeacher, cName, cCategory, cTime, cSchedule, cStartDate, cEndDate, cNumberOfStudent, cDescription, cStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    ";

        $stmt = $db->prepare($sql);
        // Đảm bảo thứ tự truyền vào đúng với thứ tự các cột trong câu SQL trên
        $stmt->execute([
            $teacherId,         // 1. cTeacher
            $courseName,        // 2. cName
            $categoryId,        // 3. cCategory
            $time,              // 4. cTime
            $schedule,          // 5. cSchedule
            $startDate,         // 6. cStartDate
            $endDate,           // 7. cEndDate
            $numberOfStudent,   // 8. cNumberOfStudent
            $description        // 9. cDescription
        ]);

        return (int)$db->lastInsertId();
    }

    public static function deleteCourse(int $courseId, int $teacherId): bool
    {
        $db = Database::getInstance()->getConnection();
        // Ràng buộc uId của giáo viên để đảm bảo giáo viên chỉ xóa được khóa học của chính mình
        $stmt = $db->prepare("DELETE FROM course WHERE cId = ? AND cTeacher = ?");
        return $stmt->execute([$courseId, $teacherId]);
    }

    public static function getCourseById(int $courseId, int $teacherId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT c.*, cat.caName 
        FROM course c
        LEFT JOIN category cat ON c.cCategory = cat.caId
        WHERE c.cId = ? AND c.cTeacher = ?
        LIMIT 1
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$courseId, $teacherId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) return null;

        // Mapping dữ liệu tương tự như hàm getCoursesByTeacherId để khớp Frontend
        return [
            'id' => (int)$row['cId'],
            'name' => $row['cName'],
            'type' => $row['caName'] ?? 'General',
            'numberOfStudent' => (int)$row['cNumberOfStudent'],
            'time' => $row['cTime'],
            'schedule' => $row['cSchedule'] ? explode(', ', $row['cSchedule']) : [],
            'startDate' => $row['cStartDate'],
            'endDate' => $row['cEndDate'],
            'status' => ucfirst($row['cStatus']),
            'description' => $row['cDescription'] ?? '', // Giả sử bạn có cột này
            'createdAt' => $row['cCreateAt']
        ];
    }

    public static function updateCourse(int $courseId, int $teacherId, array $data): bool
    {
        $db = Database::getInstance()->getConnection();
        $sql = "UPDATE course SET 
            cName = ?, cCategory = ?, cNumberOfStudent = ?, 
            cTime = ?, cSchedule = ?, cStartDate = ?, 
            cEndDate = ?, cDescription = ?, cUpdateAt = NOW()
            WHERE cId = ? AND cTeacher = ?";

        $stmt = $db->prepare($sql);
        return $stmt->execute([
            $data['courseName'],
            $data['category'],
            $data['numberOfStudent'],
            $data['time'],
            $data['schedule'],
            $data['startDate'],
            $data['endDate'],
            $data['description'],
            $courseId,
            $teacherId
        ]);
    }
}
