<?php
try {
    $p = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '1001');
    $p->exec('DROP DATABASE IF EXISTS namthuedu_test');
    $p->exec('CREATE DATABASE namthuedu_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    echo "recreated namthuedu_test\n";
} catch (Exception $e) {
    echo 'ERR ' . $e->getMessage();
}
