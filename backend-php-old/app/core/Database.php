<?php

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        try {
            $this->connection = new PDO("mysql:host=localhost;port=3307;dbname=namthuedu", "root", "Sql@123456");
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // In ra terminal nếu bạn chạy script bằng lệnh 'php index.php'
            if (php_sapi_name() === 'cli') {
                echo "\033[32mKết nối đến database thành công!\033[0m\n"; // Màu xanh lá
            } else {
                // Ghi vào error log của server nếu chạy qua web (Apache/XAMPP)
                error_log("Kết nối đến database thành công!");
            }
        } catch (PDOException $e) {
            die("Kết nối thất bại: " . $e->getMessage());
        }
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->connection;
    }
}
