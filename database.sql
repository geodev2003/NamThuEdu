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
    uRole ENUM('student','teacher','admin') DEFAULT 'student',
    uDoB DATE,
    uStatus ENUM('active','inactive') DEFAULT 'active',
    uCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uDeleted_at DATETIME NULL
);

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
    CONSTRAINT fk_class_teacher
        FOREIGN KEY (cTeacher_id) REFERENCES users(uId)
        ON DELETE CASCADE
);

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
    pType ENUM('video','article') NOT NULL,
    pCategory ENUM('tip','grammar','vocabulary') NOT NULL,
    pThumbnail VARCHAR(255),
    pCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_author
        FOREIGN KEY (pAuthor_id) REFERENCES users(uId)
        ON DELETE CASCADE
);

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
