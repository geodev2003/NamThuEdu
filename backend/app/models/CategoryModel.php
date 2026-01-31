<?php

namespace App\Models; // Phải là Models

use App\Core\Database;
use PDO;

class CategoryModel
{
    public static function getCategory() : array
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
            SELECT * FROM category
            ORDER BY caId DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id' => (int)$row['caId'],
                'name' => $row['caName'],
            ];
        }, $rows);
    }
}