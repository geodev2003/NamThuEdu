<?php

namespace App\Models; // Phải là Models

use App\Core\Database;
use PDO;

class CourseModel
{
    public static function getCoursesByTeacherId(int $teacherId) : array
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

 public static function createCourse(int $teacherId, string $courseName, string $time, int $categoryId, string $schedule, string $startDate, string $endDate, int $numberOfStudent, string $description) : int
    {
        $db = Database::getInstance()->getConnection();

        // LỖI CŨ: Thiếu dấu phẩy giữa cNumberOfStudent và cStatus
        // LỖI CŨ: Thiếu giá trị truyền vào cho cNumberOfStudent trong VALUES
        $sql = "
            INSERT INTO course (cTeacher, cName, cCategory, cTime, cSchedule, cStartDate, cEndDate, cNumberOfStudent, cDescription, cStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ";
        
        $stmt = $db->prepare($sql);
        // Truyền đủ 8 tham số tương ứng với 8 dấu hỏi (?)
        $stmt->execute([
            $teacherId, 
            $courseName, 
            $categoryId, 
            $time, 
            $schedule, 
            $startDate, 
            $endDate, 
            $numberOfStudent,
            $description ?? ''
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
}