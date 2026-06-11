SET FOREIGN_KEY_CHECKS=0;
-- MySQL dump 10.13  Distrib 9.4.0, for Win64 (x86_64)
--
-- Host: localhost    Database: namthuedu
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `age_group` enum('kids','teens','adults','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `target_value` int NOT NULL DEFAULT '1',
  `target_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lessons_completed',
  `coin_reward` int NOT NULL DEFAULT '0',
  `old_points` int NOT NULL DEFAULT '10',
  `old_criteria` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `achievements_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_activity_logs`
--

DROP TABLE IF EXISTS `admin_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint unsigned NOT NULL,
  `action` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` bigint unsigned DEFAULT NULL,
  `detail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_code` smallint unsigned DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_activity_logs_admin_id_created_at_index` (`admin_id`,`created_at`),
  KEY `admin_activity_logs_entity_type_entity_id_index` (`entity_type`,`entity_id`),
  KEY `admin_activity_logs_admin_id_index` (`admin_id`),
  KEY `admin_activity_logs_action_index` (`action`),
  KEY `admin_activity_logs_entity_type_index` (`entity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_notifications`
--

DROP TABLE IF EXISTS `admin_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_settings`
--

DROP TABLE IF EXISTS `admin_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `aId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint unsigned NOT NULL,
  `aContent` text COLLATE utf8mb4_unicode_ci,
  `aIs_correct` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`aId`),
  KEY `answers_question_id_foreign` (`question_id`),
  CONSTRAINT `answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=944 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset_keywords`
--

DROP TABLE IF EXISTS `asset_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_keywords` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `keyword` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_asset_keyword` (`asset_id`,`keyword`),
  KEY `idx_keyword` (`keyword`),
  CONSTRAINT `asset_keywords_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `contributor_assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asset_metadata_history`
--

DROP TABLE IF EXISTS `asset_metadata_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_metadata_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint unsigned NOT NULL,
  `field_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_value` text COLLATE utf8mb4_unicode_ci,
  `new_value` text COLLATE utf8mb4_unicode_ci,
  `changed_by` bigint unsigned NOT NULL,
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `asset_metadata_history_changed_by_foreign` (`changed_by`),
  KEY `idx_asset_id` (`asset_id`),
  KEY `idx_changed_at` (`changed_at`),
  CONSTRAINT `asset_metadata_history_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `contributor_assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_metadata_history_changed_by_foreign` FOREIGN KEY (`changed_by`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assignment_reminders`
--

DROP TABLE IF EXISTS `assignment_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_reminders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `assignment_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `dismissed_at` timestamp NULL DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assignment_reminders_teacher_id_foreign` (`teacher_id`),
  KEY `assignment_reminders_student_id_dismissed_at_index` (`student_id`,`dismissed_at`),
  KEY `assignment_reminders_assignment_id_student_id_index` (`assignment_id`,`student_id`),
  CONSTRAINT `assignment_reminders_assignment_id_foreign` FOREIGN KEY (`assignment_id`) REFERENCES `test_assignments` (`taId`) ON DELETE CASCADE,
  CONSTRAINT `assignment_reminders_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `assignment_reminders_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`uId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `badges`
--

DROP TABLE IF EXISTS `badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#FFD700',
  `rarity` enum('common','rare','epic','legendary') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'common',
  `age_group` enum('kids','teens','adults','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `requirements` json DEFAULT NULL,
  `coin_reward` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `badges_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_types`
--

DROP TABLE IF EXISTS `blog_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FileText',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_types_type_value_unique` (`type_value`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `caId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `caName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caDescription` text COLLATE utf8mb4_unicode_ci,
  `caType` enum('VSTEP','IELTS','GENERAL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  `caCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`caId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class_enrollments`
--

DROP TABLE IF EXISTS `class_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_enrollments` (
  `class_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `enrollment_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`class_id`,`student_id`),
  KEY `class_enrollments_student_id_foreign` (`student_id`),
  CONSTRAINT `class_enrollments_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classes` (`cId`) ON DELETE CASCADE,
  CONSTRAINT `class_enrollments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class_transfers`
--

DROP TABLE IF EXISTS `class_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_transfers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `from_class_id` bigint unsigned NOT NULL,
  `to_class_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `transferred_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_transfers_to_class_id_foreign` (`to_class_id`),
  KEY `class_transfers_student_id_transferred_at_index` (`student_id`,`transferred_at`),
  KEY `class_transfers_from_class_id_to_class_id_index` (`from_class_id`,`to_class_id`),
  KEY `class_transfers_teacher_id_index` (`teacher_id`),
  CONSTRAINT `class_transfers_from_class_id_foreign` FOREIGN KEY (`from_class_id`) REFERENCES `classes` (`cId`) ON DELETE CASCADE,
  CONSTRAINT `class_transfers_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `class_transfers_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `class_transfers_to_class_id_foreign` FOREIGN KEY (`to_class_id`) REFERENCES `classes` (`cId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `cId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `clId` bigint unsigned DEFAULT NULL,
  `cName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cTeacher_id` bigint unsigned NOT NULL,
  `clTeacher_id` bigint unsigned DEFAULT NULL,
  `cDescription` text COLLATE utf8mb4_unicode_ci,
  `age_group` enum('kids','teens','adults') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Age group for the class: kids (6-12), teens (13-17), adults (18-45)',
  `max_students` int unsigned NOT NULL DEFAULT '30' COMMENT 'Maximum number of students allowed in this class',
  `cStatus` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `cCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `course` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`cId`),
  KEY `classes_cteacher_id_foreign` (`cTeacher_id`),
  KEY `classes_course_foreign` (`course`),
  KEY `classes_clteacher_id_foreign` (`clTeacher_id`),
  KEY `idx_classes_age_group` (`age_group`),
  CONSTRAINT `classes_clteacher_id_foreign` FOREIGN KEY (`clTeacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `classes_course_foreign` FOREIGN KEY (`course`) REFERENCES `classes` (`cId`) ON DELETE CASCADE,
  CONSTRAINT `classes_cteacher_id_foreign` FOREIGN KEY (`cTeacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coin_transactions`
--

DROP TABLE IF EXISTS `coin_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coin_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `type` enum('earn','spend') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'earn',
  `amount` int NOT NULL,
  `reason` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `coin_transactions_student_id_created_at_index` (`student_id`,`created_at`),
  CONSTRAINT `coin_transactions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `content_analytics`
--

DROP TABLE IF EXISTS `content_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_analytics` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `age_group` enum('kids','teens','adults') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_attempts` int NOT NULL DEFAULT '0',
  `total_completions` int NOT NULL DEFAULT '0',
  `avg_score` decimal(5,2) NOT NULL DEFAULT '0.00',
  `avg_completion_time` decimal(8,2) NOT NULL DEFAULT '0.00',
  `engagement_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `performance_breakdown` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_analytics_exam_id_age_group_unique` (`exam_id`,`age_group`),
  KEY `content_analytics_age_group_index` (`age_group`),
  CONSTRAINT `content_analytics_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `content_blocks`
--

DROP TABLE IF EXISTS `content_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_blocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `block_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_exam_order` (`exam_id`,`display_order`),
  KEY `content_blocks_block_type_index` (`block_type`),
  CONSTRAINT `content_blocks_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `content_templates`
--

DROP TABLE IF EXISTS `content_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `age_group` enum('kids','teens','adults','all') COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_config` json NOT NULL,
  `default_settings` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `usage_count` int NOT NULL DEFAULT '0',
  `avg_rating` decimal(3,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `content_templates_age_group_template_type_index` (`age_group`,`template_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contributor_assets`
--

DROP TABLE IF EXISTS `contributor_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contributor_assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contributor_id` bigint unsigned NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int unsigned NOT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `width` int unsigned DEFAULT NULL,
  `height` int unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `category_1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','pending_review','approved','rejected','live','removed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `reviewer_id` bigint unsigned DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `views_count` int unsigned NOT NULL DEFAULT '0',
  `downloads_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contributor_assets_reviewer_id_foreign` (`reviewer_id`),
  KEY `idx_contributor_status` (`contributor_id`,`status`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_at` (`submitted_at`),
  KEY `idx_approved_at` (`approved_at`),
  CONSTRAINT `contributor_assets_contributor_id_foreign` FOREIGN KEY (`contributor_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `contributor_assets_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`uId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `cId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cCategory` bigint unsigned DEFAULT NULL,
  `cType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `cNumberOfStudent` int DEFAULT NULL,
  `cTime` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cSchedule` text COLLATE utf8mb4_unicode_ci,
  `cStartDate` date DEFAULT NULL,
  `cEndDate` date DEFAULT NULL,
  `cStatus` enum('active','draft','ongoing','complete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `cTeacher` bigint unsigned DEFAULT NULL,
  `class_id` bigint unsigned DEFAULT NULL COMMENT 'Foreign key to classes table - courses belong to a specific class',
  `cTeacher_id` bigint unsigned DEFAULT NULL,
  `cDescription` text COLLATE utf8mb4_unicode_ci,
  `cDeleteAt` datetime DEFAULT NULL,
  `cCreateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cUpdateAt` timestamp NULL DEFAULT NULL,
  `cCreated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cId`),
  KEY `course_ccategory_foreign` (`cCategory`),
  KEY `course_cteacher_foreign` (`cTeacher`),
  KEY `course_cteacher_id_foreign` (`cTeacher_id`),
  KEY `idx_course_class_id` (`class_id`),
  KEY `idx_course_status_class` (`cStatus`,`class_id`),
  CONSTRAINT `course_ccategory_foreign` FOREIGN KEY (`cCategory`) REFERENCES `category` (`caId`) ON DELETE CASCADE,
  CONSTRAINT `course_cteacher_foreign` FOREIGN KEY (`cTeacher`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `course_cteacher_id_foreign` FOREIGN KEY (`cTeacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `fk_course_class_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`cId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_enrollments`
--

DROP TABLE IF EXISTS `course_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_enrollments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `status` enum('enrolled','completed','dropped') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enrolled',
  `fee_paid` decimal(10,2) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_enrollments_course_id_student_id_unique` (`course_id`,`student_id`),
  KEY `course_enrollments_course_id_status_index` (`course_id`,`status`),
  KEY `course_enrollments_student_id_index` (`student_id`),
  CONSTRAINT `course_enrollments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `course` (`cId`) ON DELETE CASCADE,
  CONSTRAINT `course_enrollments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_comments`
--

DROP TABLE IF EXISTS `exam_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL COMMENT 'NULL = top-level comment, có giá trị = reply',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_comments_exam_id_index` (`exam_id`),
  KEY `exam_comments_user_id_index` (`user_id`),
  KEY `exam_comments_parent_id_index` (`parent_id`),
  CONSTRAINT `exam_comments_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE,
  CONSTRAINT `exam_comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `exam_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_highlights`
--

DROP TABLE IF EXISTS `exam_highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_highlights` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `exam_id` bigint unsigned NOT NULL,
  `skill` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'reading',
  `part_number` tinyint unsigned NOT NULL,
  `start_offset` int unsigned NOT NULL,
  `end_offset` int unsigned NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yellow',
  `selected_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_highlights_user_id_exam_id_part_number_index` (`user_id`,`exam_id`,`part_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_templates`
--

DROP TABLE IF EXISTS `exam_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `etId` bigint unsigned DEFAULT NULL,
  `template_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('cambridge_young','cambridge_main','international','specialized') COLLATE utf8mb4_unicode_ci NOT NULL,
  `etCategory` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` enum('pre_a1','a1','a2','b1','b2','c1','c2') COLLATE utf8mb4_unicode_ci NOT NULL,
  `age_group` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_duration_minutes` int NOT NULL,
  `skills` json NOT NULL,
  `sections` json NOT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `etStatus` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `template_category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exam_templates_template_code_unique` (`template_code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_types`
--

DROP TABLE IF EXISTS `exam_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_types` (
  `etId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etDescription` text COLLATE utf8mb4_unicode_ci,
  `etHas_reading` tinyint(1) NOT NULL DEFAULT '0',
  `etHas_listening` tinyint(1) NOT NULL DEFAULT '0',
  `etHas_writing` tinyint(1) NOT NULL DEFAULT '0',
  `etHas_speaking` tinyint(1) NOT NULL DEFAULT '0',
  `etScoring_system` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etMax_score` decimal(5,2) DEFAULT NULL,
  `etMin_pass_score` decimal(5,2) DEFAULT NULL,
  `etOfficial_website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etIs_active` tinyint(1) NOT NULL DEFAULT '1',
  `etCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`etId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_vocab_notes`
--

DROP TABLE IF EXISTS `exam_vocab_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_vocab_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `exam_id` bigint unsigned NOT NULL,
  `word` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `context` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vocab_user_exam_word_unique` (`user_id`,`exam_id`,`word`),
  KEY `exam_vocab_notes_user_id_exam_id_index` (`user_id`,`exam_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `eId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_type_id` bigint unsigned DEFAULT NULL,
  `template_id` bigint unsigned DEFAULT NULL,
  `exam_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eDescription` text COLLATE utf8mb4_unicode_ci,
  `eDifficulty_level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eTarget_level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eDuration` int DEFAULT NULL,
  `eTotal_score` decimal(5,2) DEFAULT NULL,
  `ePass_score` decimal(5,2) DEFAULT NULL,
  `eStatus` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `eVisibility` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'private',
  `teacher_id` bigint unsigned DEFAULT NULL,
  `eTags` json DEFAULT NULL,
  `eType` enum('VSTEP','IELTS','GENERAL','THPT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `age_group` enum('kids','teens','adults','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `content_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty_level` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gamification_config` json DEFAULT NULL,
  `ui_config` json DEFAULT NULL,
  `kids_exam_config` json DEFAULT NULL,
  `ielts_config` json DEFAULT NULL,
  `thpt_config` json DEFAULT NULL,
  `thpt_draft_config` json DEFAULT NULL,
  `thpt_version` int unsigned NOT NULL DEFAULT '0',
  `thpt_versions` json DEFAULT NULL,
  `eSkill` enum('listening','reading','writing','speaking','mixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ielts_test_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ielts_skill` enum('listening','reading','writing','speaking') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Skill của đề IELTS (1 đề = 1 skill)',
  `eTeacher_id` bigint unsigned NOT NULL,
  `eDuration_minutes` int NOT NULL DEFAULT '60',
  `eIs_private` tinyint(1) NOT NULL DEFAULT '1',
  `eSource_type` enum('manual','upload','template') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `ePurpose` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eTopic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eDifficulty` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eParent_exam_id` bigint unsigned DEFAULT NULL,
  `eCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`eId`),
  KEY `exams_eteacher_id_foreign` (`eTeacher_id`),
  KEY `exams_template_id_foreign` (`template_id`),
  KEY `exams_exam_type_id_foreign` (`exam_type_id`),
  KEY `exams_teacher_id_foreign` (`teacher_id`),
  KEY `exams_eparent_exam_id_foreign` (`eParent_exam_id`),
  KEY `exams_age_group_index` (`age_group`),
  KEY `idx_ielts_type_skill` (`ielts_test_type`,`ielts_skill`),
  CONSTRAINT `exams_eparent_exam_id_foreign` FOREIGN KEY (`eParent_exam_id`) REFERENCES `exams` (`eId`) ON DELETE SET NULL,
  CONSTRAINT `exams_eteacher_id_foreign` FOREIGN KEY (`eTeacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `exams_exam_type_id_foreign` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types` (`etId`) ON DELETE SET NULL,
  CONSTRAINT `exams_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `exams_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `exam_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grading_history`
--

DROP TABLE IF EXISTS `grading_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grading_history` (
  `ghId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `submission_id` bigint unsigned NOT NULL,
  `answer_id` bigint unsigned DEFAULT NULL,
  `ghAction` enum('ai_grade','ai_regrade','teacher_accept','teacher_modify','teacher_save_all') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghActor_id` bigint unsigned DEFAULT NULL,
  `ghPrev_score` decimal(5,2) DEFAULT NULL,
  `ghNew_score` decimal(5,2) DEFAULT NULL,
  `ghNote` text COLLATE utf8mb4_unicode_ci,
  `ghMetadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ghId`),
  KEY `grading_history_submission_id_index` (`submission_id`),
  KEY `grading_history_answer_id_index` (`answer_id`),
  KEY `grading_history_submission_id_ghaction_index` (`submission_id`,`ghAction`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kids_exam_templates`
--

DROP TABLE IF EXISTS `kids_exam_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kids_exam_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `config` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kids_exam_templates_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kids_media`
--

DROP TABLE IF EXISTS `kids_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kids_media` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned DEFAULT NULL,
  `question_id` bigint unsigned DEFAULT NULL,
  `media_type` enum('audio','image') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int DEFAULT NULL,
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kids_media_exam_id_foreign` (`exam_id`),
  KEY `kids_media_question_id_foreign` (`question_id`),
  CONSTRAINT `kids_media_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE,
  CONSTRAINT `kids_media_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kids_task_definitions`
--

DROP TABLE IF EXISTS `kids_task_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kids_task_definitions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `definition` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kids_task_definitions_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `otp_logs`
--

DROP TABLE IF EXISTS `otp_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_logs` (
  `oId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint unsigned NOT NULL,
  `oCode` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oExpired_at` datetime NOT NULL,
  `oVerified` tinyint(1) NOT NULL DEFAULT '0',
  `oCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`oId`),
  KEY `otp_logs_userid_foreign` (`userId`),
  CONSTRAINT `otp_logs_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `last_used_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `pId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pTitle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pContent` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `pAuthor_id` bigint unsigned NOT NULL,
  `pType` enum('grammar','tips','vocabulary','teaching','news') COLLATE utf8mb4_unicode_ci NOT NULL,
  `pCategory` bigint unsigned DEFAULT NULL,
  `pUrl` text COLLATE utf8mb4_unicode_ci,
  `pThumbnail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pView` int NOT NULL DEFAULT '0',
  `pLike` int NOT NULL DEFAULT '0',
  `pStatus` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `pApproved_by` bigint unsigned DEFAULT NULL,
  `pApproved_at` timestamp NULL DEFAULT NULL,
  `pRejected_by` bigint unsigned DEFAULT NULL,
  `pRejected_at` timestamp NULL DEFAULT NULL,
  `pReject_reason` text COLLATE utf8mb4_unicode_ci,
  `pCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pDeleted_at` timestamp NULL DEFAULT NULL,
  `pUpdated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`pId`),
  KEY `posts_pauthor_id_foreign` (`pAuthor_id`),
  KEY `posts_pcategory_foreign` (`pCategory`),
  CONSTRAINT `posts_pauthor_id_foreign` FOREIGN KEY (`pAuthor_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `posts_pcategory_foreign` FOREIGN KEY (`pCategory`) REFERENCES `category` (`caId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `practice_sessions`
--

DROP TABLE IF EXISTS `practice_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practice_sessions` (
  `ps_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ps_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ps_description` text COLLATE utf8mb4_unicode_ci,
  `ps_type` enum('topic_based','skill_based','random','template_based','custom') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ps_purpose` enum('review','practice','drill','mock_test','homework') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ps_target_skill` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ps_topic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ps_difficulty` enum('easy','medium','hard','mixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `ps_duration_minutes` int NOT NULL DEFAULT '30',
  `ps_question_count` int NOT NULL DEFAULT '10',
  `ps_teacher_id` bigint unsigned NOT NULL,
  `ps_exam_id` bigint unsigned DEFAULT NULL,
  `ps_config` json DEFAULT NULL,
  `ps_is_active` tinyint(1) NOT NULL DEFAULT '1',
  `ps_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ps_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ps_id`),
  KEY `practice_sessions_ps_exam_id_foreign` (`ps_exam_id`),
  KEY `practice_sessions_ps_teacher_id_ps_type_index` (`ps_teacher_id`,`ps_type`),
  KEY `practice_sessions_ps_target_skill_ps_difficulty_index` (`ps_target_skill`,`ps_difficulty`),
  CONSTRAINT `practice_sessions_ps_exam_id_foreign` FOREIGN KEY (`ps_exam_id`) REFERENCES `exams` (`eId`) ON DELETE SET NULL,
  CONSTRAINT `practice_sessions_ps_teacher_id_foreign` FOREIGN KEY (`ps_teacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `push_subscriptions`
--

DROP TABLE IF EXISTS `push_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `endpoint` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p256dh_key` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth_key` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `push_subscriptions_endpoint_unique` (`endpoint`),
  KEY `push_subscriptions_user_id_index` (`user_id`),
  CONSTRAINT `push_subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_banks`
--

DROP TABLE IF EXISTS `question_banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_banks` (
  `qb_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `qb_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qb_description` text COLLATE utf8mb4_unicode_ci,
  `qb_type` enum('VSTEP','IELTS_ACADEMIC','IELTS_GENERAL','GENERAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `qb_skill` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qb_topic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qb_difficulty` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `qb_teacher_id` bigint unsigned NOT NULL,
  `qb_is_public` tinyint(1) NOT NULL DEFAULT '0',
  `qb_question_count` int NOT NULL DEFAULT '0',
  `qb_tags` json DEFAULT NULL,
  `qb_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `qb_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`qb_id`),
  KEY `question_banks_qb_type_qb_skill_index` (`qb_type`,`qb_skill`),
  KEY `question_banks_qb_teacher_id_qb_is_public_index` (`qb_teacher_id`,`qb_is_public`),
  CONSTRAINT `question_banks_qb_teacher_id_foreign` FOREIGN KEY (`qb_teacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `qId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `content_block_id` bigint unsigned DEFAULT NULL,
  `qExam_id` bigint unsigned DEFAULT NULL,
  `qContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `qType` enum('multiple_choice','fill_blank','true_false','matching','matching_lines','coloring','short_answer','essay','speaking','speaking_identification','speaking_comparison','multiple_choice_cloze','word_completion','open_cloze','information_transfer','short_writing','speaking_interaction','speaking_solution','speaking_topic','reading_inference','reading_main_idea','reading_vocabulary','listening_announcement','listening_dialogue','listening_lecture','kids_task','true_false_not_given','yes_no_not_given','sentence_completion','summary_completion','note_completion','form_completion','table_completion','flow_chart_completion','matching_headings','matching_information','matching_features','matching_sentence_endings','diagram_labelling','plan_map_diagram') COLLATE utf8mb4_unicode_ci DEFAULT 'multiple_choice',
  `qData` json DEFAULT NULL,
  `age_group` enum('kids','teens','adults','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `media_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interactive_config` json DEFAULT NULL,
  `feedback_config` json DEFAULT NULL,
  `kids_task_config` json DEFAULT NULL,
  `qSection` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qSkill` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Alternative field name for qSection (listening, reading, writing, speaking)',
  `qSection_order` int DEFAULT NULL,
  `qPart` int DEFAULT NULL COMMENT 'Part number for VSTEP structure (1, 2, 3, etc.)',
  `qSubPart` int DEFAULT NULL COMMENT 'Cambridge sub-part number (Part 1, Part 2, etc. within a skill section)',
  `qMedia_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qAudio_duration` int DEFAULT NULL COMMENT 'Audio duration in seconds for listening questions',
  `qPoints` int NOT NULL DEFAULT '1',
  `qTranscript` text COLLATE utf8mb4_unicode_ci,
  `qExplanation` text COLLATE utf8mb4_unicode_ci,
  `qListen_limit` int NOT NULL DEFAULT '1',
  `qConfig` json DEFAULT NULL,
  `qPassage_text` text COLLATE utf8mb4_unicode_ci,
  `qWord_count` int DEFAULT NULL,
  `qTime_limit` int DEFAULT NULL,
  `qWeight` decimal(5,2) DEFAULT NULL,
  `qAudio_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qPlay_limit` int NOT NULL DEFAULT '2',
  `qTranscript_available` tinyint(1) NOT NULL DEFAULT '1',
  `qDifficulty` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `qTags` json DEFAULT NULL,
  `qCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `qOptions` json DEFAULT NULL,
  `qCorrect_answer` text COLLATE utf8mb4_unicode_ci,
  `qScore` int NOT NULL DEFAULT '1',
  `qOrder` int NOT NULL DEFAULT '1',
  `qPartNumber` int NOT NULL DEFAULT '1',
  `qCustomTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qSkillSection` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`qId`),
  KEY `questions_qexam_id_foreign` (`qExam_id`),
  KEY `questions_age_group_index` (`age_group`),
  KEY `questions_content_block_id_index` (`content_block_id`),
  KEY `idx_exam_order` (`exam_id`,`qOrder`),
  KEY `idx_exam_skill` (`exam_id`,`qSkillSection`),
  CONSTRAINT `questions_content_block_id_foreign` FOREIGN KEY (`content_block_id`) REFERENCES `content_blocks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `questions_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE,
  CONSTRAINT `questions_qexam_id_foreign` FOREIGN KEY (`qExam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=439 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_achievements`
--

DROP TABLE IF EXISTS `student_achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_achievements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `achievement_id` bigint unsigned NOT NULL,
  `current_value` int NOT NULL DEFAULT '0',
  `target_value` int NOT NULL DEFAULT '1',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `earned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_achievements_student_id_achievement_id_unique` (`student_id`,`achievement_id`),
  KEY `student_achievements_achievement_id_foreign` (`achievement_id`),
  CONSTRAINT `student_achievements_achievement_id_foreign` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_achievements_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_badges`
--

DROP TABLE IF EXISTS `student_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_badges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `badge_id` bigint unsigned NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_badges_student_id_badge_id_unique` (`student_id`,`badge_id`),
  KEY `student_badges_badge_id_foreign` (`badge_id`),
  CONSTRAINT `student_badges_badge_id_foreign` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_badges_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_coins`
--

DROP TABLE IF EXISTS `student_coins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_coins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `total_coins` int NOT NULL DEFAULT '0',
  `lifetime_coins` int NOT NULL DEFAULT '0',
  `spent_coins` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_coins_student_id_unique` (`student_id`),
  CONSTRAINT `student_coins_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_points`
--

DROP TABLE IF EXISTS `student_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_points` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `points` int NOT NULL,
  `source` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` bigint unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_points_student_id_created_at_index` (`student_id`,`created_at`),
  CONSTRAINT `student_points_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_stats`
--

DROP TABLE IF EXISTS `student_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_stats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `lessons_completed` int NOT NULL DEFAULT '0',
  `exams_taken` int NOT NULL DEFAULT '0',
  `practice_sessions` int NOT NULL DEFAULT '0',
  `total_points` int NOT NULL DEFAULT '0',
  `average_score` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Điểm trung bình (%)',
  `study_time_minutes` int NOT NULL DEFAULT '0' COMMENT 'Tổng thời gian học (phút)',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_stats_student_id_unique` (`student_id`),
  CONSTRAINT `student_stats_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_streaks`
--

DROP TABLE IF EXISTS `student_streaks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_streaks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `current_streak` int NOT NULL DEFAULT '0',
  `longest_streak` int NOT NULL DEFAULT '0',
  `last_activity_date` date DEFAULT NULL,
  `total_active_days` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_streaks_student_id_unique` (`student_id`),
  CONSTRAINT `student_streaks_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `submission_answers`
--

DROP TABLE IF EXISTS `submission_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_answers` (
  `saId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `submission_id` bigint unsigned NOT NULL,
  `question_id` bigint unsigned NOT NULL,
  `saAnswer_text` text COLLATE utf8mb4_unicode_ci,
  `saIs_correct` tinyint(1) DEFAULT NULL,
  `saPoints_awarded` decimal(5,2) DEFAULT NULL,
  `saAi_score` decimal(5,2) DEFAULT NULL COMMENT 'AI suggested score (0-10)',
  `saAi_feedback` text COLLATE utf8mb4_unicode_ci COMMENT 'AI generated feedback for this answer',
  `saAi_criteria` json DEFAULT NULL COMMENT 'Per-criterion breakdown JSON',
  `saAi_model` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saAi_graded_at` timestamp NULL DEFAULT NULL,
  `saReview_status` enum('pending','accepted','modified') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'pending=not reviewed; accepted=AI verbatim; modified=teacher overrode',
  `saReviewed_at` timestamp NULL DEFAULT NULL,
  `saReviewed_by` bigint unsigned DEFAULT NULL,
  `saTeacher_feedback` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`saId`),
  KEY `submission_answers_submission_id_foreign` (`submission_id`),
  KEY `submission_answers_question_id_foreign` (`question_id`),
  CONSTRAINT `submission_answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE,
  CONSTRAINT `submission_answers_submission_id_foreign` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`sId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=883 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `sId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `sStudent_id` bigint unsigned DEFAULT NULL,
  `student_id` bigint unsigned DEFAULT NULL,
  `exam_id` bigint unsigned NOT NULL,
  `assignment_id` bigint unsigned DEFAULT NULL,
  `sAttempt` int NOT NULL DEFAULT '1',
  `sStart_time` datetime DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `sSubmit_time` datetime DEFAULT NULL,
  `sTime_taken` int DEFAULT NULL,
  `sGraded_time` timestamp NULL DEFAULT NULL,
  `teacher_reviewed_at` timestamp NULL DEFAULT NULL,
  `submit_idempotency_key` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `sScore` decimal(5,2) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `sTotal_score` decimal(5,2) DEFAULT NULL,
  `sTeacher_feedback` text COLLATE utf8mb4_unicode_ci,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `time_spent` int DEFAULT NULL,
  `sGemini_feedback` text COLLATE utf8mb4_unicode_ci,
  `submission_payload` json DEFAULT NULL,
  `sStatus` enum('in_progress','submitted','graded','partially_graded','grading_subjective','auto_submitted') COLLATE utf8mb4_unicode_ci DEFAULT 'in_progress',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in_progress',
  `sSubmitted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`sId`),
  UNIQUE KEY `submissions_submit_idempotency_key_unique` (`submit_idempotency_key`),
  KEY `submissions_user_id_foreign` (`user_id`),
  KEY `submissions_exam_id_foreign` (`exam_id`),
  KEY `submissions_assignment_id_foreign` (`assignment_id`),
  KEY `submissions_sstudent_id_foreign` (`sStudent_id`),
  CONSTRAINT `submissions_assignment_id_foreign` FOREIGN KEY (`assignment_id`) REFERENCES `test_assignments` (`taId`) ON DELETE SET NULL,
  CONSTRAINT `submissions_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE,
  CONSTRAINT `submissions_sstudent_id_foreign` FOREIGN KEY (`sStudent_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE,
  CONSTRAINT `submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher_activity_logs`
--

DROP TABLE IF EXISTS `teacher_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned NOT NULL,
  `action` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` bigint unsigned DEFAULT NULL,
  `detail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_activity_logs_teacher_id_created_at_index` (`teacher_id`,`created_at`),
  KEY `teacher_activity_logs_action_index` (`action`),
  KEY `teacher_activity_logs_entity_type_index` (`entity_type`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template_sections`
--

DROP TABLE IF EXISTS `template_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned NOT NULL,
  `section_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_description` text COLLATE utf8mb4_unicode_ci,
  `section_order` int NOT NULL,
  `duration_minutes` int NOT NULL,
  `question_count` int NOT NULL,
  `question_types` json NOT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `section_config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `total_questions` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `template_sections_template_id_foreign` (`template_id`),
  CONSTRAINT `template_sections_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `exam_templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_assignments`
--

DROP TABLE IF EXISTS `test_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_assignments` (
  `taId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `age_group` enum('kids','teens','adults','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `adaptive_settings` json DEFAULT NULL,
  `gamification_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `competitive_mode` tinyint(1) NOT NULL DEFAULT '0',
  `taTarget_type` enum('class','student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `taTarget_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned DEFAULT NULL,
  `class_id` bigint unsigned DEFAULT NULL,
  `taTeacher_id` bigint unsigned DEFAULT NULL,
  `assigned_by` bigint unsigned DEFAULT NULL,
  `taDeadline` datetime DEFAULT NULL,
  `taStart_time` datetime DEFAULT NULL,
  `taNotify_before_minutes` int DEFAULT NULL,
  `taNotified_at` timestamp NULL DEFAULT NULL,
  `taInstructions` text COLLATE utf8mb4_unicode_ci,
  `due_date` timestamp NULL DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'assigned',
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `taMax_attempt` int NOT NULL DEFAULT '1',
  `taIs_public` tinyint(1) NOT NULL DEFAULT '0',
  `taCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`taId`),
  KEY `test_assignments_exam_id_foreign` (`exam_id`),
  KEY `test_assignments_tateacher_id_foreign` (`taTeacher_id`),
  KEY `test_assignments_age_group_index` (`age_group`),
  CONSTRAINT `test_assignments_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE,
  CONSTRAINT `test_assignments_tateacher_id_foreign` FOREIGN KEY (`taTeacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uId` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uPhone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uPassword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plain_password` text COLLATE utf8mb4_unicode_ci,
  `notifications_read_at` timestamp NULL DEFAULT NULL,
  `dismissed_notification_ids` json DEFAULT NULL,
  `scheduled_delete_at` timestamp NULL DEFAULT NULL,
  `notification_settings` json DEFAULT NULL,
  `uName` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uGender` tinyint(1) DEFAULT NULL,
  `uAddress` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `uClass` bigint unsigned DEFAULT NULL,
  `class_id` bigint unsigned DEFAULT NULL COMMENT 'Foreign key to classes table - required for students',
  `uRole` enum('student','teacher','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age_group` enum('kids','teens','adults') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'teens' COMMENT 'User age group for UI adaptation',
  `date_of_birth` date DEFAULT NULL COMMENT 'User date of birth',
  `theme_preference` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'auto' COMMENT 'Theme preference: auto, kids, teens, adults',
  `language_preference` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'vi',
  `theme_updated_at` timestamp NULL DEFAULT NULL COMMENT 'Last time theme was updated',
  `uDoB` date DEFAULT NULL,
  `uStatus` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `refresh_token` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refresh_token_expires_at` timestamp NULL DEFAULT NULL,
  `uCreated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uLast_login` timestamp NULL DEFAULT NULL,
  `uDeleted_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`uId`),
  UNIQUE KEY `users_uphone_unique` (`uPhone`),
  KEY `idx_users_class_id` (`class_id`),
  KEY `idx_users_role_class` (`uRole`,`class_id`),
  CONSTRAINT `fk_users_class_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`cId`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `websocket_statistics_entries`
--

DROP TABLE IF EXISTS `websocket_statistics_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `websocket_statistics_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `app_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `peak_connection_count` int NOT NULL,
  `websocket_message_count` int NOT NULL,
  `api_message_count` int NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-09  4:01:06
SET FOREIGN_KEY_CHECKS=1;
