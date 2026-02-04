<?php

namespace App\Models; // Phải là Models

use App\Core\Database;
use PDO;

class BlogModel
{
    public static function getAllBlogs(int $teacherId): array
    {
        $db = Database::getInstance()->getConnection();

        // Sửa 1: Bỏ dấu phẩy thừa sau c.caName
        // Sửa 2: pName -> pTitle
        $sql = "
        SELECT p.*, u.uName, c.caName
        FROM posts AS p
        LEFT JOIN category AS c ON p.pCategory = c.caId
        LEFT JOIN users AS u ON p.pAuthor_id = u.uId
        WHERE p.pAuthor_id = ?
        ORDER BY p.pId ASC
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacherId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id' => (int)$row['pId'],
                'name' => $row['pTitle'], // Sửa: Database là pTitle
                'type' => $row['pType'],
                'category' => $row['caName'] ?? 'General', // Sửa: key trả về là caName (do join)
                'content' => $row['pContent'],
                'author' => $row['uName'] ?? '', // Sửa: key trả về là uName
                'url' => $row['pUrl'],
                'thumbnail' => $row['pThumbnail'],
                'view' => $row['pView'],
                'like' => $row['pLike'],
                'createAt' => $row['pCreated_at'],
                'status' => ucfirst($row['pStatus'])
            ];
        }, $rows);
    }

    public static function createBlog(int $teacherId, string $blogName, string $blogContent, string $blogType, int $blogCategory, string $blogUrl, string $blogThumbnail): int
    {
        $db = Database::getInstance()->getConnection();

        // Sửa: cStatus -> pStatus
        $sql = "
    INSERT INTO posts (pAuthor_id, pTitle, pContent, pType, pCategory, pUrl, pThumbnail, pStatus)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            $teacherId,
            $blogName,
            $blogContent,
            $blogType,
            $blogCategory,
            $blogUrl,
            $blogThumbnail
        ]);

        return (int)$db->lastInsertId();
    }

    public static function deleteBlog(int $blogId, int $teacherId): bool
    {
        $db = Database::getInstance()->getConnection();
        // Ràng buộc uId của giáo viên để đảm bảo giáo viên chỉ xóa được khóa học của chính mình
        $stmt = $db->prepare("UPDATE posts SET pStatus='inactive', pDeleted_at=NOW() WHERE pId = ? AND pAuthor_id = ?");
        return $stmt->execute([$blogId, $teacherId]);
    }

    public static function getBlogById(int $blogId, int $teacherId)
{
    $db = Database::getInstance()->getConnection();

    // Sửa: Lấy đúng các cột của bảng posts (pId, pTitle...)
    $sql = "
    SELECT p.*, cat.caName, u.uName
    FROM posts p
    LEFT JOIN category cat ON p.pCategory = cat.caId
    LEFT JOIN users u ON p.pAuthor_id = u.uId
    WHERE p.pId = ? AND p.pAuthor_id = ?
    LIMIT 1
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$blogId, $teacherId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) return null;

    // Sửa: Mapping đúng key cho Frontend
    return [
        'id' => (int)$row['pId'],
        'name' => $row['pTitle'],           // Tên bài viết
        'type' => $row['pType'],            // Loại (Grammar/Tips...)
        'category' => $row['caName'] ?? 'General', // Tên danh mục
        'categoryId' => $row['pCategory'],  // ID danh mục (để dùng cho form Edit)
        'content' => $row['pContent'],
        'author' => $row['uName'],          // Tên tác giả
        'url' => $row['pUrl'] || '',
        'thumbnail' => $row['pThumbnail'] || '',
        'view' => $row['pView'],
        'like' => $row['pLike'] ?? 0,
        'status' => ucfirst($row['pStatus']),
        'createdAt' => $row['pCreated_at'],
        'updatedAt' => $row['pUpdated_at']
    ];
}

    public static function updateBlog(int $blogId, int $teacherId, array $data): bool
    {
        $db = Database::getInstance()->getConnection();

        // Sửa: pName -> pTitle, thêm dấu phẩy trước pUpdated_at, sửa cId/cTeacher
        $sql = "UPDATE posts SET 
        pTitle = ?, pCategory = ?, pType = ?, 
        pContent = ?, pAuthor_id = ?, pUrl = ?, 
        pThumbnail = ?, pUpdated_at = NOW()
        WHERE pId = ? AND pAuthor_id = ?";

        $stmt = $db->prepare($sql);
        return $stmt->execute([
            $data['blogName'],
            $data['blogCategory'],
            $data['blogType'],
            $data['blogContent'],
            $teacherId, // pAuthor_id
            $data['blogUrl'],
            $data['blogThumbnail'],
            $blogId,
            $teacherId
        ]);
    }

    
}
