-- Database: namthuedu

CREATE DATABASE IF NOT EXISTS namthuedu 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE namthuedu;

-- 1. Users Table
CREATE TABLE users (
    uId INT AUTO_INCREMENT PRIMARY KEY,
    uPhone VARCHAR(20) NOT NULL UNIQUE,
    uPassword VARCHAR(255) NOT NULL,
    uName VARCHAR(150),
    uGender Boolean,
    uAddress TEXT,
    uClass INT,
    uRole ENUM('student','teacher','admin') DEFAULT 'student',
    uDoB DATE,
    uStatus ENUM('active','inactive') DEFAULT 'active',
    uCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uDeleted_at DATETIME NULL,
    CONSTRAINT fk_user_class FOREIGN KEY (uClass) REFERENCES classed(cId)
		ON DELETE CASCADE
);

SELECT * FROM users;

ALTER TABLE users 
ADD COLUMN uGender BOOLEAN AFTER uName,
ADD COLUMN uAddress TEXT AFTER uGender,
ADD COLUMN uClass INT AFTER uAddress;

ALTER TABLE users
ADD CONSTRAINT fk_user_class 
FOREIGN KEY (uClass) REFERENCES classes(cId) 
ON DELETE CASCADE;

INSERT INTO users (uName, uPhone, uPassword, uGender, uDoB, uAddress, uClass, uStatus, uRole) VALUES 
('Lê Thị B', '0912345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 0, '2003-02-15', '123 Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ', 3, 'active', 'student'),
('Trần Văn C', '0922345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 1, '2003-05-20', '456 Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ', 3, 'active', 'student'),
('Phạm Thị D', '0932345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 0, '2003-08-10', '789 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ', 3, 'active', 'student'),
('Hoàng Văn E', '0942345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 1, '2003-11-25', '101 Tầm Vu, Hưng Lợi, Ninh Kiều, Cần Thơ', 3, 'active', 'student'),
('Nguyễn Thị F', '0952345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 0, '2004-01-05', '202 Trần Hưng Đạo, An Phú, Ninh Kiều, Cần Thơ', 3, 'active', 'student'),
('Đặng Văn G', '0962345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 1, '2003-03-12', '303 Mậu Thân, An Hòa, Ninh Kiều, Cần Thơ', 3, 'active', 'student'),
('Bùi Thị H', '0972345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 0, '2003-06-18', '404 Lê Hồng Phong, Trà An, Bình Thủy, Cần Thơ', 3, 'active', 'student'),
('Vũ Văn I', '0982345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 1, '2003-09-30', '505 Đồng Ngọc Hoàng, Cái Răng, Cần Thơ', 3, 'active', 'student'),
('Đỗ Thị K', '0992345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 0, '2003-12-22', '606 Võ Văn Kiệt, Bình Thủy, Cần Thơ', 3, 'active', 'student'),
('Trịnh Văn L', '0812345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 1, '2003-04-14', '707 Nguyễn Văn Linh, An Khánh, Ninh Kiều, Cần Thơ', 3, 'active', 'student');

-- 2. OTP (Đổi mật khẩu/ xác thực)
CREATE TABLE otp_logs (
    oId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    oCode VARCHAR(6) NOT NULL,
    oExpired_at DATETIME NOT NULL,
    oVerified BOOLEAN DEFAULT FALSE,
    oCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otp_user
        FOREIGN KEY (userId) REFERENCES users(uId)
        ON DELETE CASCADE
);

-- 3. Classes (Teacher manages these)
CREATE TABLE classes (
    cId INT AUTO_INCREMENT PRIMARY KEY,
    cName VARCHAR(100) NOT NULL,
    cTeacher_id INT NOT NULL,
    cDescription TEXT,
    cStatus ENUM('active','inactive') DEFAULT 'active',
    cCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course INT,
    CONSTRAINT fk_class_teacher
        FOREIGN KEY (cTeacher_id) REFERENCES users(uId)
        ON DELETE CASCADE,
	CONSTRAINT fk_class_course 
		FOREIGN KEY (course) REFERENCES classes(cId) 
		ON DELETE CASCADE
);

ALTER TABLE classes
ADD COLUMN course INT AFTER cName;

ALTER TABLE classes
ADD CONSTRAINT fk_class_course 
FOREIGN KEY (course) REFERENCES classes(cId) 
ON DELETE CASCADE;


SELECT * FROM classes;
-- Để course là NULL vì chưa có ID nào khác để tham chiếu
INSERT INTO classes (cName, cTeacher_id, cDescription, cStatus, course) 
VALUES ('Khóa học Tổng quát IC3', 5, 'Khóa học nền tảng', 'active', NULL);
INSERT INTO classes (cName, cTeacher_id, cDescription, cStatus, course) 
VALUES ('Lớp Luyện Thi IC3 GS6 - Nhóm 1', 5, 'Lớp học mẫu cho sinh viên IT', 'active', 1);


-- 4. Class Enrollments
CREATE TABLE class_enrollments (
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, student_id),
    CONSTRAINT fk_enroll_class
        FOREIGN KEY (class_id) REFERENCES classes(cId)
        ON DELETE CASCADE,
    CONSTRAINT fk_enroll_student
        FOREIGN KEY (student_id) REFERENCES users(uId)
        ON DELETE CASCADE
);

-- 5. Exams
CREATE TABLE exams (
    eId INT AUTO_INCREMENT PRIMARY KEY,
    eTitle VARCHAR(255) NOT NULL,
    eDescription TEXT,
    eType ENUM('VSTEP','IELTS','TOEIC','GENERAL') NOT NULL,
    eSkill ENUM('listening','reading','writing','speaking') NOT NULL,
    eTeacher_id INT NOT NULL,
    eDuration_minutes INT DEFAULT 60,
    eIs_private BOOLEAN DEFAULT TRUE,
    eSource_type ENUM('manual','upload') DEFAULT 'manual',
    eCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exam_teacher
        FOREIGN KEY (eTeacher_id) REFERENCES users(uId)
        ON DELETE CASCADE
);

-- 6. Questions
CREATE TABLE questions (
    qId INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    qContent TEXT NOT NULL,
    qMedia_url VARCHAR(255),
    qPoints INT DEFAULT 1,
    qTranscript TEXT,
    qExplanation TEXT,
    qListen_limit INT DEFAULT 1,
    qCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_exam
        FOREIGN KEY (exam_id) REFERENCES exams(eId)
        ON DELETE CASCADE
);

-- 7. Answers (For Listening/Reading)
CREATE TABLE answers (
    aId INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    aContent TEXT,
    aIs_correct BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_answer_question
        FOREIGN KEY (question_id) REFERENCES questions(qId)
        ON DELETE CASCADE
);

-- 8. Test assignment (Giao bài)
CREATE TABLE test_assignments (
    taId INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    taTarget_type ENUM('class','student') NOT NULL,
    taTarget_id INT NOT NULL,
    taDeadline DATETIME,
    taMax_attempt INT DEFAULT 1,
    taIs_public BOOLEAN DEFAULT FALSE,
    taCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_exam
        FOREIGN KEY (exam_id) REFERENCES exams(eId)
        ON DELETE CASCADE
);

-- 9. Submissions
CREATE TABLE submissions (
    sId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    assignment_id INT,
    sAttempt INT DEFAULT 1,
    sStart_time DATETIME,
    sSubmit_time DATETIME,
    sScore DECIMAL(5,2),
    sTeacher_feedback TEXT,
    sGemini_feedback TEXT,
    sStatus ENUM('in_progress','submitted','graded') DEFAULT 'in_progress',
    CONSTRAINT fk_submission_user
        FOREIGN KEY (user_id) REFERENCES users(uId)
        ON DELETE CASCADE,
    CONSTRAINT fk_submission_exam
        FOREIGN KEY (exam_id) REFERENCES exams(eId)
        ON DELETE CASCADE,
    CONSTRAINT fk_submission_assignment
        FOREIGN KEY (assignment_id) REFERENCES test_assignments(taId)
        ON DELETE SET NULL
);

-- 10. Submission Answers (Student answers)
CREATE TABLE submission_answers (
    saId INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    question_id INT NOT NULL,
    saAnswer_text TEXT,
    saIs_correct BOOLEAN,
    saPoints_awarded DECIMAL(5,2),
    CONSTRAINT fk_sa_submission
        FOREIGN KEY (submission_id) REFERENCES submissions(sId)
        ON DELETE CASCADE,
    CONSTRAINT fk_sa_question
        FOREIGN KEY (question_id) REFERENCES questions(qId)
        ON DELETE CASCADE
);

-- 11. Listening logs (Nghe 1 lần)
CREATE TABLE listening_logs (
    lId INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    question_id INT NOT NULL,
    listened_count INT DEFAULT 0,
    CONSTRAINT fk_listen_submission
        FOREIGN KEY (submission_id) REFERENCES submissions(sId)
        ON DELETE CASCADE,
    CONSTRAINT fk_listen_question
        FOREIGN KEY (question_id) REFERENCES questions(qId)
        ON DELETE CASCADE,
    UNIQUE KEY uq_listen (submission_id, question_id)
);

-- 12. Speaking records
CREATE TABLE speaking_records (
    spId INT AUTO_INCREMENT PRIMARY KEY,
    submission_answer_id INT NOT NULL,
    audio_path VARCHAR(255) NOT NULL,
    teacher_comment TEXT,
    score DECIMAL(5,2),
    CONSTRAINT fk_speaking_answer
        FOREIGN KEY (submission_answer_id) REFERENCES submission_answers(saId)
        ON DELETE CASCADE
);

-- 13. Schedules/Timetable
CREATE TABLE schedules (
    scId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    scTitle VARCHAR(200) NOT NULL,
    scDescription TEXT,
    scStart_time DATETIME NOT NULL,
    scEnd_time DATETIME NOT NULL,
    scRelated_type ENUM('class','exam','personal') DEFAULT 'personal',
    scRelated_id INT,
    scCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_user
        FOREIGN KEY (user_id) REFERENCES users(uId)
        ON DELETE CASCADE
);

-- 14. Posts (Tips/Grammar)
CREATE TABLE posts (
    pId INT AUTO_INCREMENT PRIMARY KEY,
    pTitle VARCHAR(255) NOT NULL,
    pContent LONGTEXT NOT NULL,
    pAuthor_id INT NOT NULL,
    pType ENUM('grammar','tips', 'vocabulary') NOT NULL,
    pCategory INT,
    pUrl TEXT,
    pThumbnail TEXT,
    pView INT, -- Lượt xem bài 
    pLike INT, -- Lượt thả yêu thích 
    pStatus ENUM('active', 'inactive', 'draft') NOT NULL,
    pCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pDeleted_at TIMESTAMP,
    pUpdated_at TIMESTAMP,
    CONSTRAINT fk_post_author
        FOREIGN KEY (pAuthor_id) REFERENCES users(uId)
        ON DELETE CASCADE,
	CONSTRAINT fk_post_category
		FOREIGN KEY (pCategory) REFERENCES category(caId)
        ON DELETE CASCADE
);

SELECT p.*, u.uName, c.caName FROM posts AS p JOIN users AS u ON p.pAuthor_id = u.uId JOIN category AS c ON p.pCategory = c.caId WHERE p.pAuthor_id=5;
INSERT INTO posts (pTitle, pContent, pAuthor_id, pType, pCategory, pUrl, pThumbnail, pView, pLike, pStatus, pCreated_at) 
VALUES 
-- Bài viết 1: Về Ngữ pháp (Grammar), trạng thái Active
(
    'Cách phân biệt "Make" và "Do" trong tiếng Anh', 
    'Trong tiếng Anh, Make và Do đều có nghĩa là làm, nhưng cách dùng của chúng rất khác nhau. Make thường dùng cho việc tạo ra cái gì đó mới (sáng tạo), trong khi Do dùng cho các hoạt động, công việc chung chung...', 
    5, -- Giả sử ID tác giả là 1
    'grammar', 
    3, -- Giả sử ID danh mục là 10
    'phan-biet-make-va-do', 
    'https://example.com/images/make-vs-do.jpg', 
    1500, 
    120, 
    'active', 
    NOW()
),

-- Bài viết 2: Về Từ vựng (Vocabulary), trạng thái Active
(
    '50 Từ vựng tiếng Anh chuyên ngành Công nghệ thông tin', 
    'Tổng hợp các từ vựng quan trọng cho dân IT: Algorithm (Thuật toán), Database (Cơ sở dữ liệu), Debug (Gỡ lỗi), Encryption (Mã hóa)...', 
    5, -- Giả sử ID tác giả là 1
    'vocabulary', 
    2, -- Giả sử ID danh mục là 11
    'tu-vung-tieng-anh-it', 
    'https://example.com/images/it-vocab.jpg', 
    3400, 
    450, 
    'active', 
    NOW()
),

-- Bài viết 3: Về Mẹo học tập (Tips), trạng thái Draft (Nháp)
(
    'Phương pháp Pomodoro: Bí quyết tập trung cao độ', 
    'Pomodoro là phương pháp quản lý thời gian để nâng cao tối đa sự tập trung trong công việc. Quy trình thực hiện gồm 5 bước: 1. Chọn công việc cần làm, 2. Đặt báo thức 25 phút...', 
    5, -- Giả sử ID tác giả là 2
    'tips', 
    1, -- Giả sử ID danh mục là 12
    'phuong-phap-pomodoro', 
    'https://example.com/images/pomodoro.png', 
    0, 
    0, 
    'draft', 
    NOW()
);

DROP TABLE posts;

-- 15. Notifications
CREATE TABLE notifications (
    nId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nContent TEXT NOT NULL,
    nIs_read BOOLEAN DEFAULT FALSE,
    nCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notify_user
        FOREIGN KEY (user_id) REFERENCES users(uId)
        ON DELETE CASCADE
);

-- 16. Audit logs (Bảo mật)
CREATE TABLE audit_logs (
    aId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    aAction VARCHAR(255),
    aIp_address VARCHAR(45),
    aCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(uId)
        ON DELETE SET NULL
);

-- INSERT INTO users(uPhone, uPassword, uRole) VALUES (0336695863, '$2a$10$Ugu/RMgmG6tk071M.cuNHOm3pNb6SBhhHSElB/xC1k8Oy3xqibT1O', 'teacher');

-- UPDATE users SET uRole='admin' WHERE uId=2;
-- SELECT * FROM users;

-- DROP DATABASE namthuedu;

CREATE TABLE category (
	caId INT AUTO_INCREMENT PRIMARY KEY,
    caName NVARCHAR(100) NOT NULL
);

CREATE TABLE course (
	cId INT AUTO_INCREMENT PRIMARY KEY,
    cName NVARCHAR(100) NOT NULL,
    cCategory INT,
    cNumberOfStudent INT,
    cTime NVARCHAR(50),
    cSchedule TEXT,
    cStartDate DATE,
    cEndDate DATE,
    cStatus ENUM ('active', 'draft', 'ongoing', 'complete') NOT NULL,
    cTeacher INT,
    CONSTRAINT fk_category_course 
		FOREIGN KEY (cCategory) REFERENCES category(caId)
        ON DELETE CASCADE,
	CONSTRAINT fk_teacher_course
		FOREIGN KEY (cTeacher) REFERENCES users(uId)
        ON DELETE CASCADE,
	cDescription TEXT,
    cDeleteAt DATETIME,
    cCreateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cUpdateAt TIMESTAMP
);

DROP TABLE course;
SELECT * FROM course;
SELECT * FROM category; 
SELECT * FROM users;

INSERT INTO category (caName) VALUES ('TOEIC'), ('VSTEP'), ('IELTS');

INSERT INTO course(cName, cCategory, cNumberOfStudent, cTime, cSchedule, cStartDate, cEndDate, cStatus, cTeacher)
	VALUES ('TOEIC 2 Kỹ năng', 1, 100, '18h00', '2,4,6', '2025-10-20', '2026-01-20', 'complete', 5);
    
INSERT INTO course(cName, cCategory, cNumberOfStudent, cTime, cSchedule, cStartDate, cEndDate, cStatus, cTeacher)
	VALUES ('VSTEP B2', 2, 100, '18h00', '3,5,7', '2025-10-30', '2026-03-20', 'ongoing', 5);
    
INSERT INTO course(cName, cCategory, cNumberOfStudent, cTime, cSchedule, cStartDate, cEndDate, cStatus, cTeacher)
	VALUES ('SPEAKING IELTS BASIC', 3, 10, '18h00', '2,4,6', '2026-1-31', '2026-01-20', 'draft', 5);
    
UPDATE users SET uName='Nhựt Tuấn' WHERE uId=5;

SELECT * FROM course WHERE cTeacher = 5;
