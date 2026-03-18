-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 10, 2026 lúc 02:39 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `namthu_edu`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `answers`
--

CREATE TABLE `answers` (
  `aId` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_key` varchar(10) NOT NULL COMMENT 'A, B, C, D, E, F, 1, 2, 3...',
  `option_text` text NOT NULL,
  `option_image` varchar(500) DEFAULT NULL,
  `option_audio` varchar(500) DEFAULT NULL,
  `aIs_correct` tinyint(1) DEFAULT 0,
  `aMatch_pair_id` int(11) DEFAULT NULL COMMENT 'ID của cặp nối',
  `aOrder_number` int(11) DEFAULT 0,
  `aCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `answers`
--

INSERT INTO `answers` (`aId`, `question_id`, `option_key`, `option_text`, `option_image`, `option_audio`, `aIs_correct`, `aMatch_pair_id`, `aOrder_number`, `aCreated_at`) VALUES
(1, 1, 'A', '8:00 PM', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(2, 1, 'B', '7:00 PM', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(3, 1, 'C', '6:00 PM', NULL, NULL, 1, NULL, 3, '2026-02-04 13:40:08'),
(4, 1, 'D', '9:00 PM', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(5, 2, 'A', 'Platform 2', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(6, 2, 'B', 'Platform 6', NULL, NULL, 1, NULL, 2, '2026-02-04 13:40:08'),
(7, 2, 'C', 'Platform 4', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(8, 2, 'D', 'Platform 8', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(9, 3, 'A', 'To warn about severe weather', NULL, NULL, 1, NULL, 1, '2026-02-04 13:40:08'),
(10, 3, 'B', 'To notify a road closure', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(11, 3, 'C', 'To advertise a new event', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(12, 3, 'D', 'To remind about safety regulations', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(13, 4, 'A', 'Room 101', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(14, 4, 'B', 'Room 303', NULL, NULL, 1, NULL, 2, '2026-02-04 13:40:08'),
(15, 4, 'C', 'Room 300', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(16, 4, 'D', 'Room 404', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(17, 5, 'A', '5:30 PM', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(18, 5, 'B', '6:00 PM', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(19, 5, 'C', '6:30 PM', NULL, NULL, 1, NULL, 3, '2026-02-04 13:40:08'),
(20, 5, 'D', '7:00 PM', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(21, 6, 'A', 'Free yoga classes', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(22, 6, 'B', 'Free swimming lessons', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(23, 6, 'C', 'Complimentary personal training', NULL, NULL, 1, NULL, 3, '2026-02-04 13:40:08'),
(24, 6, 'D', 'Access to exclusive use of workout equipment', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(25, 7, 'A', '1 hour', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(26, 7, 'B', '2 hours', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(27, 7, 'C', '4 hours', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(28, 7, 'D', '3 hours', NULL, NULL, 1, NULL, 4, '2026-02-04 13:40:08'),
(29, 8, 'A', 'Validate their tickets', NULL, NULL, 1, NULL, 1, '2026-02-04 13:40:08'),
(30, 8, 'B', 'Show their ID cards', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(31, 8, 'C', 'Check the seating chart', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(32, 8, 'D', 'Confirm their destination', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(33, 9, 'A', 'The cost of rent', NULL, NULL, 1, NULL, 1, '2026-02-04 13:40:08'),
(34, 9, 'B', 'The size of the room', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(35, 9, 'C', 'The distance to campus', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(36, 9, 'D', 'The availability of facilities', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(37, 10, 'A', 'They are covered by the landlord.', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(38, 10, 'B', 'They are included in the rent.', NULL, NULL, 1, NULL, 2, '2026-02-04 13:40:08'),
(39, 10, 'C', 'They are optional for students.', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(40, 10, 'D', 'They need to be paid separately.', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(41, 11, 'A', 'To focus on his studies', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(42, 11, 'B', 'To save money', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(43, 11, 'C', 'To have more privacy', NULL, NULL, 1, NULL, 3, '2026-02-04 13:40:08'),
(44, 11, 'D', 'To avoid conflicts with the neighbors', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(45, 12, 'A', 'Choosing a course', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(46, 12, 'B', 'Finding accommodation', NULL, NULL, 1, NULL, 2, '2026-02-04 13:40:08'),
(47, 12, 'C', 'Budgeting expenses', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(48, 12, 'D', 'Joining a student club', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(49, 13, 'A', 'Business', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(50, 13, 'B', 'Education', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(51, 13, 'C', 'Family visit', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(52, 13, 'D', 'Leisure', NULL, NULL, 1, NULL, 4, '2026-02-04 13:40:08'),
(53, 14, 'A', 'It’s informative.', NULL, NULL, 1, NULL, 1, '2026-02-04 13:40:08'),
(54, 14, 'B', 'It’s affordable.', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(55, 14, 'C', 'It’s popular with tourists.', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(56, 14, 'D', 'It’s organized by locals.', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(57, 15, 'A', 'A guidebook', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(58, 15, 'B', 'Their tickets', NULL, NULL, 1, NULL, 2, '2026-02-04 13:40:08'),
(59, 15, 'C', 'A camera', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(60, 15, 'D', 'A student ID', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(61, 16, 'A', 'A hotel receptionist', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(62, 16, 'B', 'A tour guide', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(63, 16, 'C', 'A travel agent', NULL, NULL, 1, NULL, 3, '2026-02-04 13:40:08'),
(64, 16, 'D', 'A tourist', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(65, 17, 'A', 'She doesn’t know how to begin.', NULL, NULL, 1, NULL, 1, '2026-02-04 13:40:08'),
(66, 17, 'B', 'She missed the last lecture.', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(67, 17, 'C', 'She has limited access to resources.', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(68, 17, 'D', 'She is running out of time.', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(69, 18, 'A', 'Online journals', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(70, 18, 'B', 'Class notes', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(71, 18, 'C', 'The library’s database', NULL, NULL, 1, NULL, 3, '2026-02-04 13:40:08'),
(72, 18, 'D', 'A reference book', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(73, 19, 'A', 'Excited', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(74, 19, 'B', 'Uninterested', NULL, NULL, 0, NULL, 2, '2026-02-04 13:40:08'),
(75, 19, 'C', 'Confident', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(76, 19, 'D', 'Nervous', NULL, NULL, 1, NULL, 4, '2026-02-04 13:40:08'),
(77, 20, 'A', 'Preparing for an exam', NULL, NULL, 0, NULL, 1, '2026-02-04 13:40:08'),
(78, 20, 'B', 'Completing an assignment', NULL, NULL, 1, NULL, 2, '2026-02-04 13:40:08'),
(79, 20, 'C', 'Attending a workshop', NULL, NULL, 0, NULL, 3, '2026-02-04 13:40:08'),
(80, 20, 'D', 'Choosing a project topic', NULL, NULL, 0, NULL, 4, '2026-02-04 13:40:08'),
(81, 21, 'A', 'Tips for healthy eating', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(82, 21, 'B', 'The benefits of exercise', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(83, 21, 'C', 'Managing stress effectively', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(84, 21, 'D', 'Improving sleep quality', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(85, 22, 'A', 'It’s a good source of energy.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(86, 22, 'B', 'It should be consumed in moderation.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(87, 22, 'C', 'It’s harmful to the digestive system.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(88, 22, 'D', 'It’s better than fresh food.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(89, 23, 'A', 'Daily', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(90, 23, 'B', 'Three times a week', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(91, 23, 'C', 'Once a week', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(92, 23, 'D', 'Twice a month', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(93, 24, 'A', 'It helps to build muscles.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(94, 24, 'B', 'It prevents dehydration.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(95, 24, 'C', 'It provides essential vitamins.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(96, 24, 'D', 'It strengthens bones.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(97, 25, 'A', 'Maintain a balanced diet', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(98, 25, 'B', 'Avoid junk food', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(99, 25, 'C', 'Sleep early every night', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(100, 25, 'D', 'Take supplements regularly', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(101, 26, 'A', 'Climate change', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(102, 26, 'B', 'Renewable energy', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(103, 26, 'C', 'Conservation of water', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(104, 26, 'D', 'Deforestation', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(105, 27, 'A', 'It’s widely available.', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(106, 27, 'B', 'It’s expensive to maintain.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(107, 27, 'C', 'It’s not reliable in quantity.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(108, 27, 'D', 'It requires regular maintenance.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(109, 28, 'A', 'It’s economical.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(110, 28, 'B', 'It’s unpredictable.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(111, 28, 'C', 'It’s a limited resource.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(112, 28, 'D', 'It’s difficult to harness.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(113, 29, 'A', 'High initial costs', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(114, 29, 'B', 'Lack of public awareness', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(115, 29, 'C', 'Limited technology', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(116, 29, 'D', 'Government restrictions', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(117, 30, 'A', 'Educating the public', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(118, 30, 'B', 'Lowering costs', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(119, 30, 'C', 'Offering subsidies', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(120, 30, 'D', 'Increasing research', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(121, 31, 'A', 'The importance of time management', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(122, 31, 'B', 'Strategies for effective communication', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(123, 31, 'C', 'Developing leadership skills', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(124, 31, 'D', 'Enhancing creativity in the workplace', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(125, 32, 'A', 'It improves productivity.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(126, 32, 'B', 'It reduces efficiency.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(127, 32, 'C', 'It’s a necessary skill.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(128, 32, 'D', 'It’s beneficial for team projects.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(129, 33, 'A', 'By attending workshops', NULL, NULL, 0, NULL, 1, '2026-02-04 14:30:23'),
(130, 33, 'B', 'By practicing active listening', NULL, NULL, 1, NULL, 2, '2026-02-04 14:30:23'),
(131, 33, 'C', 'By using professional jargon', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(132, 33, 'D', 'By giving frequent feedback', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(133, 34, 'A', 'To stress their importance', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(134, 34, 'B', 'To suggest they’re flexible', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(135, 34, 'C', 'To highlight their disadvantages', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(136, 34, 'D', 'To recommend avoiding them', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(137, 35, 'A', 'Take regular breaks', NULL, NULL, 1, NULL, 1, '2026-02-04 14:30:23'),
(138, 35, 'B', 'Focus on one task at a time', NULL, NULL, 0, NULL, 2, '2026-02-04 14:30:23'),
(139, 35, 'C', 'Communicate with colleagues', NULL, NULL, 0, NULL, 3, '2026-02-04 14:30:23'),
(140, 35, 'D', 'Seek professional help', NULL, NULL, 0, NULL, 4, '2026-02-04 14:30:23'),
(141, 36, 'A', 'He enjoys the danger of his job.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(142, 36, 'B', 'His job is exciting but can be dangerous.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:35:16'),
(143, 36, 'C', 'He knows everything about his work environment.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(144, 36, 'D', 'His work involves studying marine species.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(145, 37, 'A', 'Repairing pipelines', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(146, 37, 'B', 'Encountering marine life', NULL, NULL, 0, NULL, 2, '2026-02-04 14:35:16'),
(147, 37, 'C', 'Incorrect decompression', NULL, NULL, 1, NULL, 3, '2026-02-04 14:35:16'),
(148, 37, 'D', 'Investigating shipwrecks', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(149, 38, 'A', 'separation', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(150, 38, 'B', 'loneliness', NULL, NULL, 1, NULL, 2, '2026-02-04 14:35:16'),
(151, 38, 'C', 'remoteness', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(152, 38, 'D', 'boredom', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(153, 39, 'A', 'The chance to study rare animals', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(154, 39, 'B', 'The beauty of the environment and meaningful work', NULL, NULL, 1, NULL, 2, '2026-02-04 14:35:16'),
(155, 39, 'C', 'The opportunity to work in complete darkness', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(156, 39, 'D', 'The satisfaction of living in a unique location', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(157, 40, 'A', 'The need for teamwork', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(158, 40, 'B', 'The difficulty of traveling to remote areas', NULL, NULL, 0, NULL, 2, '2026-02-04 14:35:16'),
(159, 40, 'C', 'The patience and resilience required', NULL, NULL, 1, NULL, 3, '2026-02-04 14:35:16'),
(160, 40, 'D', 'The importance of preserving wildlife', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(161, 41, 'A', 'height', NULL, NULL, 1, NULL, 1, '2026-02-04 14:35:16'),
(162, 41, 'B', 'temperature', NULL, NULL, 0, NULL, 2, '2026-02-04 14:35:16'),
(163, 41, 'C', 'location', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(164, 41, 'D', 'condition', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(165, 42, 'A', 'Liam', NULL, NULL, 1, NULL, 1, '2026-02-04 14:35:16'),
(166, 42, 'B', 'Emma', NULL, NULL, 0, NULL, 2, '2026-02-04 14:35:16'),
(167, 42, 'C', 'Raj', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(168, 42, 'D', 'Sofia', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(169, 43, 'A', 'Liam', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(170, 43, 'B', 'Emma', NULL, NULL, 1, NULL, 2, '2026-02-04 14:35:16'),
(171, 43, 'C', 'Raj', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(172, 43, 'D', 'Sofia', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(173, 44, 'A', 'causes deep sadness', NULL, NULL, 1, NULL, 1, '2026-02-04 14:35:16'),
(174, 44, 'B', 'is physically exhausting', NULL, NULL, 0, NULL, 2, '2026-02-04 14:35:16'),
(175, 44, 'C', 'gives a sense of purpose', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(176, 44, 'D', 'inspires hope', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(177, 45, 'A', 'To describe the daily routines of professionals in extreme jobs.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:35:16'),
(178, 45, 'B', 'To highlight the challenges and rewards of working in extreme environments.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:35:16'),
(179, 45, 'C', 'To compare the environment that people with different types of extreme jobs have to work in.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:35:16'),
(180, 45, 'D', 'To explain how people train for jobs in harsh conditions.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:35:16'),
(181, 46, 'A', 'produce', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(182, 46, 'B', 'accommodate', NULL, NULL, 1, NULL, 2, '2026-02-04 14:36:54'),
(183, 46, 'C', 'threaten', NULL, NULL, 0, NULL, 3, '2026-02-04 14:36:54'),
(184, 46, 'D', 'remove', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(185, 47, 'A', 'to describe the ecological importance and threats to coral reefs.', NULL, NULL, 1, NULL, 1, '2026-02-04 14:36:54'),
(186, 47, 'B', 'to explain how coral reefs protect human populations.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(187, 47, 'C', 'to outline the process of coral bleaching in detail.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:36:54'),
(188, 47, 'D', 'to emphasize the role of coral reefs in scientific research.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(189, 48, 'A', 'they are made entirely of algae.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(190, 48, 'B', 'they cover a vast portion of the ocean floor.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(191, 48, 'C', 'they support a disproportionate amount of marine biodiversity.', NULL, NULL, 1, NULL, 3, '2026-02-04 14:36:54'),
(192, 48, 'D', 'they can recover quickly from environmental damage.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(193, 49, 'A', 'obstacles', NULL, NULL, 1, NULL, 1, '2026-02-04 14:36:54'),
(194, 49, 'B', 'shelters', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(195, 49, 'C', 'divisions', NULL, NULL, 0, NULL, 3, '2026-02-04 14:36:54'),
(196, 49, 'D', 'filters', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(197, 50, 'A', 'humans\'', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(198, 50, 'B', 'corals\'', NULL, NULL, 1, NULL, 2, '2026-02-04 14:36:54'),
(199, 50, 'C', 'coastlines\'', NULL, NULL, 0, NULL, 3, '2026-02-04 14:36:54'),
(200, 50, 'D', 'organisms\'', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(201, 51, 'A', 'the process of coral skeleton formation', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(202, 51, 'B', 'the impact of algae on coral coloration', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(203, 51, 'C', 'the bleaching effect caused by stress factors', NULL, NULL, 1, NULL, 3, '2026-02-04 14:36:54'),
(204, 51, 'D', 'the natural color of healthy corals', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(205, 52, 'A', 'is a reversible process if addressed quickly', NULL, NULL, 1, NULL, 1, '2026-02-04 14:36:54'),
(206, 52, 'B', 'occurs naturally without human interference', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(207, 52, 'C', 'results in the immediate death of all corals', NULL, NULL, 0, NULL, 3, '2026-02-04 14:36:54'),
(208, 52, 'D', 'is unrelated to climate change', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(209, 53, 'A', 'the main reason that caused coral reef degradation', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(210, 53, 'B', 'the primary culprit of ocean acidification', NULL, NULL, 1, NULL, 2, '2026-02-04 14:36:54'),
(211, 53, 'C', 'the economic impact of coral reef tourism', NULL, NULL, 0, NULL, 3, '2026-02-04 14:36:54'),
(212, 53, 'D', 'the biodiversity of coral reef ecosystems', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(213, 54, 'A', 'zones where fishing is banned permanently', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(214, 54, 'B', 'regions designated for research on marine species', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(215, 54, 'C', 'areas where human activities are regulated to conserve marine life', NULL, NULL, 1, NULL, 3, '2026-02-04 14:36:54'),
(216, 54, 'D', 'locations that are inaccessible to tourists', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(217, 55, 'A', 'conservation efforts are futile in protecting coral reefs', NULL, NULL, 0, NULL, 1, '2026-02-04 14:36:54'),
(218, 55, 'B', 'humans are the primary reason for coral reef destruction', NULL, NULL, 0, NULL, 2, '2026-02-04 14:36:54'),
(219, 55, 'C', 'awareness and cooperation are essential to saving coral reefs', NULL, NULL, 1, NULL, 3, '2026-02-04 14:36:54'),
(220, 55, 'D', 'coral reefs are more resilient than most ecosystems', NULL, NULL, 0, NULL, 4, '2026-02-04 14:36:54'),
(221, 56, 'A', 'It is attracting attention from world leaders.', NULL, NULL, 1, NULL, 1, '2026-02-04 14:38:14'),
(222, 56, 'B', 'It is making world leaders angry.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(223, 56, 'C', 'It is preventing world leaders from making decisions.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(224, 56, 'D', 'It is leading to economic collapse worldwide.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(225, 57, 'A', 'A long-standing rivalry based on historical issues', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(226, 57, 'B', 'A disagreement over international diplomatic alliances', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(227, 57, 'C', 'Economic differences that affect global trade', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(228, 57, 'D', 'Disputes over valuable land and natural resources', NULL, NULL, 1, NULL, 4, '2026-02-04 14:38:14'),
(229, 58, 'A', 'To highlight the importance of the region’s natural resources', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(230, 58, 'B', 'To explain why the two countries are unwilling to compromise', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(231, 58, 'C', 'To show that the conflict has been going on for a very long time', NULL, NULL, 1, NULL, 3, '2026-02-04 14:38:14'),
(232, 58, 'D', 'To demonstrate the complexity of the conflict’s historical background', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(233, 59, 'A', 'Simple', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(234, 59, 'B', 'Unclear', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(235, 59, 'C', 'Challenging', NULL, NULL, 1, NULL, 3, '2026-02-04 14:38:14'),
(236, 59, 'D', 'Unlikely', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(237, 60, 'A', 'The interference of external powers with their own agendas', NULL, NULL, 1, NULL, 1, '2026-02-04 14:38:14'),
(238, 60, 'B', 'The desire of both countries to negotiate peace', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(239, 60, 'C', 'The willingness of both sides to compromise', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(240, 60, 'D', 'The inability of the international community to intervene', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(241, 61, 'A', 'A competition for political and economic influence between the two countries', NULL, NULL, 1, NULL, 1, '2026-02-04 14:38:14'),
(242, 61, 'B', 'The desire to protect valuable land from foreign investment', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(243, 61, 'C', 'The need for both countries to increase their military power', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(244, 61, 'D', 'The struggle to maintain global trade relations', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(245, 62, 'A', 'A', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(246, 62, 'B', 'B', NULL, NULL, 1, NULL, 2, '2026-02-04 14:38:14'),
(247, 62, 'C', 'C', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(248, 62, 'D', 'D', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(249, 63, 'A', 'They are unlikely to lead to a long-lasting resolution.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(250, 63, 'B', 'They represent a positive step toward peace, despite the challenges.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:38:14'),
(251, 63, 'C', 'They are not important to the future of the two countries.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(252, 63, 'D', 'They are being sabotaged by external forces.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:38:14'),
(253, 64, 'A', 'Hopeful', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(254, 64, 'B', 'Pessimistic', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(255, 64, 'C', 'Critical', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(256, 64, 'D', 'Neutral', NULL, NULL, 1, NULL, 4, '2026-02-04 14:38:14'),
(257, 65, 'A', 'The international community must take action to stop the conflict.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:38:14'),
(258, 65, 'B', 'Resolving the territorial dispute will require more than just military intervention.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:38:14'),
(259, 65, 'C', 'Peace is unlikely unless both countries agree to external mediation.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:38:14'),
(260, 65, 'D', 'The situation can only be solved through peaceful negotiations and compromises.', NULL, NULL, 1, NULL, 4, '2026-02-04 14:38:14'),
(261, 66, 'A', 'Communication', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(262, 66, 'B', 'Language', NULL, NULL, 1, NULL, 2, '2026-02-04 14:39:20'),
(263, 66, 'C', 'Origin', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(264, 66, 'D', 'Theory', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(265, 67, 'A', 'A sudden cognitive leap', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(266, 67, 'B', 'The need for increased social cooperation', NULL, NULL, 0, NULL, 2, '2026-02-04 14:39:20'),
(267, 67, 'C', 'A mutation in vocal cords', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(268, 67, 'D', 'All of the above', NULL, NULL, 1, NULL, 4, '2026-02-04 14:39:20'),
(269, 68, 'A', 'Quickly evolved', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(270, 68, 'B', 'Developed over time', NULL, NULL, 1, NULL, 2, '2026-02-04 14:39:20'),
(271, 68, 'C', 'Evolved in stages', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(272, 68, 'D', 'Became less complex', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(273, 69, 'A', 'It explain the start of vocalization in the emergence of language.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(274, 69, 'B', 'It suggests that language emerged suddenly due to a mutation.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:39:20'),
(275, 69, 'C', 'It is supported by evidence from modern sign languages.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(276, 69, 'D', 'It is the most widely accepted theory among linguists.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(277, 70, 'A', 'The complexity of modern human language', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(278, 70, 'B', 'The presence of cave paintings from early humans', NULL, NULL, 0, NULL, 2, '2026-02-04 14:39:20'),
(279, 70, 'C', 'The use of sign language by deaf communities', NULL, NULL, 1, NULL, 3, '2026-02-04 14:39:20'),
(280, 70, 'D', 'The discovery of ancient vocalization tools', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(281, 71, 'A', 'A random change in the genetic code that allowed for more complex communication.', NULL, NULL, 1, NULL, 1, '2026-02-04 14:39:20'),
(282, 71, 'B', 'A purposeful alteration in human DNA to facilitate language.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:39:20'),
(283, 71, 'C', 'A shift in human culture that led to the need for new sounds.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(284, 71, 'D', 'An adaptation to environmental changes that enhanced speech production.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(285, 72, 'A', 'Language evolved from gestures used in early human societies.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(286, 72, 'B', 'Humans needed to work together for survival, leading to the development of communication.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:39:20'),
(287, 72, 'C', 'Humans were able to make a wide variety of sounds, improving vocal communication.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(288, 72, 'D', 'The development of language was tied to the creation of written forms of communication.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(289, 73, 'A', 'Language arose due to a genetic mutation.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(290, 73, 'B', 'Language began as a means of social cooperation.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:39:20'),
(291, 73, 'C', 'Language was invented as a tool for written communication.', NULL, NULL, 1, NULL, 3, '2026-02-04 14:39:20'),
(292, 73, 'D', 'Language developed from gestural communication.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(293, 74, 'A', 'Language is a unique trait found in certain human societies.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(294, 74, 'B', 'There is no single, universally accepted theory about the origin of language.', NULL, NULL, 1, NULL, 2, '2026-02-04 14:39:20'),
(295, 74, 'C', 'Language evolved gradually over thousands of years without any sudden changes.', NULL, NULL, 0, NULL, 3, '2026-02-04 14:39:20'),
(296, 74, 'D', 'Language is mostly a product of written communication and culture.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(297, 75, 'A', 'A presentation of different theories followed by an analysis of their strengths and weaknesses.', NULL, NULL, 0, NULL, 1, '2026-02-04 14:39:20'),
(298, 75, 'B', 'A discussion of the role of language in society, followed by an exploration of its origins.', NULL, NULL, 0, NULL, 2, '2026-02-04 14:39:20'),
(299, 75, 'C', 'An explanation of the importance of language, followed by a list of competing theories.', NULL, NULL, 1, NULL, 3, '2026-02-04 14:39:20'),
(300, 75, 'D', 'A general overview of the history of language, followed by a discussion of its impact.', NULL, NULL, 0, NULL, 4, '2026-02-04 14:39:20'),
(301, 93, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(302, 93, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(303, 93, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(304, 93, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(305, 94, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(306, 94, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(307, 94, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(308, 94, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(309, 95, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(310, 95, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(311, 95, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(312, 95, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(313, 96, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(314, 96, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(315, 96, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(316, 96, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(317, 97, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(318, 97, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(319, 97, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(320, 97, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(321, 98, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(322, 98, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(323, 98, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(324, 98, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(325, 99, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(326, 99, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(327, 99, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(328, 99, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(329, 100, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:34'),
(330, 100, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(331, 100, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(332, 100, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:34'),
(333, 101, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(334, 101, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(335, 101, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(336, 101, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(337, 102, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(338, 102, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(339, 102, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(340, 102, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(341, 103, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(342, 103, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(343, 103, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(344, 103, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(345, 104, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(346, 104, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(347, 104, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(348, 104, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(349, 105, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(350, 105, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(351, 105, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(352, 105, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(353, 106, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(354, 106, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(355, 106, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(356, 106, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(357, 107, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(358, 107, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(359, 107, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(360, 107, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(361, 108, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(362, 108, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(363, 108, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(364, 108, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(365, 109, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(366, 109, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(367, 109, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(368, 109, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(369, 110, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(370, 110, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(371, 110, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(372, 110, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(373, 111, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(374, 111, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(375, 111, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(376, 111, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(377, 112, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(378, 112, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(379, 112, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(380, 112, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(381, 113, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(382, 113, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(383, 113, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(384, 113, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(385, 114, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(386, 114, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(387, 114, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(388, 114, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(389, 115, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(390, 115, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(391, 115, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(392, 115, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(393, 116, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(394, 116, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(395, 116, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(396, 116, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(397, 117, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(398, 117, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(399, 117, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(400, 117, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(401, 118, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(402, 118, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(403, 118, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(404, 118, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(405, 119, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(406, 119, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(407, 119, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(408, 119, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(409, 120, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(410, 120, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(411, 120, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(412, 120, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(413, 121, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(414, 121, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(415, 121, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(416, 121, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(417, 122, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(418, 122, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(419, 122, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(420, 122, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(421, 123, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(422, 123, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(423, 123, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(424, 123, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(425, 124, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(426, 124, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(427, 124, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(428, 124, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(429, 125, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(430, 125, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(431, 125, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(432, 125, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(433, 126, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(434, 126, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(435, 126, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(436, 126, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(437, 127, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(438, 127, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(439, 127, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(440, 127, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(441, 128, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(442, 128, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(443, 128, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(444, 128, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(445, 129, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(446, 129, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(447, 129, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(448, 129, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(449, 130, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(450, 130, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(451, 130, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(452, 130, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(453, 131, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(454, 131, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(455, 131, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(456, 131, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(457, 132, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(458, 132, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(459, 132, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(460, 132, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(461, 133, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(462, 133, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(463, 133, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(464, 133, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(465, 134, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(466, 134, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(467, 134, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(468, 134, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(469, 135, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(470, 135, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(471, 135, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(472, 135, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(473, 136, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(474, 136, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(475, 136, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(476, 136, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(477, 137, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(478, 137, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(479, 137, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(480, 137, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(481, 138, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(482, 138, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(483, 138, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(484, 138, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(485, 139, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(486, 139, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(487, 139, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(488, 139, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(489, 140, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(490, 140, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(491, 140, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(492, 140, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(493, 141, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(494, 141, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(495, 141, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(496, 141, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(497, 142, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(498, 142, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(499, 142, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(500, 142, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(501, 143, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(502, 143, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(503, 143, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(504, 143, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(505, 144, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(506, 144, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(507, 144, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(508, 144, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(509, 145, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(510, 145, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(511, 145, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(512, 145, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(513, 146, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(514, 146, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(515, 146, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(516, 146, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(517, 147, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(518, 147, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(519, 147, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(520, 147, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(521, 148, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(522, 148, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(523, 148, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(524, 148, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(525, 149, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(526, 149, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(527, 149, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(528, 149, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(529, 150, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(530, 150, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(531, 150, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(532, 150, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(533, 151, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(534, 151, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(535, 151, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(536, 151, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(537, 152, 'A', 'Option A (edit this)', NULL, NULL, 1, NULL, 0, '2026-02-25 13:25:35'),
(538, 152, 'B', 'Option B (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(539, 152, 'C', 'Option C (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35'),
(540, 152, 'D', 'Option D (edit this)', NULL, NULL, 0, NULL, 0, '2026-02-25 13:25:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `audit_logs`
--

CREATE TABLE `audit_logs` (
  `aId` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `aAction` varchar(255) DEFAULT NULL,
  `aIp_address` varchar(45) DEFAULT NULL,
  `aCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `caId` int(11) NOT NULL,
  `caName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`caId`, `caName`) VALUES
(1, 'TOEIC'),
(2, 'VSTEP'),
(3, 'IELTS');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `classes`
--

CREATE TABLE `classes` (
  `cId` int(11) NOT NULL,
  `cName` varchar(100) NOT NULL,
  `cTeacher_id` int(11) NOT NULL,
  `cDescription` text DEFAULT NULL,
  `cStatus` enum('active','inactive') DEFAULT 'active',
  `cCreated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `course` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `classes`
--

INSERT INTO `classes` (`cId`, `cName`, `cTeacher_id`, `cDescription`, `cStatus`, `cCreated_at`, `course`) VALUES
(1, 'Khóa học Tổng quát IC3', 5, 'Khóa học nền tảng', 'active', '2026-02-04 12:17:04', 1),
(2, 'Lớp Luyện Thi IC3 GS6 - Nhóm 1', 5, 'Lớp học mẫu cho sinh viên IT', 'active', '2026-02-04 12:17:04', 1),
(3, 'Lớp Luyện Thi IC3 GS6 - Nhóm 2', 5, 'Lớp học mẫu cho sinh viên IT', 'active', '2026-02-04 12:17:04', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `class_enrollments`
--

CREATE TABLE `class_enrollments` (
  `class_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `content_items`
--

CREATE TABLE `content_items` (
  `coId` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `content_type` enum('text','audio','image','video','mixed') NOT NULL,
  `coTitle` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL COMMENT 'Nội dung văn bản',
  `content_html` text DEFAULT NULL COMMENT 'Nội dung có format HTML',
  `coWord_count` int(11) DEFAULT NULL,
  `coMedia_url` varchar(500) DEFAULT NULL COMMENT 'URL file audio/video/image',
  `coMedia_type` varchar(50) DEFAULT NULL COMMENT 'audio/mpeg, image/jpeg, video/mp4...',
  `coMedia_duration` int(11) DEFAULT NULL COMMENT 'Độ dài (giây)',
  `coTranscript` text DEFAULT NULL COMMENT 'Bản ghi âm',
  `coPlay_limit` int(11) DEFAULT -1 COMMENT 'Số lần play (-1 = unlimited)',
  `coAuto_play` tinyint(1) DEFAULT 0,
  `coSource` varchar(255) DEFAULT NULL COMMENT 'Nguồn: BBC, CNN, Cambridge...',
  `coTopic` varchar(100) DEFAULT NULL,
  `coDifficulty_level` enum('easy','medium','hard') DEFAULT 'medium',
  `coOrder_number` int(11) DEFAULT 0,
  `coCreated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `coUpdated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `content_items`
--

INSERT INTO `content_items` (`coId`, `section_id`, `content_type`, `coTitle`, `content`, `content_html`, `coWord_count`, `coMedia_url`, `coMedia_type`, `coMedia_duration`, `coTranscript`, `coPlay_limit`, `coAuto_play`, `coSource`, `coTopic`, `coDifficulty_level`, `coOrder_number`, `coCreated_at`, `coUpdated_at`) VALUES
(1, 1, 'audio', 'Short announcements: Question 1-8', '', NULL, NULL, 'audio/question1-8_VSTEP_Sample_Test.mp3', 'audio', 99, '1. \"Attention, all library visitors. Please note that today the library will close earlier than usual due to maintenance work. We will be shutting our doors at 6:00 PM. Thank you for your understanding.\"\r\n2. \"Passengers traveling to Brighton, please proceed to Platform 6. The train will depart in 10 minutes. Once again, the train to Brighton is now boarding at Platform 6.\"\r\n3. \"Severe weather conditions are expected in the area later today. Please take precautions, avoid unnecessary travel, and stay updated with the latest weather reports.\"\r\n4. \"A reminder for students: project reports should be submitted to Room 303 by 5:00 PM today. Late submissions will not be accepted.\"\r\n5. \"The evening concert at Central Hall will start at 6:30 PM sharp. Doors open 30 minutes before the performance. Please arrive early to secure your seats.\"\r\n6. \"Join our monthly gym membership and enjoy access to all equipment, as well as complimentary personal training sessions. Sign up today to begin your fitness journey!\"\r\n7. \"Attention, all residents: maintenance work on the water system will last approximately 3 hours. We apologize for the inconvenience and appreciate your patience.\"\r\n8. \"Passengers boarding the bus, please ensure you validate your tickets before entering. Ticket machines are located near the entrance for your convenience.\"', 1, 0, NULL, NULL, 'medium', 0, '2026-02-03 04:31:20', '2026-02-16 13:08:09'),
(2, 2, 'audio', 'Conversation 1: Questions 9-12', '', NULL, NULL, 'audio/question9-12_VSTEP_Sample_Test.wav', 'audio', 28, 'Man: \"I’m not sure about the cost of rent for this place. It seems a bit high for me.\"\r\nWoman: \"I understand your concern, but the utilities are included in the rent. That saves you some money on bills.\"\r\nMan: \"That’s good to know. Still, I think I prefer a single room to avoid any potential conflicts with roommates. Privacy is also important to me.\"\r\nWoman: \"That makes sense. Finding accommodation that suits your needs is always a priority.\"', 1, 0, NULL, NULL, 'medium', 0, '2026-02-03 04:31:20', '2026-02-16 13:03:30'),
(3, 2, 'audio', 'Conversation 2: Questions 13-16', '', NULL, NULL, 'audio/question13-16_VSTEP_Sample_Test.wav', 'audio', 30, 'Woman: \"I’m here for a leisure trip and looking to explore the city. Do you have any recommendations?\"\r\nMan: \"Definitely! I’d suggest taking the city tour. It’s very informative and gives you a good overview of the main attractions.\"\r\nWoman: \"That sounds great. What about the museum? Is there anything I need to know before visiting?\"\r\nMan: \"Yes, make sure to bring your ticket with you. Also, it’s a good idea to check their schedule as they sometimes close for private events.\"', 1, 0, NULL, NULL, 'medium', 1, '2026-02-03 04:31:20', '2026-02-16 13:03:30'),
(4, 2, 'audio', 'Conversation 3: Questions 17-20', '', NULL, NULL, 'audio/question17-20_VSTEP_Sample_Test.wav', 'audio', 25, 'Woman: \"I’m having trouble with this assignment. The topic is confusing, and I don’t know where to start.\"\r\nMan: \"You should try using the library’s database. They have excellent resources that might help clarify things.\"\r\nWoman: \"That’s a good idea. I’m also feeling nervous about working in a group.\"\r\nMan: \"Don’t worry. Group work can be challenging, but it’s also a great opportunity to share ideas and learn from others.\"\r\n', 1, 0, NULL, NULL, 'medium', 2, '2026-02-03 04:31:20', '2026-02-16 13:03:30'),
(5, 3, 'audio', 'Talk 1: Questions 21-25', '', NULL, NULL, 'audio/question21-25_VSTEP_Sample_Test.wav', 'audio', 67, 'Welcome, everyone. Today, we will focus on maintaining a healthy lifestyle.\r\n\r\nA balanced diet, regular exercise, and managing stress are key to staying healthy. One of the most important aspects is healthy eating. Choosing natural, fresh foods over processed ones can make a significant difference. Avoid overconsumption of processed foods as they often contain unhealthy fats and added sugars, which can negatively affect your body. Processed food, while convenient, should be consumed in moderation. Whenever possible, opt for fresh fruits, vegetables, and whole grains to keep your energy levels up and ensure your body gets essential nutrients.\r\n\r\nExercise is another critical factor. Aim to work out at least three times a week. Activities like walking, swimming, or yoga can improve cardiovascular health, boost your mood, and keep your weight in check. Staying hydrated is equally essential. Drinking plenty of water helps prevent dehydration, keeps your organs functioning well, and even improves your skin\'s appearance.\r\n\r\nLastly, maintain a balanced diet. Combine exercise, hydration, and adequate rest to achieve optimal health.', 1, 0, NULL, NULL, 'medium', 0, '2026-02-03 04:31:20', '2026-02-16 13:03:30'),
(6, 3, 'audio', 'Talk 2: Questions 26-30', '', NULL, NULL, 'audio/question26-30_VSTEP_Sample_Test.wav', 'audio', 64, 'Good morning! Today, we will discuss renewable energy sources and their importance in combating climate change.\r\n\r\nRenewable energy is a sustainable way to reduce our dependence on fossil fuels. It includes solar, wind, and hydropower, among others. Each of these has unique benefits and challenges.\r\n\r\nSolar energy, for example, is abundant and widely available. However, it’s not reliable in all climates, especially regions with limited sunlight. Proper infrastructure is necessary to make the most of it. Wind energy is eco-friendly and cost-effective once established. However, its unpredictability and dependency on specific geographic conditions can limit its use.\r\n\r\nOne major challenge with renewable energy is its high initial installation costs. Governments and organizations must invest in research and development to make these technologies more affordable. To promote renewable energy, public education is key. People need to understand its benefits, and governments can provide subsidies to encourage its adoption. With collective efforts, we can transition to a greener future.', 1, 0, NULL, NULL, 'medium', 1, '2026-02-03 04:31:20', '2026-02-16 13:03:30'),
(7, 3, 'audio', 'Talk 3: Questions 31-35', '', NULL, NULL, 'audio/question31-35_VSTEP_Sample_Test.wav', 'audio', 63, 'Hello, everyone. Let’s talk about time management and its role in workplace success.\r\n\r\nEffective time management is essential for boosting productivity and reducing stress. Understanding how to allocate your time wisely can lead to better results both professionally and personally.\r\n\r\nMultitasking might seem efficient, but it often reduces overall efficiency. Focusing on one task at a time ensures higher quality results and minimizes mistakes.\r\n\r\nCommunication is another important skill. Practicing active listening helps you better understand your colleagues and build stronger professional relationships.\r\n\r\nDeadlines are critical for maintaining productivity. Sticking to them helps prioritize tasks and ensures projects are completed on time. Planning and adhering to a timeline keeps the entire team on track.\r\n\r\nManaging stress is equally vital. Taking regular breaks and maintaining open communication with your colleagues can ease work pressure. If stress persists, don’t hesitate to seek professional guidance.\r\n\r\nThank you, and I hope these tips will help you in your careers!', 1, 0, NULL, NULL, 'medium', 2, '2026-02-03 04:31:20', '2026-02-16 13:03:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `correct_answers`
--

CREATE TABLE `correct_answers` (
  `caId` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_text` varchar(500) NOT NULL COMMENT 'Đáp án chấp nhận được',
  `caIs_case_sensitive` tinyint(1) DEFAULT 0,
  `caIs_exact_match` tinyint(1) DEFAULT 1,
  `caMin_value` decimal(10,2) DEFAULT NULL,
  `caMax_value` decimal(10,2) DEFAULT NULL,
  `caSynonyms` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '["answer1", "answer2", "answer3"]' CHECK (json_valid(`caSynonyms`)),
  `caOrder_number` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `course`
--

CREATE TABLE `course` (
  `cId` int(11) NOT NULL,
  `cName` varchar(100) NOT NULL,
  `cCategory` int(11) DEFAULT NULL,
  `cNumberOfStudent` int(11) DEFAULT NULL,
  `cTime` varchar(50) DEFAULT NULL,
  `cSchedule` text DEFAULT NULL,
  `cStartDate` date DEFAULT NULL,
  `cEndDate` date DEFAULT NULL,
  `cStatus` enum('active','draft','ongoing','complete') NOT NULL,
  `cTeacher` int(11) DEFAULT NULL,
  `cDescription` text DEFAULT NULL,
  `cDeleteAt` datetime DEFAULT NULL,
  `cCreateAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `cUpdateAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `course`
--

INSERT INTO `course` (`cId`, `cName`, `cCategory`, `cNumberOfStudent`, `cTime`, `cSchedule`, `cStartDate`, `cEndDate`, `cStatus`, `cTeacher`, `cDescription`, `cDeleteAt`, `cCreateAt`, `cUpdateAt`) VALUES
(1, 'TOEIC 2 Kỹ năng', 1, 100, '18h00', '2,4,6', '2025-10-20', '2026-01-20', 'complete', 5, NULL, NULL, '2026-02-04 12:15:40', NULL),
(2, 'VSTEP B2', 2, 100, '18h00', '3,5,7', '2025-10-30', '2026-03-20', 'ongoing', 5, NULL, NULL, '2026-02-04 12:15:40', NULL),
(3, 'SPEAKING IELTS BASIC', 3, 10, '18h00', '2,4,6', '2026-01-31', '2026-01-20', 'draft', 5, NULL, NULL, '2026-02-04 12:15:40', NULL),
(4, 'TOEIC 650', 1, 30, '18h00', '2,4,6', '2026-03-05', '2026-05-28', 'active', 1, '', NULL, '2026-02-04 12:31:33', NULL),
(5, 'VSTEP B2', 2, 30, '18h30', '2,4,6', '2026-03-13', '2026-06-05', 'active', 1, '', NULL, '2026-02-04 12:32:24', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exams`
--

CREATE TABLE `exams` (
  `eId` int(11) NOT NULL,
  `exam_type_id` int(11) NOT NULL COMMENT 'Loại đề thi',
  `exam_code` varchar(50) NOT NULL,
  `eTitle` varchar(255) NOT NULL,
  `eDescription` text DEFAULT NULL,
  `eDifficulty_level` enum('beginner','elementary','intermediate','upper_intermediate','advanced','proficiency') DEFAULT 'intermediate',
  `eTarget_level` varchar(50) DEFAULT NULL COMMENT 'A1, A2, B1, B2, C1, C2 hoặc VSTEP 3-4, IELTS 6.0...',
  `eDuration` int(11) DEFAULT NULL COMMENT 'Tổng thời gian (phút)',
  `eTotal_score` decimal(5,2) DEFAULT 100.00,
  `ePass_score` decimal(5,2) DEFAULT NULL,
  `eStatus` enum('draft','published','archived') DEFAULT 'draft',
  `eVisibility` enum('public','private') DEFAULT 'private',
  `teacher_id` int(11) NOT NULL,
  `eTags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Tags: ["business", "academic", "general"]' CHECK (json_valid(`eTags`)),
  `eCreated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `eUpdated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ePublished_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `exams`
--

INSERT INTO `exams` (`eId`, `exam_type_id`, `exam_code`, `eTitle`, `eDescription`, `eDifficulty_level`, `eTarget_level`, `eDuration`, `eTotal_score`, `ePass_score`, `eStatus`, `eVisibility`, `teacher_id`, `eTags`, `eCreated_at`, `eUpdated_at`, `ePublished_at`) VALUES
(1, 1, 'VSTEP B1', 'VSTEP Sample Test', '', 'intermediate', 'B1', 172, 100.00, 45.00, 'draft', 'private', 1, NULL, '2026-02-03 03:29:16', '2026-02-15 14:36:35', NULL),
(2, 1, 'VSTEP-2026-444', 'VSTEP', '', 'intermediate', NULL, 90, 100.00, 60.00, 'draft', 'private', 1, NULL, '2026-02-25 13:25:34', '2026-02-25 13:25:34', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exam_sections`
--

CREATE TABLE `exam_sections` (
  `esId` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `esSkill_code` varchar(20) NOT NULL COMMENT 'reading, listening, writing, speaking',
  `section_number` int(11) NOT NULL COMMENT 'Part number: 1, 2, 3...',
  `section_code` varchar(50) DEFAULT NULL COMMENT 'TOEIC: LC-Part1, RC-Part5, IELTS: Reading-Passage1',
  `section_title` varchar(255) NOT NULL,
  `esInstructions` text DEFAULT NULL,
  `esDuration` int(11) DEFAULT NULL COMMENT 'Thời gian (phút)',
  `esTotal_questions` int(11) DEFAULT 0,
  `esMax_score` decimal(5,2) DEFAULT 0.00,
  `section_type` varchar(50) DEFAULT NULL COMMENT 'photographs, conversations, passages, essay, interview...',
  `esOrder_number` int(11) DEFAULT 0,
  `esCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `exam_sections`
--

INSERT INTO `exam_sections` (`esId`, `exam_id`, `esSkill_code`, `section_number`, `section_code`, `section_title`, `esInstructions`, `esDuration`, `esTotal_questions`, `esMax_score`, `section_type`, `esOrder_number`, `esCreated_at`) VALUES
(1, 1, 'listening', 1, 'Part 1', 'Questions 1-8', 'You will hear eight short announcements or instructions. There is one question for each announcement or instruction. For each question, choose the correct answer A, B, C, or D.', 0, 8, 8.00, 'announcements', 0, '2026-02-03 03:56:51'),
(2, 1, 'listening', 2, 'Part 2', 'Questions 9-20', 'You will hear three conversations. There are four questions for each conversation. For each question, choose the correct answer A, B, C, or D.', 0, 12, 12.00, 'conversations', 1, '2026-02-03 03:56:51'),
(3, 1, 'listening', 3, 'Part 3', 'Questions 21-35.', 'You will hear three talks or lectures. There are five questions for each talk or lecture. For each question, choose the correct answer A, B, C, or D.', 0, 15, 15.00, 'talks', 2, '2026-02-03 03:56:51'),
(4, 1, 'reading', 1, 'Passage 1', 'Questions 1-10', 'What’s it like to work in extreme environments?\r\nFour professionals share their experiences of working in some of the most challenging conditions on Earth.\r\n\r\nLiam – Deep-Sea Diver\r\nDiving into the unknown is both exhilarating and terrifying. The deep sea is a world of darkness and pressure where few humans have ventured. My role often involves maintaining underwater pipelines and investigating shipwrecks. The most dangerous part of my job is decompression, which, if done incorrectly, can be fatal. But what makes it worth it are the rare moments when I witness marine life that most people will never see in their lifetime.\r\n\r\nEmma – Antarctic Researcher\r\nSpending months in Antarctica is a test of both physical and mental endurance. The cold here is unimaginable, and the isolation can be tough. My work focuses on studying climate change through ice core samples, which reveal Earth’s history. The lack of sunlight during winter months is challenging, but the breathtaking beauty of the landscape and the chance to contribute to vital research keep me motivated.\r\n\r\nRaj – Wildlife Photographer\r\nCapturing images of animals in their natural habitats often requires weeks of patience and incredible resilience. I’ve spent days in extreme heat waiting for a single shot of a lion. One of my most unforgettable experiences was photographing snow leopards in the Himalayas. The altitude and harsh conditions pushed me to my limits, but the reward of capturing such rare beauty made it all worthwhile.\r\n\r\nSofia – Emergency Relief Worker\r\nResponding to natural disasters or conflicts around the world is both physically exhausting and emotionally draining. My team and I are often among the first to arrive, bringing supplies and medical aid. I’ve worked in flood zones, earthquake-hit regions, and war-torn areas. It’s heartbreaking to see people in such desperate situations, but being able to help even a little gives me a sense of purpose.', 0, 10, 10.00, 'passeges', 0, '2026-02-03 04:03:39'),
(5, 1, 'reading', 2, 'Passage 2', 'Questions 11-20', 'The Secrets of Coral Reefs\r\n\r\nCoral reefs are among the most biologically diverse ecosystems on Earth, often referred to as the \"rainforests of the sea.\" They host an incredible array of marine life, including fish, crustaceans, mollusks, and more. Despite their beauty and importance, these fragile ecosystems face numerous threats, many of which are caused by human activities.\r\n\r\nCorals are actually tiny animals called polyps that belong to the phylum Cnidaria. These polyps form colonies, building massive calcium carbonate structures over time. What many people find extraordinary is that coral reefs cover less than 1% of the ocean floor but support around 25% of all marine species.\r\n\r\nCoral reefs not only provide habitat for marine creatures but also offer vital benefits to humans. They protect coastlines from erosion by acting as natural barriers against storm surges and waves. Additionally, they contribute to the global economy through tourism and fishing. Coral reefs also hold great potential for medical advancements, as scientists study their organisms to develop treatments for diseases such as cancer and arthritis.\r\n\r\nHowever, coral reefs are under threat from phenomena like coral bleaching. This occurs when corals expel the symbiotic algae that live in their tissues, causing them to turn white. Algae provide corals with much of their energy through photosynthesis, so bleaching often results in coral death. Rising sea temperatures, pollution, and overfishing are some of the primary causes of this distressing phenomenon.\r\n\r\nAnother significant issue is ocean acidification, which occurs when excess carbon dioxide dissolves into seawater. This process lowers the pH of the water, making it harder for corals to build their calcium carbonate skeletons. Without urgent intervention, coral reefs could face extinction within decades.\r\n\r\nJust as forests on land require careful management to prevent deforestation, coral reefs need conservation efforts to survive. Governments, scientists, and local communities must work together to reduce carbon emissions, establish marine protected areas, and promote sustainable fishing practices, as well as establish marine protected areas. Public awareness campaigns can also encourage responsible tourism, ensuring that future generations will have the chance to marvel at the wonders of these underwater ecosystems.', 0, 10, 10.00, 'passages', 1, '2026-02-03 04:03:39'),
(6, 1, 'reading', 3, 'Passage 3', 'Questions 21-30', 'In the heart of Asia, a long-running political conflict between two neighboring countries has once again made international headlines. Tensions between Country X and Country Y have escalated in recent months, causing concern among global leaders and prompting calls for diplomatic intervention. Despite numerous peace talks and ceasefire agreements, the situation remains tense, with both nations accusing each other of violating international laws and undermining regional stability.\r\n\r\nThe roots of this conflict date back several decades to territorial disputes over land that both countries claim as their own. The area in question is rich in natural resources, including valuable minerals and water sources, making it a highly contested region. Over the years, several attempts have been made to mediate the dispute, but a lasting solution has yet to be found. In recent years, both sides have ramped up military activity in the region, heightening fears of a potential conflict that could have far-reaching consequences for neighboring countries and the international community.\r\n\r\nAs international organizations and peacekeeping forces prepare for possible interventions, many experts warn that the situation may be more complicated than it appears. The involvement of external powers, who have their own strategic interests in the region, could further fuel the conflict and make it even more difficult to resolve. Diplomatic talks, while crucial, may be insufficient if both sides are unwilling to compromise and prioritize peace over territorial ambitions.\r\n\r\nMoreover, some analysts argue that the ongoing tension is not only a result of territorial disputes but also stems from broader political and economic factors. Both countries are vying for influence in the region, with each side seeking to assert its dominance in a rapidly changing geopolitical landscape. In this context, the conflict becomes a symbol of the larger power struggle taking place, and the stakes are much higher than a simple territorial dispute.\r\n\r\nDespite the dire situation, there is hope that a diplomatic solution can still be reached. In recent weeks, both sides have agreed to engage in talks under the mediation of international peacekeepers, signaling a potential willingness to de-escalate the situation. However, the path to peace remains uncertain, and much will depend on the commitment of both nations to find common ground and work together for the greater good.', 0, 10, 10.00, 'passages', 2, '2026-02-03 04:03:39'),
(7, 1, 'reading', 4, 'Passage 4', 'Questions 31-40', 'The origins of human language have been the subject of intense study and debate for centuries. While there is no consensus among linguists and anthropologists regarding the exact timeline or processes involved in the emergence of language, several theories have emerged over the years. Some experts argue that language developed gradually as a way for early humans to communicate more effectively with each other, while others suggest that it arose suddenly due to a genetic mutation or a significant cognitive leap.\r\n\r\nOne of the most widely accepted theories is that language began as a form of gestural communication. Early humans may have used hand signals and body movements to express their thoughts and emotions before developing the ability to speak. Over time, these gestures would have become more complex, evolving into a fully developed system of vocal communication. Supporters of this theory argue that modern sign languages, which are used by deaf communities around the world, provide evidence of the link between gestures and language.\r\n\r\nAn alternative theory posits that language emerged suddenly due to a genetic mutation that allowed early humans to produce a wider range of sounds. According to this view, the development of the human brain, particularly the regions involved in speech production, enabled early humans to begin using vocalizations for communication. Some researchers believe that this mutation may have occurred as early as 100,000 years ago, during the time when Homo sapiens first emerged as a distinct species.\r\n\r\nOther theories suggest that language evolved as a byproduct of socialization and the need for cooperation in early human communities. According to these theories, language was not a purposeful invention but rather a natural outcome of humans’ increasing need to work together for survival. The development of language, in this view, was driven by the growing complexity of human social structures and the need for coordinated effort in tasks such as hunting, gathering, and building shelter.\r\n\r\nDespite the many theories about how language originated, it is clear that language has played a crucial role in shaping human societies. From the earliest cave paintings to the invention of writing, language has been central to human culture and communication. Today, linguistic diversity is one of the most defining characteristics of human society, with thousands of different languages spoken around the world.', 0, 10, 10.00, 'passages', 3, '2026-02-03 04:03:39'),
(8, 1, 'writing', 1, 'Task 1', 'Writing Task 1', 'Read the email below and write a reply as instructed. You should write at least 120 words.', 20, 1, 12.50, 'email', 0, '2026-02-03 07:52:05'),
(9, 1, 'writing', 2, 'Task 2', 'Writing Task 2', 'You should spend about 40 minutes on this task. Write an essay as instructed. You should write at least 250 words.', 40, 1, 12.50, NULL, 1, '2026-02-03 07:52:05'),
(10, 1, 'speaking', 1, 'Part 1', 'Speaking Part 1: Social Interaction', 'The examiner will ask you some general questions. Answer each question naturally.', 3, 8, 8.33, NULL, 0, '2026-02-03 07:52:05'),
(11, 1, 'speaking', 2, 'Part 2', 'Speaking Part 2: Solution Discussion', 'Read the situation carefully. Discuss the options and give your opinion with reasons.', 4, 1, 8.34, NULL, 1, '2026-02-03 07:52:05'),
(12, 1, 'speaking', 3, 'Part 3', 'Topic Development', 'Discuss the given topic. Develop your ideas with reasons and examples. Answer the follow-up questions.', 5, 3, 8.33, NULL, 2, '2026-02-03 07:52:05'),
(13, 2, 'Reading', 0, 'R1', 'Reading - Part 1', NULL, 15, 10, 10.00, NULL, 1, '2026-02-25 13:25:34'),
(14, 2, 'Reading', 0, 'R2', 'Reading - Part 2', NULL, 15, 10, 10.00, NULL, 2, '2026-02-25 13:25:35'),
(15, 2, 'Reading', 0, 'R3', 'Reading - Part 3', NULL, 15, 10, 10.00, NULL, 3, '2026-02-25 13:25:35'),
(16, 2, 'Listening', 0, 'L1', 'Listening - Part 1', NULL, 15, 10, 10.00, NULL, 4, '2026-02-25 13:25:35'),
(17, 2, 'Listening', 0, 'L2', 'Listening - Part 2', NULL, 15, 10, 10.00, NULL, 5, '2026-02-25 13:25:35'),
(18, 2, 'Listening', 0, 'L3', 'Listening - Part 3', NULL, 15, 10, 10.00, NULL, 6, '2026-02-25 13:25:35'),
(19, 2, 'Writing', 0, 'W1', 'Writing - Part 1', NULL, 15, 1, 1.00, NULL, 7, '2026-02-25 13:25:35'),
(20, 2, 'Writing', 0, 'W2', 'Writing - Part 2', NULL, 15, 1, 1.00, NULL, 8, '2026-02-25 13:25:35'),
(21, 2, 'Speaking', 0, 'S1', 'Speaking - Part 1', NULL, 15, 1, 1.00, NULL, 9, '2026-02-25 13:25:35'),
(22, 2, 'Speaking', 0, 'S2', 'Speaking - Part 2', NULL, 15, 1, 1.00, NULL, 10, '2026-02-25 13:25:35'),
(23, 2, 'Speaking', 0, 'S3', 'Speaking - Part 3', NULL, 15, 1, 1.00, NULL, 11, '2026-02-25 13:25:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exam_types`
--

CREATE TABLE `exam_types` (
  `etId` int(11) NOT NULL,
  `type_code` varchar(20) NOT NULL COMMENT 'VSTEP, TOEIC, IELTS, TOEFL...',
  `type_name` varchar(100) NOT NULL,
  `etDescription` text DEFAULT NULL,
  `etHas_reading` tinyint(1) DEFAULT 1,
  `etHas_listening` tinyint(1) DEFAULT 1,
  `etHas_writing` tinyint(1) DEFAULT 0,
  `etHas_speaking` tinyint(1) DEFAULT 0,
  `etScoring_system` enum('points','band','percentage','scaled') DEFAULT 'points',
  `etMax_score` decimal(5,2) DEFAULT 100.00,
  `etMin_pass_score` decimal(5,2) DEFAULT 60.00,
  `etOfficial_website` varchar(255) DEFAULT NULL,
  `etIs_active` tinyint(1) DEFAULT 1,
  `etCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `exam_types`
--

INSERT INTO `exam_types` (`etId`, `type_code`, `type_name`, `etDescription`, `etHas_reading`, `etHas_listening`, `etHas_writing`, `etHas_speaking`, `etScoring_system`, `etMax_score`, `etMin_pass_score`, `etOfficial_website`, `etIs_active`, `etCreated_at`) VALUES
(1, 'VSTEP', 'Vietnamese Standardized Test of English Proficiency', 'Bài thi chuẩn hóa năng lực tiếng Anh của Việt Nam, đánh giá 4 kỹ năng theo khung tham chiếu châu Âu CEFR (A1-C2). Phổ biến trong các trường đại học và tuyển dụng tại Việt Nam.', 1, 1, 1, 1, 'points', 100.00, 60.00, 'https://vstep.moe.gov.vn', 1, '2026-02-02 13:51:24'),
(2, 'TOEIC', 'Test of English for International Communication', 'Bài thi đánh giá khả năng sử dụng tiếng Anh trong môi trường làm việc quốc tế. Gồm 2 phần: Listening & Reading (990 điểm). Được công nhận rộng rãi bởi các doanh nghiệp toàn cầu.', 1, 1, 0, 0, 'scaled', 990.00, 450.00, 'https://www.ets.org/toeic', 1, '2026-02-02 13:51:24'),
(3, 'TOEIC_SW', 'TOEIC Speaking and Writing', 'Bài thi bổ sung cho TOEIC, đánh giá kỹ năng Speaking (200 điểm) và Writing (200 điểm). Thường được yêu cầu bởi các công ty đa quốc gia.', 0, 0, 1, 1, 'scaled', 400.00, 240.00, 'https://www.ets.org/toeic/speaking-writing', 1, '2026-02-02 13:51:24'),
(4, 'IELTS', 'International English Language Testing System', 'Bài thi tiếng Anh quốc tế được công nhận rộng rãi cho mục đích du học, định cư và làm việc tại các nước nói tiếng Anh. Thang điểm band 0-9, đánh giá 4 kỹ năng. Có 2 phiên bản: Academic và General Training.', 1, 1, 1, 1, 'band', 9.00, 5.50, 'https://www.ielts.org', 1, '2026-02-02 13:51:24'),
(5, 'TOEFL', 'Test of English as a Foreign Language (iBT)', 'Bài thi tiếng Anh cho mục đích học tập tại các trường đại học Mỹ và các nước nói tiếng Anh. Đánh giá 4 kỹ năng với tổng điểm 120. Được thực hiện hoàn toàn trên máy tính.', 1, 1, 1, 1, 'scaled', 120.00, 60.00, 'https://www.ets.org/toefl', 1, '2026-02-02 13:51:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `listening_logs`
--

CREATE TABLE `listening_logs` (
  `lId` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `listened_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `nId` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nContent` text NOT NULL,
  `nIs_read` tinyint(1) DEFAULT 0,
  `nCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otp_logs`
--

CREATE TABLE `otp_logs` (
  `oId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `oCode` varchar(6) NOT NULL,
  `oExpired_at` datetime NOT NULL,
  `oVerified` tinyint(1) DEFAULT 0,
  `oCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `pId` int(11) NOT NULL,
  `pTitle` varchar(255) NOT NULL,
  `pContent` longtext NOT NULL,
  `pAuthor_id` int(11) NOT NULL,
  `pType` enum('video','article') NOT NULL,
  `pCategory` enum('tip','grammar','vocabulary') NOT NULL,
  `pThumbnail` varchar(255) DEFAULT NULL,
  `pCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `qId` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `content_item_id` int(11) DEFAULT NULL COMMENT 'Thuộc content nào (passage/audio)',
  `question_number` int(11) NOT NULL,
  `question_code` varchar(50) DEFAULT NULL COMMENT 'Q1, Q101, Part1-Q5...',
  `question_type` enum('multiple_choice','multiple_select','true_false_not_given','yes_no_not_given','matching','fill_blank','sentence_completion','summary_completion','diagram_labeling','short_answer','essay','letter','speaking_response','describe_image','conversation','integrated_task') NOT NULL,
  `question_text` text NOT NULL,
  `question_image` varchar(500) DEFAULT NULL,
  `question_audio` varchar(500) DEFAULT NULL,
  `question_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Dữ liệu thêm: word bank, matching pairs, diagrams...' CHECK (json_valid(`question_data`)),
  `qAnswer_format` varchar(50) DEFAULT NULL COMMENT 'word, number, letter, one_word_and_or_a_number...',
  `qMin_words` int(11) DEFAULT NULL COMMENT 'Số từ tối thiểu (cho essay)',
  `qMax_words` int(11) DEFAULT NULL COMMENT 'Số từ tối đa',
  `qPoints` decimal(5,2) DEFAULT 1.00,
  `qPreparation_time` int(11) DEFAULT 0 COMMENT 'Thời gian chuẩn bị (giây)',
  `qResponse_time` int(11) DEFAULT 0 COMMENT 'Thời gian trả lời (giây)',
  `qSkill_focus` varchar(100) DEFAULT NULL COMMENT 'grammar, vocabulary, inference, main_idea...',
  `qDifficulty_level` enum('easy','medium','hard') DEFAULT 'medium',
  `qExplanation` text DEFAULT NULL COMMENT 'Giải thích đáp án',
  `qOrder_number` int(11) DEFAULT 0,
  `qCreated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `qUpdated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `questions`
--

INSERT INTO `questions` (`qId`, `section_id`, `content_item_id`, `question_number`, `question_code`, `question_type`, `question_text`, `question_image`, `question_audio`, `question_data`, `qAnswer_format`, `qMin_words`, `qMax_words`, `qPoints`, `qPreparation_time`, `qResponse_time`, `qSkill_focus`, `qDifficulty_level`, `qExplanation`, `qOrder_number`, `qCreated_at`, `qUpdated_at`) VALUES
(1, 1, 1, 1, NULL, 'multiple_choice', 'What time will the library close today?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 04:42:16', '2026-02-16 13:03:30'),
(2, 1, 1, 2, NULL, 'multiple_choice', 'Which platform does the train to Brighton depart from?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(3, 1, 1, 3, NULL, 'multiple_choice', 'What is the main purpose of the announcement?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(4, 1, 1, 4, NULL, 'multiple_choice', 'Where should students submit their project reports?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(5, 1, 1, 5, NULL, 'multiple_choice', 'What time does the concert start?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(6, 1, 1, 6, NULL, 'multiple_choice', 'What is included in the monthly gym membership?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(7, 1, 1, 7, NULL, 'multiple_choice', 'How long will the maintenance work last?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(8, 1, 1, 8, NULL, 'multiple_choice', 'What should passengers do before boarding the bus?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(9, 2, 2, 9, NULL, 'multiple_choice', 'What is the man’s main concern about the accommodation?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(10, 2, 2, 10, NULL, 'multiple_choice', 'What does the woman suggest about the utilities?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(11, 2, 2, 11, NULL, 'multiple_choice', 'Why does the man prefer a single room?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(12, 2, 2, 12, NULL, 'multiple_choice', 'What is the topic of the conversation?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(13, 2, 3, 13, NULL, 'multiple_choice', 'What is the purpose of the woman’s trip?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(14, 2, 3, 14, NULL, 'multiple_choice', ' Why does the man recommend the city tour?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(15, 2, 3, 15, NULL, 'multiple_choice', 'What should visitors bring to the museum?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(16, 2, 3, 16, NULL, 'multiple_choice', 'What is the man’s role in the conversation?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(17, 2, 4, 17, NULL, 'multiple_choice', 'Why does the woman need help with her assignment?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(18, 2, 4, 18, NULL, 'multiple_choice', 'What does the man suggest using for research?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(19, 2, 4, 19, NULL, 'multiple_choice', 'How does the woman feel about group work?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(20, 2, 4, 20, NULL, 'multiple_choice', 'What is the conversation mainly about?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 11, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(21, 3, 5, 21, NULL, 'multiple_choice', 'What is the talk mainly about?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(22, 3, 5, 22, NULL, 'multiple_choice', 'What does the speaker say about processed food?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(23, 3, 5, 23, NULL, 'multiple_choice', 'How often does the speaker recommend exercising?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(24, 3, 5, 24, NULL, 'multiple_choice', 'Why is water important for health?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(25, 3, 5, 25, NULL, 'multiple_choice', 'What is the speaker’s final advice?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(26, 3, 6, 26, NULL, 'multiple_choice', 'What is the lecture mainly about?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(27, 3, 6, 27, NULL, 'multiple_choice', 'What does the speaker emphasize about solar energy?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(28, 3, 6, 28, NULL, 'multiple_choice', 'How does the speaker describe wind energy?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(29, 3, 6, 29, NULL, 'multiple_choice', 'What is the biggest challenge for using renewable energy?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(30, 3, 6, 30, NULL, 'multiple_choice', 'What does the speaker suggest is the most important aspect for promoting renewable energy?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(31, 3, 7, 31, NULL, 'multiple_choice', 'What is the topic of the lecture?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(32, 3, 7, 32, NULL, 'multiple_choice', 'What does the speaker say about multitasking?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 11, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(33, 3, 7, 33, NULL, 'multiple_choice', 'How can employees improve their communication skills?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 12, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(34, 3, 7, 34, NULL, 'multiple_choice', 'Why does the speaker mention deadlines?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 13, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(35, 3, 7, 35, NULL, 'multiple_choice', 'What is the speaker’s advice for managing workplace stress?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 14, '2026-02-03 04:53:40', '2026-02-16 13:03:30'),
(36, 4, NULL, 1, NULL, 'multiple_choice', 'In the first paragraph, what does Liam mean by saying “Diving into the unknown is both exhilarating and terrifying”?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(37, 4, NULL, 2, NULL, 'multiple_choice', 'What is the most dangerous aspect of Liam’s job?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(38, 4, NULL, 3, NULL, 'multiple_choice', 'The word “isolation” in line 9 could best be replaced by', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(39, 4, NULL, 4, NULL, 'multiple_choice', 'What motivates Emma to continue working in Antarctica despite the challenges?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(40, 4, NULL, 5, NULL, 'multiple_choice', 'What does Raj emphasize about his work?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(41, 4, NULL, 6, NULL, 'multiple_choice', 'The word “altitude” in line 18 is closest in meaning to', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(42, 4, NULL, 7, NULL, 'multiple_choice', 'According to the passage, who frequently deals with life-threatening conditions?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(43, 4, NULL, 8, NULL, 'multiple_choice', 'According to the passage, who works in a highly isolated environment?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(44, 4, NULL, 9, NULL, 'multiple_choice', 'The word “heartbreaking” in line 23 refers to something that', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(45, 4, NULL, 10, NULL, 'multiple_choice', 'What is the main purpose of this passage?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(46, 5, NULL, 11, NULL, 'multiple_choice', 'The word \"host\" in the first paragraph is closest in meaning to _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(47, 5, NULL, 12, NULL, 'multiple_choice', 'The author’s main point is _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(48, 5, NULL, 13, NULL, 'multiple_choice', 'The author implies that coral reefs are unique in that _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(49, 5, NULL, 14, NULL, 'multiple_choice', 'The word \"barriers\" in the third paragraph is closest in meaning to _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(50, 5, NULL, 15, NULL, 'multiple_choice', 'The word \"their\" in the third paragraph refers to _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(51, 5, NULL, 16, NULL, 'multiple_choice', 'The phrase \"turn white\" in the fourth paragraph refers to _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(52, 5, NULL, 17, NULL, 'multiple_choice', 'The author suggests that coral bleaching _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(53, 5, NULL, 18, NULL, 'multiple_choice', 'The author mentions carbon dioxide to illustrate _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(54, 5, NULL, 19, NULL, 'multiple_choice', 'The term \"marine protected areas\" in the last paragraph refers to _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(55, 5, NULL, 20, NULL, 'multiple_choice', 'The author concludes that _________.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(56, 6, NULL, 21, NULL, 'multiple_choice', 'In paragraph 1, what does the phrase \"causing concern among global leaders\" mean?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(57, 6, NULL, 22, NULL, 'multiple_choice', 'What is the main reason for the political conflict between Country X and Country Y?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(58, 6, NULL, 23, NULL, 'multiple_choice', 'What is the author’s purpose in mentioning the \"territorial disputes over land\" in paragraph 2?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(59, 6, NULL, 24, NULL, 'multiple_choice', 'What can the word \"complicated\" in line 16 be best replaced by?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(60, 6, NULL, 25, NULL, 'multiple_choice', 'According to paragraph 3, what makes the conflict more difficult to resolve?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(61, 6, NULL, 26, NULL, 'multiple_choice', 'Which of the following best describes the \"broader political and economic factors\" mentioned in paragraph 4?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(62, 6, NULL, 27, NULL, 'multiple_choice', 'In which space (marked A, B, C, and D in the passage) will the following sentence fit? The military build-up in the region has made neighboring countries increasingly nervous.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(63, 6, NULL, 28, NULL, 'multiple_choice', 'According to paragraph 5, what does the author imply about the ongoing peace talks?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(64, 6, NULL, 29, NULL, 'multiple_choice', 'Which of the following best describes the tone of the author in this passage?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(65, 6, NULL, 30, NULL, 'multiple_choice', 'Which of the following could best describe the message that the author wants to convey to readers?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(66, 7, NULL, 31, NULL, 'multiple_choice', 'The word ‘it’ in paragraph 1 refers to:', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(67, 7, NULL, 32, NULL, 'multiple_choice', 'According to the passage, which of the following is a possible cause for the emergence of language?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(68, 7, NULL, 33, NULL, 'multiple_choice', 'The phrase ‘gradually developed’ in line 5 is closest in meaning to:', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(69, 7, NULL, 34, NULL, 'multiple_choice', 'According to the passage, which of the following is NOT true about the gestural communication theory?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(70, 7, NULL, 35, NULL, 'multiple_choice', 'According to the passage, what is one piece of evidence for the gestural communication theory?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(71, 7, NULL, 36, NULL, 'multiple_choice', 'What is meant by \"a genetic mutation\" in the context of the second theory?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(72, 7, NULL, 37, NULL, 'multiple_choice', 'Which of the following statements would support the theory that language developed as a social tool?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(73, 7, NULL, 38, NULL, 'multiple_choice', 'Which of the following is NOT mentioned as a theory for the origin of language?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(74, 7, NULL, 39, NULL, 'multiple_choice', 'Which conclusion can be drawn from the passage?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(75, 7, NULL, 40, NULL, 'multiple_choice', 'Which of the following best describes the organization of this passage?', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-03 07:31:18', '2026-02-16 13:03:30'),
(76, 8, NULL, 1, NULL, 'essay', 'Write a reply to Alex\'s email.', NULL, NULL, NULL, NULL, NULL, NULL, 12.50, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 08:09:45', '2026-02-16 13:03:30'),
(77, 9, NULL, 2, NULL, 'essay', 'Write an essay discussing the effects of urbanization on cities and their inhabitants.', NULL, NULL, NULL, NULL, NULL, NULL, 12.50, 0, 0, NULL, 'medium', NULL, 0, '2026-02-03 08:09:45', '2026-02-16 13:03:30'),
(80, 10, NULL, 1, NULL, 'speaking_response', 'What time do you usually wake up in the morning?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 30, NULL, 'medium', NULL, 0, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(81, 10, NULL, 2, NULL, 'speaking_response', 'How do you get to work or school?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 30, NULL, 'medium', NULL, 1, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(82, 10, NULL, 3, NULL, 'speaking_response', 'Do you prefer to follow a routine or be spontaneous during the day?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 45, NULL, 'medium', NULL, 2, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(83, 10, NULL, 4, NULL, 'speaking_response', 'What part of your daily routine do you enjoy the most?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 45, NULL, 'medium', NULL, 3, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(84, 10, NULL, 5, NULL, 'speaking_response', 'What kind of food do you like to eat?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 30, NULL, 'medium', NULL, 4, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(85, 10, NULL, 6, NULL, 'speaking_response', 'Do you prefer home-cooked meals or eating out?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 30, NULL, 'medium', NULL, 5, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(86, 10, NULL, 7, NULL, 'speaking_response', 'Is there any food you don\'t like?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 30, NULL, 'medium', NULL, 6, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(87, 10, NULL, 8, NULL, 'speaking_response', 'Do you think it\'s important to eat healthy food? Why or why not?', NULL, NULL, NULL, NULL, NULL, NULL, 1.04, 0, 60, NULL, 'medium', NULL, 7, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(88, 11, NULL, 9, NULL, 'speaking_response', 'A group of colleagues is planning to organize a team-building event. They are considering three types of activities: a cooking competition, a sports day, and a quiz game. Which activity do you think would be the most enjoyable and beneficial for the team? Why?', NULL, NULL, NULL, NULL, NULL, NULL, 8.34, 30, 240, NULL, 'medium', NULL, 0, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(90, 12, NULL, 11, NULL, 'speaking_response', 'How important do you think sports are for teenagers\' development?', NULL, NULL, NULL, NULL, NULL, NULL, 2.08, 0, 60, NULL, 'medium', NULL, 0, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(91, 12, NULL, 12, NULL, 'speaking_response', 'Do you think schools should offer more physical education classes? Why or why not?', NULL, NULL, NULL, NULL, NULL, NULL, 2.08, 0, 60, NULL, 'medium', NULL, 1, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(92, 12, NULL, 13, NULL, 'speaking_response', 'What role do parents play in encouraging teenagers to stay physically active?', NULL, NULL, NULL, NULL, NULL, NULL, 2.08, 0, 60, NULL, 'medium', NULL, 2, '2026-02-03 08:13:32', '2026-02-16 13:03:30'),
(93, 13, NULL, 1, NULL, 'multiple_choice', 'Question 1: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(94, 13, NULL, 2, NULL, 'multiple_choice', 'Question 2: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(95, 13, NULL, 3, NULL, 'multiple_choice', 'Question 3: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(96, 13, NULL, 4, NULL, 'multiple_choice', 'Question 4: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(97, 13, NULL, 5, NULL, 'multiple_choice', 'Question 5: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(98, 13, NULL, 6, NULL, 'multiple_choice', 'Question 6: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(99, 13, NULL, 7, NULL, 'multiple_choice', 'Question 7: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(100, 13, NULL, 8, NULL, 'multiple_choice', 'Question 8: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(101, 13, NULL, 9, NULL, 'multiple_choice', 'Question 9: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-25 13:25:34', '2026-02-25 13:25:34'),
(102, 13, NULL, 10, NULL, 'multiple_choice', 'Question 10: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(103, 14, NULL, 1, NULL, 'multiple_choice', 'Question 1: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(104, 14, NULL, 2, NULL, 'multiple_choice', 'Question 2: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(105, 14, NULL, 3, NULL, 'multiple_choice', 'Question 3: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(106, 14, NULL, 4, NULL, 'multiple_choice', 'Question 4: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(107, 14, NULL, 5, NULL, 'multiple_choice', 'Question 5: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(108, 14, NULL, 6, NULL, 'multiple_choice', 'Question 6: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(109, 14, NULL, 7, NULL, 'multiple_choice', 'Question 7: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(110, 14, NULL, 8, NULL, 'multiple_choice', 'Question 8: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(111, 14, NULL, 9, NULL, 'multiple_choice', 'Question 9: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(112, 14, NULL, 10, NULL, 'multiple_choice', 'Question 10: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(113, 15, NULL, 1, NULL, 'multiple_choice', 'Question 1: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(114, 15, NULL, 2, NULL, 'multiple_choice', 'Question 2: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(115, 15, NULL, 3, NULL, 'multiple_choice', 'Question 3: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(116, 15, NULL, 4, NULL, 'multiple_choice', 'Question 4: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(117, 15, NULL, 5, NULL, 'multiple_choice', 'Question 5: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(118, 15, NULL, 6, NULL, 'multiple_choice', 'Question 6: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(119, 15, NULL, 7, NULL, 'multiple_choice', 'Question 7: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(120, 15, NULL, 8, NULL, 'multiple_choice', 'Question 8: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(121, 15, NULL, 9, NULL, 'multiple_choice', 'Question 9: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(122, 15, NULL, 10, NULL, 'multiple_choice', 'Question 10: Read the passage and choose the best answer.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(123, 16, NULL, 1, NULL, 'multiple_choice', 'Question 1: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(124, 16, NULL, 2, NULL, 'multiple_choice', 'Question 2: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(125, 16, NULL, 3, NULL, 'multiple_choice', 'Question 3: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(126, 16, NULL, 4, NULL, 'multiple_choice', 'Question 4: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(127, 16, NULL, 5, NULL, 'multiple_choice', 'Question 5: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(128, 16, NULL, 6, NULL, 'multiple_choice', 'Question 6: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(129, 16, NULL, 7, NULL, 'multiple_choice', 'Question 7: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(130, 16, NULL, 8, NULL, 'multiple_choice', 'Question 8: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(131, 16, NULL, 9, NULL, 'multiple_choice', 'Question 9: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(132, 16, NULL, 10, NULL, 'multiple_choice', 'Question 10: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(133, 17, NULL, 1, NULL, 'multiple_choice', 'Question 1: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(134, 17, NULL, 2, NULL, 'multiple_choice', 'Question 2: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(135, 17, NULL, 3, NULL, 'multiple_choice', 'Question 3: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(136, 17, NULL, 4, NULL, 'multiple_choice', 'Question 4: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(137, 17, NULL, 5, NULL, 'multiple_choice', 'Question 5: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(138, 17, NULL, 6, NULL, 'multiple_choice', 'Question 6: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(139, 17, NULL, 7, NULL, 'multiple_choice', 'Question 7: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(140, 17, NULL, 8, NULL, 'multiple_choice', 'Question 8: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(141, 17, NULL, 9, NULL, 'multiple_choice', 'Question 9: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(142, 17, NULL, 10, NULL, 'multiple_choice', 'Question 10: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(143, 18, NULL, 1, NULL, 'multiple_choice', 'Question 1: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(144, 18, NULL, 2, NULL, 'multiple_choice', 'Question 2: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 2, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(145, 18, NULL, 3, NULL, 'multiple_choice', 'Question 3: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 3, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(146, 18, NULL, 4, NULL, 'multiple_choice', 'Question 4: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 4, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(147, 18, NULL, 5, NULL, 'multiple_choice', 'Question 5: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 5, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(148, 18, NULL, 6, NULL, 'multiple_choice', 'Question 6: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 6, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(149, 18, NULL, 7, NULL, 'multiple_choice', 'Question 7: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 7, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(150, 18, NULL, 8, NULL, 'multiple_choice', 'Question 8: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 8, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(151, 18, NULL, 9, NULL, 'multiple_choice', 'Question 9: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 9, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(152, 18, NULL, 10, NULL, 'multiple_choice', 'Question 10: Listen to the audio and choose the correct option.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 10, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(153, 19, NULL, 1, NULL, 'essay', 'Question 1: Write an essay (150-200 words) about the given topic.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(154, 20, NULL, 1, NULL, 'essay', 'Question 1: Write an essay (150-200 words) about the given topic.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(155, 21, NULL, 1, NULL, '', 'Question 1: Speak about the given topic for 1-2 minutes.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(156, 22, NULL, 1, NULL, '', 'Question 1: Speak about the given topic for 1-2 minutes.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35'),
(157, 23, NULL, 1, NULL, '', 'Question 1: Speak about the given topic for 1-2 minutes.', NULL, NULL, NULL, NULL, NULL, NULL, 1.00, 0, 0, NULL, 'medium', NULL, 1, '2026-02-25 13:25:35', '2026-02-25 13:25:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedules`
--

CREATE TABLE `schedules` (
  `scId` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `scTitle` varchar(200) NOT NULL,
  `scDescription` text DEFAULT NULL,
  `scStart_time` datetime NOT NULL,
  `scEnd_time` datetime NOT NULL,
  `scRelated_type` enum('class','exam','personal') DEFAULT 'personal',
  `scRelated_id` int(11) DEFAULT NULL,
  `scCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `skill_config`
--

CREATE TABLE `skill_config` (
  `skId` int(11) NOT NULL,
  `exam_type_id` int(11) NOT NULL,
  `skill_code` varchar(20) NOT NULL COMMENT 'reading, listening, writing, speaking',
  `skill_name` varchar(100) NOT NULL,
  `skInstructions` text DEFAULT NULL,
  `skill_weight` decimal(5,2) DEFAULT 25.00 COMMENT 'Trọng số % trong tổng điểm',
  `skDefault_duration` int(11) DEFAULT NULL COMMENT 'Thời gian mặc định (phút)',
  `skMax_score` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `skill_config`
--

INSERT INTO `skill_config` (`skId`, `exam_type_id`, `skill_code`, `skill_name`, `skInstructions`, `skill_weight`, `skDefault_duration`, `skMax_score`) VALUES
(1, 1, 'reading', 'Reading Comprehension', 'In this section of the test, you will read FOUR different passages, each followed by 10 questions about it. For questions 1-40, you are to choose the best answer A, B, C or D, to each question. Then, on your answer sheet, find the number of the question and fill in the space that corresponds to the letter of the answer you have chosen. Answer all questions following a passage on the basis of what is stated or implied in that passage.\r\n\r\nYou have 60 minutes to answer all the questions, including the time to transfer your answers to the answer sheet.', 25.00, 60, 25.00),
(2, 1, 'listening', 'Listening Comprehension', 'In this section of the test, you will have an opportunity to demonstrate your ability to understand conversations and talks in English. There are three parts in this section with special directions for each part. Answer all the questions on the basis of what is stated or implied by the speakers in the recording.  There will be time for you to read the instructions and you will have a chance to check your work. The recording will be played ONCE only.\n\nTime allowance: about 40 minutes, including 5 minutes to transfer your answers to your answer sheet.\n\nNumber of questions: 35.', 25.00, 40, 25.00),
(3, 1, 'writing', 'Writing', 'Time: 60 minutes.\nNumber of questions: 2.', 25.00, 60, 25.00),
(4, 1, 'speaking', 'Speaking', 'Time: 12 minutes.\nNumber of questions: 3.', 25.00, 12, 25.00),
(5, 2, 'listening', 'Listening Comprehension', NULL, 50.00, 45, 495.00),
(6, 2, 'reading', 'Reading Comprehension', NULL, 50.00, 75, 495.00),
(7, 3, 'speaking', 'Speaking', NULL, 50.00, 20, 200.00),
(8, 3, 'writing', 'Writing', NULL, 50.00, 60, 200.00),
(9, 4, 'listening', 'Listening', NULL, 25.00, 40, 9.00),
(10, 4, 'reading', 'Reading', NULL, 25.00, 60, 9.00),
(11, 4, 'writing', 'Writing', NULL, 25.00, 60, 9.00),
(12, 4, 'speaking', 'Speaking', NULL, 25.00, 14, 9.00),
(13, 5, 'reading', 'Reading', NULL, 25.00, 54, 30.00),
(14, 5, 'listening', 'Listening', NULL, 25.00, 41, 30.00),
(15, 5, 'speaking', 'Speaking', NULL, 25.00, 17, 30.00),
(16, 5, 'writing', 'Writing', NULL, 25.00, 50, 30.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `speaking_records`
--

CREATE TABLE `speaking_records` (
  `spId` int(11) NOT NULL,
  `submission_answer_id` int(11) NOT NULL,
  `audio_path` varchar(255) NOT NULL,
  `teacher_comment` text DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `submissions`
--

CREATE TABLE `submissions` (
  `sId` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `sAttempt` int(11) DEFAULT 1,
  `sStart_time` datetime DEFAULT NULL,
  `sPause_time` datetime DEFAULT NULL,
  `sResume_time` datetime DEFAULT NULL,
  `sSubmit_time` datetime DEFAULT NULL,
  `sGraded_time` datetime DEFAULT NULL,
  `sScore` decimal(5,2) DEFAULT NULL,
  `result` enum('pass','fail','pending') DEFAULT 'pending',
  `band_score` decimal(3,1) DEFAULT NULL COMMENT 'For IELTS band score',
  `scaled_score` int(11) DEFAULT NULL COMMENT 'For TOEIC/TOEFL',
  `certificate_code` varchar(100) DEFAULT NULL,
  `sStatus` enum('in_progress','submitted','graded') DEFAULT 'in_progress'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `submission_answers`
--

CREATE TABLE `submission_answers` (
  `saId` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `saAnswer_text` text DEFAULT NULL,
  `saIs_correct` tinyint(1) DEFAULT NULL,
  `saPoints_awarded` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `task_prompts`
--

CREATE TABLE `task_prompts` (
  `tpId` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `task_type` varchar(50) NOT NULL COMMENT 'essay, letter, email, describe_graph, opinion, interview...',
  `task_category` varchar(50) DEFAULT NULL COMMENT 'academic, general, business...',
  `tpPrompt_text` text NOT NULL,
  `tpSituation` text DEFAULT NULL COMMENT 'Tình huống (cho letter/email)',
  `tpRequirements` text DEFAULT NULL COMMENT 'Yêu cầu cụ thể',
  `tpPrompt_image` varchar(500) DEFAULT NULL,
  `tpPrompt_chart` varchar(500) DEFAULT NULL,
  `tpCue_card` text DEFAULT NULL,
  `tpMin_words` int(11) DEFAULT NULL,
  `tpMax_words` int(11) DEFAULT NULL,
  `tpSuggested_time` int(11) DEFAULT NULL COMMENT 'Thời gian đề xuất (phút)',
  `tpSample_answer` text DEFAULT NULL,
  `tpSample_audio` varchar(500) DEFAULT NULL,
  `tpRubric` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Tiêu chí chấm điểm' CHECK (json_valid(`tpRubric`)),
  `tpCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `task_prompts`
--

INSERT INTO `task_prompts` (`tpId`, `question_id`, `task_type`, `task_category`, `tpPrompt_text`, `tpSituation`, `tpRequirements`, `tpPrompt_image`, `tpPrompt_chart`, `tpCue_card`, `tpMin_words`, `tpMax_words`, `tpSuggested_time`, `tpSample_answer`, `tpSample_audio`, `tpRubric`, `tpCreated_at`) VALUES
(1, 76, 'task1_email', NULL, 'I can\'t stop thinking about the amazing time we had in Cat Ba! The camping trip was such a great experience, and I loved exploring the island with you. Did you have any trouble getting back to Hanoi?\n\nI\'m thinking of planning another outdoor adventure this summer. What do you think? Do you have any ideas for a new place we could explore?\n\nLooking forward to hearing from you!\n... Alex', 'You live in Hanoi. Recently, you went on a camping trip to Cat Ba Island with your British friend named Alex. After returning to London, Alex sent you an email (see above). Write a reply.', '1. Tell Alex that you enjoyed the trip and explain why.\n2. Describe a challenge you faced during the camping trip.\n3. Suggest a location and time for your next adventure together.', NULL, NULL, '', 120, 0, 20, NULL, NULL, '{\"task_fulfillment\": {\"weight\": 25, \"description\": \"Hoàn thành 3 yêu cầu đề bài\"}, \"organization\": {\"weight\": 25, \"description\": \"Cấu trúc email rõ ràng, mạch lạc\"}, \"vocabulary\": {\"weight\": 25, \"description\": \"Sử dụng từ vựng đa dạng và phù hợp\"}, \"grammar\": {\"weight\": 25, \"description\": \"Ngữ pháp chính xác\"}}', '2026-02-03 08:13:32'),
(2, 77, 'task2_essay', NULL, 'Read the following text from an article about urbanization:\n\n\"Urbanization is increasing rapidly worldwide, with more people moving to cities than ever before. Some argue that this trend brings economic growth and development, while others believe it leads to overcrowded cities and environmental problems.\"\n\nWrite an essay to an educated reader discussing the effects of urbanization on cities and their inhabitants. Include reasons and relevant examples to support your answer.', '', 'Discuss the effects of urbanization on cities and their inhabitants.\nInclude reasons and relevant examples to support your answer.\nWrite for an educated reader.', NULL, NULL, '', 250, 0, 40, NULL, NULL, '{\"task_fulfillment\": {\"weight\": 25, \"description\": \"Thảo luận toàn diện về ảnh hưởng của đô thị hóa, có lý do và ví dụ\"}, \"organization\": {\"weight\": 25, \"description\": \"Cấu trúc bài luận rõ ràng: intro, body, conclusion\"}, \"vocabulary\": {\"weight\": 25, \"description\": \"Từ vựng đa dạng, phù hợp chủ đề\"}, \"grammar\": {\"weight\": 25, \"description\": \"Ngữ pháp chính xác, đa dạng cấu trúc câu\"}}', '2026-02-03 08:13:32'),
(3, 80, 'part1_1_speak', NULL, '', '', 'Let’s talk about your daily routine.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(4, 81, 'part1_1_speak', NULL, '', '', 'Let’s talk about your daily routine.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(5, 82, 'part1_1_speak', NULL, '', '', 'Let’s talk about your daily routine.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(6, 83, 'part1_1_speak', NULL, '', '', 'Let’s talk about your daily routine.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(7, 84, 'part1_2_speak', NULL, '', '', 'Let’s talk about food.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(8, 85, 'part1_2_speak', NULL, '', '', 'Let’s talk about food.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(9, 86, 'part1_2_speak', NULL, '', '', 'Let’s talk about food.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(10, 87, 'part1_2_speak', NULL, '', '', 'Let’s talk about food.', NULL, NULL, '', 0, NULL, 3, NULL, NULL, '{\r\n  \"fluency\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Trả lời tự nhiên, ít ngập ngừng, có thể duy trì cuộc hội thoại ngắn.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng từ vựng quen thuộc, phù hợp với chủ đề cá nhân và đời sống hằng ngày.\"\r\n  },\r\n  \"grammar\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Sử dụng đúng các cấu trúc ngữ pháp cơ bản và câu đơn, câu phức đơn giản.\"\r\n  },\r\n  \"pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Phát âm rõ ràng, dễ hiểu, có ngữ điệu tự nhiên.\"\r\n  }\r\n}\r\n', '2026-02-07 14:50:07'),
(13, 90, 'part3_1_topic_development', NULL, 'Topic: The importance of physical exercise for teenagers.', '', '', NULL, NULL, 'improves health\r\nbuilds discipline\r\nenhances social skills\r\n[your own ideas]\r\n ', 0, NULL, 5, NULL, NULL, '{\r\n  \"idea_development\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Phát triển ý tưởng rõ ràng, có giải thích, ví dụ hoặc lập luận.\"\r\n  },\r\n  \"fluency_coherence\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Nói mạch lạc, ý tưởng liên kết hợp lý và dễ theo dõi.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Từ vựng đa dạng, phù hợp với chủ đề học thuật hoặc xã hội.\"\r\n  },\r\n  \"grammar_pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Ngữ pháp chính xác, cấu trúc câu đa dạng, phát âm rõ ràng và dễ hiểu.\"\r\n  }\r\n}\r\n\r\n\r\n', '2026-02-07 14:58:56'),
(14, 91, 'part3_2_topic_development', NULL, 'Topic: The importance of physical exercise for teenagers.', '', '', NULL, NULL, 'improves health\r\nbuilds discipline\r\nenhances social skills\r\n[your own ideas]', 0, NULL, 5, NULL, NULL, '{\r\n  \"idea_development\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Phát triển ý tưởng rõ ràng, có giải thích, ví dụ hoặc lập luận.\"\r\n  },\r\n  \"fluency_coherence\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Nói mạch lạc, ý tưởng liên kết hợp lý và dễ theo dõi.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Từ vựng đa dạng, phù hợp với chủ đề học thuật hoặc xã hội.\"\r\n  },\r\n  \"grammar_pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Ngữ pháp chính xác, cấu trúc câu đa dạng, phát âm rõ ràng và dễ hiểu.\"\r\n  }\r\n}\r\n\r\n\r\n', '2026-02-07 14:58:56'),
(15, 92, 'part3_3_topic_development', NULL, 'Topic: The importance of physical exercise for teenagers.', '', '', NULL, NULL, 'improves health\r\nbuilds discipline\r\nenhances social skills\r\n[your own ideas]\r\n', 0, NULL, 5, NULL, NULL, '{\r\n  \"idea_development\": {\r\n    \"weight\": 30,\r\n    \"description\": \"Phát triển ý tưởng rõ ràng, có giải thích, ví dụ hoặc lập luận.\"\r\n  },\r\n  \"fluency_coherence\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Nói mạch lạc, ý tưởng liên kết hợp lý và dễ theo dõi.\"\r\n  },\r\n  \"vocabulary\": {\r\n    \"weight\": 25,\r\n    \"description\": \"Từ vựng đa dạng, phù hợp với chủ đề học thuật hoặc xã hội.\"\r\n  },\r\n  \"grammar_pronunciation\": {\r\n    \"weight\": 20,\r\n    \"description\": \"Ngữ pháp chính xác, cấu trúc câu đa dạng, phát âm rõ ràng và dễ hiểu.\"\r\n  }\r\n}\r\n\r\n\r\n', '2026-02-07 14:58:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `test_assignments`
--

CREATE TABLE `test_assignments` (
  `taId` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `taTarget_type` enum('class','student') NOT NULL,
  `taTarget_id` int(11) NOT NULL,
  `taDeadline` datetime DEFAULT NULL,
  `taMax_attempt` int(11) DEFAULT 1,
  `taIs_public` tinyint(1) DEFAULT 0,
  `taCreated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `uId` int(11) NOT NULL,
  `uPhone` varchar(20) NOT NULL,
  `uPassword` varchar(255) NOT NULL,
  `uName` varchar(150) DEFAULT NULL,
  `uGender` tinyint(1) NOT NULL,
  `uAddress` text NOT NULL,
  `uRole` enum('student','teacher','admin') DEFAULT 'student',
  `uDoB` date DEFAULT NULL,
  `uStatus` enum('active','inactive') DEFAULT 'active',
  `uCreated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `uDeleted_at` datetime DEFAULT NULL,
  `uClass` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`uId`, `uPhone`, `uPassword`, `uName`, `uGender`, `uAddress`, `uRole`, `uDoB`, `uStatus`, `uCreated_at`, `uDeleted_at`, `uClass`) VALUES
(1, '0336695863', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Nguyen Van A', 0, '', 'teacher', '2003-02-15', 'active', '2026-02-03 03:28:12', NULL, 0),
(2, '0912345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Lê Thị B', 0, '123 Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ', 'student', '2003-02-15', 'active', '2026-02-04 12:11:51', NULL, 1),
(3, '0922345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Trần Văn C', 1, '456 Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ', 'student', '2003-05-20', 'active', '2026-02-04 12:11:51', NULL, 3),
(4, '0932345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Phạm Thị D', 0, '789 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ', 'student', '2003-08-10', 'active', '2026-02-04 12:11:51', NULL, 3),
(5, '0942345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Hoàng Văn E', 1, '101 Tầm Vu, Hưng Lợi, Ninh Kiều, Cần Thơ', 'student', '2003-11-25', 'active', '2026-02-04 12:11:51', NULL, 3),
(6, '0952345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Nguyễn Thị F', 0, '202 Trần Hưng Đạo, An Phú, Ninh Kiều, Cần Thơ', 'student', '2004-01-05', 'active', '2026-02-04 12:11:51', NULL, 3),
(7, '0962345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Đặng Văn G', 1, '303 Mậu Thân, An Hòa, Ninh Kiều, Cần Thơ', 'student', '2003-03-12', 'active', '2026-02-04 12:11:51', NULL, 3),
(8, '0972345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Bùi Thị H', 0, '404 Lê Hồng Phong, Trà An, Bình Thủy, Cần Thơ', 'student', '2003-06-18', 'active', '2026-02-04 12:11:51', NULL, 3),
(9, '0982345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Vũ Văn I', 1, '505 Đồng Ngọc Hoàng, Cái Răng, Cần Thơ', 'student', '2003-09-30', 'active', '2026-02-04 12:11:51', NULL, 3),
(10, '0992345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Đỗ Thị K', 0, '606 Võ Văn Kiệt, Bình Thủy, Cần Thơ', 'student', '2003-12-22', 'active', '2026-02-04 12:11:51', NULL, 3),
(11, '0812345678', '$2y$12$haGN8/bWZ/fY9H4sSuNT0Ouz/WD9SoPrIVlg6UPMVTy7NaNn6PKIO', 'Trịnh Văn L', 1, '707 Nguyễn Văn Linh, An Khánh, Ninh Kiều, Cần Thơ', 'student', '2003-04-14', 'active', '2026-02-04 12:11:51', NULL, 3);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`aId`),
  ADD KEY `question_id` (`question_id`);

--
-- Chỉ mục cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`aId`),
  ADD KEY `fk_audit_user` (`user_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`caId`);

--
-- Chỉ mục cho bảng `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`cId`),
  ADD KEY `fk_class_teacher` (`cTeacher_id`);

--
-- Chỉ mục cho bảng `class_enrollments`
--
ALTER TABLE `class_enrollments`
  ADD PRIMARY KEY (`class_id`,`student_id`),
  ADD KEY `fk_enroll_student` (`student_id`);

--
-- Chỉ mục cho bảng `content_items`
--
ALTER TABLE `content_items`
  ADD PRIMARY KEY (`coId`),
  ADD KEY `section_id` (`section_id`);

--
-- Chỉ mục cho bảng `correct_answers`
--
ALTER TABLE `correct_answers`
  ADD PRIMARY KEY (`caId`),
  ADD KEY `question_id` (`question_id`);

--
-- Chỉ mục cho bảng `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`cId`),
  ADD KEY `fk_category_course` (`cCategory`),
  ADD KEY `fk_teacher_course` (`cTeacher`);

--
-- Chỉ mục cho bảng `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`eId`),
  ADD UNIQUE KEY `exam_code` (`exam_code`),
  ADD KEY `exam_type_id` (`exam_type_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Chỉ mục cho bảng `exam_sections`
--
ALTER TABLE `exam_sections`
  ADD PRIMARY KEY (`esId`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Chỉ mục cho bảng `exam_types`
--
ALTER TABLE `exam_types`
  ADD PRIMARY KEY (`etId`),
  ADD UNIQUE KEY `type_code` (`type_code`);

--
-- Chỉ mục cho bảng `listening_logs`
--
ALTER TABLE `listening_logs`
  ADD PRIMARY KEY (`lId`),
  ADD UNIQUE KEY `uq_listen` (`submission_id`,`question_id`),
  ADD KEY `fk_listen_question` (`question_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`nId`),
  ADD KEY `fk_notify_user` (`user_id`);

--
-- Chỉ mục cho bảng `otp_logs`
--
ALTER TABLE `otp_logs`
  ADD PRIMARY KEY (`oId`),
  ADD KEY `fk_otp_user` (`userId`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`pId`),
  ADD KEY `fk_post_author` (`pAuthor_id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`qId`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `content_item_id` (`content_item_id`);

--
-- Chỉ mục cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`scId`),
  ADD KEY `fk_schedule_user` (`user_id`);

--
-- Chỉ mục cho bảng `skill_config`
--
ALTER TABLE `skill_config`
  ADD PRIMARY KEY (`skId`),
  ADD UNIQUE KEY `unique_type_skill` (`exam_type_id`,`skill_code`);

--
-- Chỉ mục cho bảng `speaking_records`
--
ALTER TABLE `speaking_records`
  ADD PRIMARY KEY (`spId`),
  ADD KEY `fk_speaking_answer` (`submission_answer_id`);

--
-- Chỉ mục cho bảng `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`sId`),
  ADD KEY `fk_submission_user` (`user_id`),
  ADD KEY `fk_submission_exam` (`exam_id`),
  ADD KEY `fk_submission_assignment` (`assignment_id`);

--
-- Chỉ mục cho bảng `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD PRIMARY KEY (`saId`),
  ADD KEY `fk_sa_submission` (`submission_id`),
  ADD KEY `fk_sa_question` (`question_id`);

--
-- Chỉ mục cho bảng `task_prompts`
--
ALTER TABLE `task_prompts`
  ADD PRIMARY KEY (`tpId`),
  ADD KEY `question_id` (`question_id`);

--
-- Chỉ mục cho bảng `test_assignments`
--
ALTER TABLE `test_assignments`
  ADD PRIMARY KEY (`taId`),
  ADD KEY `fk_assignment_exam` (`exam_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uId`),
  ADD UNIQUE KEY `uPhone` (`uPhone`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `answers`
--
ALTER TABLE `answers`
  MODIFY `aId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=541;

--
-- AUTO_INCREMENT cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `aId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `caId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `classes`
--
ALTER TABLE `classes`
  MODIFY `cId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `content_items`
--
ALTER TABLE `content_items`
  MODIFY `coId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `correct_answers`
--
ALTER TABLE `correct_answers`
  MODIFY `caId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `course`
--
ALTER TABLE `course`
  MODIFY `cId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `eId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `exam_sections`
--
ALTER TABLE `exam_sections`
  MODIFY `esId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `exam_types`
--
ALTER TABLE `exam_types`
  MODIFY `etId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `listening_logs`
--
ALTER TABLE `listening_logs`
  MODIFY `lId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `nId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `otp_logs`
--
ALTER TABLE `otp_logs`
  MODIFY `oId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `pId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `qId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=158;

--
-- AUTO_INCREMENT cho bảng `schedules`
--
ALTER TABLE `schedules`
  MODIFY `scId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `skill_config`
--
ALTER TABLE `skill_config`
  MODIFY `skId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `speaking_records`
--
ALTER TABLE `speaking_records`
  MODIFY `spId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `submissions`
--
ALTER TABLE `submissions`
  MODIFY `sId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `submission_answers`
--
ALTER TABLE `submission_answers`
  MODIFY `saId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `task_prompts`
--
ALTER TABLE `task_prompts`
  MODIFY `tpId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `test_assignments`
--
ALTER TABLE `test_assignments`
  MODIFY `taId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `uId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `fk_class_teacher` FOREIGN KEY (`cTeacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `class_enrollments`
--
ALTER TABLE `class_enrollments`
  ADD CONSTRAINT `fk_enroll_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`cId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enroll_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `content_items`
--
ALTER TABLE `content_items`
  ADD CONSTRAINT `content_items_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `exam_sections` (`esId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `correct_answers`
--
ALTER TABLE `correct_answers`
  ADD CONSTRAINT `correct_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `fk_category_course` FOREIGN KEY (`cCategory`) REFERENCES `category` (`caId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_teacher_course` FOREIGN KEY (`cTeacher`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types` (`etId`),
  ADD CONSTRAINT `exams_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `exam_sections`
--
ALTER TABLE `exam_sections`
  ADD CONSTRAINT `exam_sections_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `listening_logs`
--
ALTER TABLE `listening_logs`
  ADD CONSTRAINT `fk_listen_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_listen_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`sId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notify_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `otp_logs`
--
ALTER TABLE `otp_logs`
  ADD CONSTRAINT `fk_otp_user` FOREIGN KEY (`userId`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_post_author` FOREIGN KEY (`pAuthor_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `exam_sections` (`esId`) ON DELETE CASCADE,
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`content_item_id`) REFERENCES `content_items` (`coId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `fk_schedule_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `skill_config`
--
ALTER TABLE `skill_config`
  ADD CONSTRAINT `skill_config_ibfk_1` FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types` (`etId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `speaking_records`
--
ALTER TABLE `speaking_records`
  ADD CONSTRAINT `fk_speaking_answer` FOREIGN KEY (`submission_answer_id`) REFERENCES `submission_answers` (`saId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `fk_submission_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `test_assignments` (`taId`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_submission_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_submission_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD CONSTRAINT `fk_sa_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sa_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`sId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `task_prompts`
--
ALTER TABLE `task_prompts`
  ADD CONSTRAINT `task_prompts_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`qId`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `test_assignments`
--
ALTER TABLE `test_assignments`
  ADD CONSTRAINT `fk_assignment_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`eId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
