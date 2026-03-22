-- Create test database for Nam Thu Education
CREATE DATABASE IF NOT EXISTS namthuedu_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Show databases to confirm
SHOW DATABASES LIKE 'namthuedu%';

-- Grant privileges (if needed)
-- GRANT ALL PRIVILEGES ON namthuedu_test.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'Test database created successfully!' AS message;
