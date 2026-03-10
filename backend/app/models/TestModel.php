<?php

namespace App\Models;

use App\Core\Database;

use PDO;

class TestModel
{
    public static function getTestsByTeacherId(int $teacher_id)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT t.*, et.type_code
        FROM exams t
        JOIN exam_types et
            ON t.exam_type_id = et.etId
        WHERE t.teacher_id = ?
        ORDER BY t.eCreated_at DESC
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacher_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'           => (int) $row['eId'],
                'title'        => $row['eTitle'],
                'examTypeId'   => (int) $row['exam_type_id'],
                'examType'     => $row['type_code'] ?? 'General',
                'targetLevel'  => $row['eTarget_level'] ?? 'All',
                'duration'     => (int) $row['eDuration'],
                'totalScore'   => (int) $row['eTotal_score'],
                'passScore'    => (int) $row['ePass_score'],
                'visibility'   => ucfirst($row['eVisibility']),
                'status'       => ucfirst($row['eStatus'])
            ];
        }, $rows);
    }

    public static function getTestById(int $teacher_id, int $examId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
            SELECT t.*, et.type_code
            FROM exams t
            JOIN exam_types et
                ON t.exam_type_id = et.etId
            WHERE t.teacher_id = ? AND t.eId = ?
            ORDER BY t.eCreated_at DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacher_id, $examId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) return null;

        return [
            'id'           =>  $row['eId'],
            'title'        => $row['eTitle'],
            'examTypeId'   => (int) $row['exam_type_id'],
            'examType'     => $row['type_code'] ?? 'General',
            'targetLevel'  => $row['eTarget_level'] ?? 'All',
            'duration'     =>  $row['eDuration'],
            'totalScore'   =>  $row['eTotal_score'],
            'passScore'    => $row['ePass_score'],
            'visibility'   => ucfirst($row['eVisibility']),
            'status'       => ucfirst($row['eStatus'])
        ];
    }

    public static function getSkillConfigsByExamType(int $examTypeId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT 
            skId,
            skill_code,
            skInstructions as instructions,
            skDefault_duration as duration
        FROM skill_config
        WHERE exam_type_id = ?
        ORDER BY 
            CASE skill_code
                WHEN 'reading' THEN 1
                WHEN 'listening' THEN 2
                WHEN 'writing' THEN 3
                WHEN 'speaking' THEN 4
                ELSE 5
            END
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$examTypeId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'           => (int) $row['skId'],
                'skill_code'   => $row['skill_code'],
                'instructions' => $row['instructions'] ?? '',
                'duration'     => (int) $row['duration']
            ];
        }, $rows);
    }

    public static function getTestSections(int $teacher_id, int $examId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT es.*, e.eTitle as exam_title
        FROM exam_sections es
        JOIN exams e ON es.exam_id = e.eId
        WHERE e.teacher_id = ? AND es.exam_id = ?
        ORDER BY es.esOrder_number
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacher_id, $examId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'              => (int) $row['esId'],
                'sectionNumber'   => (int) $row['section_number'],
                'sectionCode'     => $row['section_code'],
                'sectionTitle'    => $row['section_title'],
                'skill'           => $row['esSkill_code'],  // ← SKILL CODE
                'instructions'    => $row['esInstructions'],
                'duration'        => (int) $row['esDuration'],
                'totalQuestions'  => (int) $row['esTotal_questions'],
                'maxScore'        => (float) $row['esMax_score'],
                'orderNumber'     => (int) $row['esOrder_number']
            ];
        }, $rows);
    }


    public static function getTestQuestions(int $teacher_id, int $examId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
            SELECT q.*, es.section_title, es.esSkill_code
            FROM questions q
            JOIN exam_sections es ON q.section_id = es.esId
            JOIN exams e ON es.exam_id = e.eId
            WHERE e.teacher_id = ? AND e.eId = ? 
            ORDER BY q.qOrder_number
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacher_id, $examId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'            => (int) $row['qId'],
                'sectionId'     => (int) $row['section_id'],
                'sectionTitle'  => $row['section_title'],
                'skill'         => $row['esSkill_code'],
                'questionNumber' => (int) $row['question_number'],
                'questionText'  => $row['question_text'],
                'questionType'  => $row['question_type'],
                'points'        => (float) $row['qPoints'],
                'orderNumber'   => (int) $row['qOrder_number']
            ];
        }, $rows);
    }

    public static function getAnswersByQuestion(int $teacher_id, int $examId, int $questionId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
            SELECT a.*, q.question_text
            FROM answers a
            JOIN questions q ON a.question_id = q.qId
            JOIN exam_sections es ON q.section_id = es.esId
            JOIN exams e ON es.exam_id = e.eId
            WHERE e.teacher_id = ? AND e.eId = ? AND q.qId = ?
            ORDER BY a.aOrder_number
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$teacher_id, $examId, $questionId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'          => (int) $row['aId'],
                'questionId'  => (int) $row['question_id'],
                'questionText' => $row['question_text'],
                'answerKey'   => $row['option_key'],
                'answerText'  => $row['option_text'],
                'isCorrect'   => (bool) $row['aIs_correct'],
                'orderNumber' => (int) $row['aOrder_number']
            ];
        }, $rows);
    }

    public static function getContentItemsBySection(int $sectionId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT * FROM content_items
        WHERE section_id = ?
        ORDER BY coOrder_number
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$sectionId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'            => (int) $row['coId'],
                'contentType'   => $row['content_type'], // 'audio', 'text', 'image'
                'title'         => $row['coTitle'] ?? '',
                'content'       => $row['content'] ?? '',
                'audioUrl'      => $row['coMedia_url'] ?? null,
                'audioDuration' => $row['coMedia_duration'] ? (int) $row['coMedia_duration'] : null,
                'transcript'    => $row['coTranscript'] ?? null,
                'orderNumber'   => (int) $row['coOrder_number']
            ];
        }, $rows);
    }

    /**
     * Helper: Lấy task prompt theo question (direct query, không cần teacher_id/exam_id)
     */
    public static function getTaskPromptByQuestionDirect(int $questionId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT * FROM task_prompts
        WHERE question_id = ?
        LIMIT 1
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$questionId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return [
            'id'              => (int) $row['tpId'],
            'taskType'        => $row['task_type'] ?? null,
            'promptText'      => $row['tpPrompt_text'] ?? '',
            'situation'       => $row['tpSituation'] ?? '',
            'requirements'    => $row['tpRequirements'] ?? '',
            'cueCard'         => $row['tpCue_card'] ?? '',
            'minWords'        => $row['tpMin_words']?? '0' ,
            'maxWords'        => $row['tpMax_words'] ?? '0',
            'suggestedTime'   => $row['tpSuggested_time'] ? (int) $row['tpSuggested_time'] : null,
            'rubric'          => $row['tpRubric'] ? json_decode($row['tpRubric'], true) : null
        ];
    }

    /**
     * Update getQuestionsBySection để return thêm questionType
     */
    public static function getQuestionsBySection(int $sectionId)
    {
        $db = Database::getInstance()->getConnection();

        $sql = "
        SELECT * FROM questions
        WHERE section_id = ?
        ORDER BY qOrder_number
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$sectionId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'id'            => (int) $row['qId'],
                'sectionId'     => (int) $row['section_id'],
                'questionNumber' => (int) $row['question_number'],
                'questionText'  => $row['question_text'],
                'questionType'  => $row['question_type'], // IMPORTANT: cần field này
                'points'        => (float) $row['qPoints'],
                'orderNumber'   => (int) $row['qOrder_number']
            ];
        }, $rows);
    }
    /**
 * Get full test detail với exam title và skill instructions
 * Updated version để include examTitle và skillInstructions
 */
public static function getFullTestDetail(int $teacher_id, int $examId)
{
    $db = Database::getInstance()->getConnection();

    // 1. Lấy exam info với title
    $sql = "
        SELECT e.*, et.type_code
        FROM exams e
        JOIN exam_types et ON e.exam_type_id = et.etId
        WHERE e.eId = ? AND e.teacher_id = ?
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$examId, $teacher_id]);
    $exam = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$exam) {
        return null;
    }

    $test = [
        'id'           => (int) $exam['eId'],
        'title'        => $exam['eTitle'],  // ← EXAM TITLE
        'description'  => $exam['eDescription'] ?? '',
        'examType'     => $exam['type_code'] ?? 'General',
        'examTypeId'   => (int) $exam['exam_type_id'],
        'targetLevel'  => $exam['eTarget_level'] ?? 'All',
        'duration'     => (int) $exam['eDuration'],
        'totalScore'   => (int) $exam['eTotal_score'],
        'passScore'    => (int) $exam['ePass_score'],
        'visibility'   => ucfirst($exam['eVisibility']),
        'status'       => ucfirst($exam['eStatus']),
        'createdAt'    => $exam['eCreated_at'] ?? null,
        'skills'       => []  // ← Sẽ group sections theo skill
    ];

    // 2. Lấy skill configs với instructions
    $skillsData = self::getSkillConfigsByExamType($exam['exam_type_id']);
    
    // 3. Lấy sections và group theo skill
    $sections = self::getTestSections($teacher_id, $examId);
    
    // Group sections by skill_code
    $groupedBySkill = [];
    foreach ($sections as $section) {
        $skillCode = $section['skill'];
        if (!isset($groupedBySkill[$skillCode])) {
            $groupedBySkill[$skillCode] = [
                'skillCode' => $skillCode,
                'instructions' => '',
                'sections' => []
            ];
        }
        $groupedBySkill[$skillCode]['sections'][] = $section;
    }
    
    // Merge với skill instructions từ skill_config
    foreach ($skillsData as $skillConfig) {
        $skillCode = $skillConfig['skill_code'];
        if (isset($groupedBySkill[$skillCode])) {
            $groupedBySkill[$skillCode]['instructions'] = $skillConfig['instructions'];
        }
    }
    
    // 4. Load content items và questions cho từng section
    foreach ($groupedBySkill as $skillCode => &$skillGroup) {
        foreach ($skillGroup['sections'] as &$section) {
            $sectionId = $section['id'];
            $skill = strtolower($section['skill']);
            
            // Content items (cho Reading/Listening)
            if (in_array($skill, ['reading', 'listening'])) {
                $section['contentItems'] = self::getContentItemsBySection($sectionId);
            }
            
            // Questions
            $section['questions'] = self::getQuestionsBySection($sectionId);
            
            // Với mỗi question:
            foreach ($section['questions'] as &$question) {
                $questionType = $question['questionType'];
                
                // Answers (cho MCQ, True/False, etc.)
                if (in_array($questionType, ['multiple_choice', 'true_false', 'matching'])) {
                    $question['answers'] = self::getAnswersByQuestion($teacher_id, $examId, $question['id']);
                }
                
                // Task prompts (cho Essay, Speaking)
                if (in_array($questionType, ['essay', 'letter', 'speaking_response'])) {
                    $question['taskPrompt'] = self::getTaskPromptByQuestionDirect($question['id']);
                }
            }
        }
    }
    
    $test['skills'] = array_values($groupedBySkill);
    
    return $test;
}
    public static function createSection(int $examId, string $examSkill, string $sectionNumber, string $sectionCode, string $sectionTitle, string $Instructions, int $esDuration, int $Total_questions, int $Max_score, string $section_type, int $Order_number): int
    {
        $db = Database::getInstance()->getConnection();

        // LỖI CŨ: Thiếu dấu phẩy giữa cNumberOfStudent và cStatus
        // LỖI CŨ: Thiếu giá trị truyền vào cho cNumberOfStudent trong VALUES
        $sql = "
            INSERT INTO exam_sections (exam_id,esSkill_code,section_number,section_code,section_title,esInstructions,esDuration,esTotal_questions,esMax_score,section_type,esOrder_number)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ";

        $stmt = $db->prepare($sql);
        // Truyền đủ 8 tham số tương ứng với 8 dấu hỏi (?)
        $stmt->execute([
            $examId,
            $examSkill,
            $sectionNumber,
            $sectionCode,
            $sectionTitle,
            $Instructions,
            $esDuration,
            $Total_questions,
            $Max_score,
            $section_type,
            $Order_number ?? ''
        ]);

        return (int)$db->lastInsertId();
    }

    public static function createTest(int $examTypeId, string $examCode, string $examTitle, string $examDescription, int $examDuration, int $eTotal_score, int $ePass_score, int $teacherId): int
    {
        $db = Database::getInstance()->getConnection();

        // LỖI CŨ: Thiếu dấu phẩy giữa cNumberOfStudent và cStatus
        // LỖI CŨ: Thiếu giá trị truyền vào cho cNumberOfStudent trong VALUES
        $sql = "
            INSERT INTO exams (exam_type_id,exam_code,eTitle, eDescription, eDuration, eTotal_score,ePass_score, teacher_id)
            VALUES (?,?,?,?,?,?,?,?)
        ";

        $stmt = $db->prepare($sql);
        // Truyền đủ 8 tham số tương ứng với 8 dấu hỏi (?)
        $stmt->execute([
            $examTypeId,
            $examCode,
            $examTitle,
            $examDescription,
            $examDuration,
            $eTotal_score,
            $ePass_score,
            $teacherId
        ]);

        return (int)$db->lastInsertId();
    }

    /**
     * Create question
     */
    public static function createQuestion(
        int $sectionId,
        int $questionNumber,
        string $questionText,
        string $questionType,
        float $points,
        int $orderNumber
    ): int {
        $db = Database::getInstance()->getConnection();

        $sql = "
            INSERT INTO questions (
                section_id, question_number, question_text, 
                question_type, qPoints, qOrder_number
            )
            VALUES (?, ?, ?, ?, ?, ?)
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            $sectionId,
            $questionNumber,
            $questionText,
            $questionType,
            $points,
            $orderNumber
        ]);

        return (int)$db->lastInsertId();
    }

    /**
     * Create answer option
     */
    public static function createAnswer(
        int $questionId,
        string $optionKey,
        string $optionText,
        bool $isCorrect,
        int $orderNumber
    ): int {
        $db = Database::getInstance()->getConnection();

        $sql = "
            INSERT INTO answers (
                question_id, option_key, option_text, 
                aIs_correct, aOrder_number
            )
            VALUES (?, ?, ?, ?, ?)
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            $questionId,
            $optionKey,
            $optionText,
            $isCorrect ? 1 : 0,
            $orderNumber
        ]);

        return (int)$db->lastInsertId();
    }

    /**
     * Lấy danh sách tất cả exam types
     */
    public static function getExamTypes(): array
    {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("SELECT etId AS id, type_code AS code, type_name AS name FROM exam_types ORDER BY type_name ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update basic info của exam (chỉ bảng exams, không đụng questions)
     */
public static function updateTestBasicInfo(int $examId, int $teacher_id, array $data): bool
{
    $db = Database::getInstance()->getConnection();

    $fields = [];
    $params = [];

    $fieldMap = [
        'examTitle'       => 'eTitle',
        'examTypeId'      => 'exam_type_id',
        'examDescription' => 'eDescription',
        'examDuration'    => 'eDuration',
        'totalScore'      => 'eTotal_score',
        'passScore'       => 'ePass_score',
        'targetLevel'     => 'eTarget_level',
        'status'          => 'eStatus',
        'visibility'      => 'eVisibility',
    ];

    foreach ($fieldMap as $inputKey => $dbColumn) {
        if (array_key_exists($inputKey, $data) && $data[$inputKey] !== null) {
            $fields[] = "$dbColumn = ?";
            $params[] = $data[$inputKey];
        }
    }

    if (empty($fields)) {
        return false; // Không có gì để update
    }

    // WHERE condition
    $params[] = $examId;
    $params[] = $teacher_id;

    $sql = "UPDATE exams SET " . implode(', ', $fields) . " WHERE eId = ? AND teacher_id = ?";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    return $stmt->rowCount() > 0;
}
    /**
     * Update test basic info
     */
    public static function updateTestInfo(
        int $examId,
        int $teacherId,
        ?string $title = null,
        ?string $description = null,
        ?int $duration = null,
        ?int $totalScore = null,
        ?int $passScore = null,
        ?string $targetLevel = null,
        ?string $visibility = null,
        ?string $status = null
    ): bool {
        $db = Database::getInstance()->getConnection();

        $updates = [];
        $params = [];

        if ($title !== null) {
            $updates[] = "eTitle = ?";
            $params[] = $title;
        }
        if ($description !== null) {
            $updates[] = "eDescription = ?";
            $params[] = $description;
        }
        if ($duration !== null) {
            $updates[] = "eDuration = ?";
            $params[] = $duration;
        }
        if ($totalScore !== null) {
            $updates[] = "eTotal_score = ?";
            $params[] = $totalScore;
        }
        if ($passScore !== null) {
            $updates[] = "ePass_score = ?";
            $params[] = $passScore;
        }
        if ($targetLevel !== null) {
            $updates[] = "eTarget_level = ?";
            $params[] = $targetLevel;
        }
        if ($visibility !== null) {
            $updates[] = "eVisibility = ?";
            $params[] = strtolower($visibility);
        }
        if ($status !== null) {
            $updates[] = "eStatus = ?";
            $params[] = strtolower($status);
        }

        if (empty($updates)) {
            return true; // Nothing to update
        }

        $params[] = $examId;
        $params[] = $teacherId;

        $sql = "
            UPDATE exams 
            SET " . implode(', ', $updates) . "
            WHERE eId = ? AND teacher_id = ?
        ";

        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    // ─── GET: Full Structure ──────────────────────────────────
    // ─── GET: Full Structure for Builder ─────────────────────
    public static function getFullStructure(int $examId, int $teacherId): ?array
    {
        $db = Database::getInstance()->getConnection();

        // 1. Exam basic info — JOIN exam_types để lấy type_code
        $stmt = $db->prepare("
            SELECT e.eId AS id, e.eTitle AS title,
                   et.type_code AS examType,
                   e.eStatus AS status, e.eDuration AS duration,
                   e.eTotal_score AS totalScore, e.ePass_score AS passScore,
                   e.eTarget_level AS targetLevel
            FROM exams e
            LEFT JOIN exam_types et ON e.exam_type_id = et.etId
            WHERE e.eId = ? AND e.teacher_id = ?
        ");
        $stmt->execute([$examId, $teacherId]);
        $exam = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$exam) return null;

        // 2. Sections
        $secStmt = $db->prepare("
            SELECT esId AS id, esSkill_code AS skillCode,
                   section_code AS sectionCode,
                   section_title AS sectionTitle,
                   esDuration AS duration,
                   esMax_score AS maxScore,
                   esInstructions AS instructions,
                   esOrder_number AS orderNumber
            FROM exam_sections
            WHERE exam_id = ?
            ORDER BY esOrder_number ASC
        ");
        $secStmt->execute([$examId]);
        $sections = $secStmt->fetchAll(PDO::FETCH_ASSOC);

        // 3. Content items per section
        $ciStmt = $db->prepare("
            SELECT coId AS id, section_id AS sectionId,
                   content_type AS contentType,
                   coTitle AS title,
                   content AS content,
                   coMedia_url AS audioUrl,
                   coMedia_duration AS audioDuration,
                   coTranscript AS transcript,
                   coOrder_number AS orderNumber
            FROM content_items
            WHERE section_id = ?
            ORDER BY coOrder_number ASC
        ");

        // 4. Questions per section
        $qStmt = $db->prepare("
            SELECT qId AS id, section_id AS sectionId,
                   question_number AS questionNumber,
                   question_type AS questionType,
                   question_text AS questionText,
                   qPoints AS points,
                   qOrder_number AS orderNumber
            FROM questions
            WHERE section_id = ?
            ORDER BY qOrder_number ASC
        ");

        // 5. Answers per question — bảng `answers`, không phải `answer_options`
        $aStmt = $db->prepare("
            SELECT aId AS id, question_id AS questionId,
                   option_key AS answerKey,
                   option_text AS answerText,
                   aIs_correct AS isCorrect
            FROM answers
            WHERE question_id = ?
            ORDER BY option_key ASC
        ");

        // 6. Task prompts per question
        $tpStmt = $db->prepare("
            SELECT tpId AS id, question_id AS questionId,
                   tpSituation AS situation,
                   tpRequirements AS requirements,
                   tpCue_card AS cueCard,
                   tpMin_words AS minWords,
                   tpSuggested_time AS suggestedTime
            FROM task_prompts
            WHERE question_id = ?
            LIMIT 1
        ");

        // Build grouped structure
        $skillGroups = [];
        foreach ($sections as $sec) {
            $skill = strtolower($sec['skillCode']);

            // Content items
            $ciStmt->execute([$sec['id']]);
            $contentItems = $ciStmt->fetchAll(PDO::FETCH_ASSOC);

            // Questions with answers + task prompt
            $qStmt->execute([$sec['id']]);
            $questions = $qStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($questions as &$q) {
                $aStmt->execute([$q['id']]);
                $q['answers'] = $aStmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($q['answers'] as &$a) {
                    $a['isCorrect'] = (bool)$a['isCorrect'];
                }
                unset($a);

                $tpStmt->execute([$q['id']]);
                $q['taskPrompt'] = $tpStmt->fetch(PDO::FETCH_ASSOC) ?: null;
            }
            unset($q);

            $sec['contentItems'] = $contentItems;
            $sec['questions']    = $questions;

            if (!isset($skillGroups[$skill])) {
                $skillGroups[$skill] = ['skillCode' => $skill, 'sections' => []];
            }
            $skillGroups[$skill]['sections'][] = $sec;
        }

        $exam['skills'] = array_values($skillGroups);
        return $exam;
    }

    // ─── PUT: Save Full Structure ─────────────────────────────
    public static function saveFullStructure(int $examId, int $teacherId, array $input): bool
    {
        $db = Database::getInstance()->getConnection();

        // Verify ownership
        $stmt = $db->prepare("SELECT eId FROM exams WHERE eId = ? AND teacher_id = ?");
        $stmt->execute([$examId, $teacherId]);
        if (!$stmt->fetch()) return false;

        $db->beginTransaction();
        try {
            foreach (($input['skills'] ?? []) as $skillGroup) {
                $skillCode = $skillGroup['skillCode'] ?? '';

                foreach (($skillGroup['sections'] ?? []) as $orderNum => $secData) {
                    $sectionId = self::upsertSection($db, $examId, $skillCode, $secData, $orderNum);
                    if (!$sectionId) throw new \Exception("Failed to upsert section");

                    // Content items
                    $existingCiIds = [];
                    foreach (($secData['contentItems'] ?? []) as $ciOrder => $ciData) {
                        $ciId = self::upsertContentItem($db, $sectionId, $ciData, $ciOrder);
                        if ($ciId) $existingCiIds[] = $ciId;
                    }
                    if (!empty($existingCiIds)) {
                        $ph = implode(',', array_fill(0, count($existingCiIds), '?'));
                        $db->prepare("DELETE FROM content_items WHERE section_id = ? AND coId NOT IN ($ph)")
                           ->execute(array_merge([$sectionId], $existingCiIds));
                    } else {
                        $db->prepare("DELETE FROM content_items WHERE section_id = ?")
                           ->execute([$sectionId]);
                    }

                    // Questions
                    $existingQIds = [];
                    foreach (($secData['questions'] ?? []) as $qOrder => $qData) {
                        $qId = self::upsertQuestion($db, $sectionId, $qData, $qOrder);
                        if ($qId) $existingQIds[] = $qId;
                    }
                    if (!empty($existingQIds)) {
                        $ph = implode(',', array_fill(0, count($existingQIds), '?'));
                        $db->prepare("DELETE FROM questions WHERE section_id = ? AND qId NOT IN ($ph)")
                           ->execute(array_merge([$sectionId], $existingQIds));
                    } else {
                        $db->prepare("DELETE FROM questions WHERE section_id = ?")
                           ->execute([$sectionId]);
                    }

                    // Update section question count
                    $db->prepare("
                        UPDATE exam_sections
                        SET esTotal_questions = (SELECT COUNT(*) FROM questions WHERE section_id = ?)
                        WHERE esId = ?
                    ")->execute([$sectionId, $sectionId]);
                }

                // Delete removed sections for this skill
                $submittedIds = array_filter(array_column($skillGroup['sections'] ?? [], 'id'));
                if (!empty($submittedIds)) {
                    $ph = implode(',', array_fill(0, count($submittedIds), '?'));
                    $db->prepare("
                        DELETE FROM exam_sections
                        WHERE exam_id = ? AND esSkill_code = ? AND esId NOT IN ($ph)
                    ")->execute(array_merge([$examId, $skillCode], $submittedIds));
                }
            }

            $db->commit();
            return true;

        } catch (\Exception $e) {
            $db->rollBack();
            error_log('saveFullStructure error: ' . $e->getMessage());
            return false;
        }
    }

    // ─── UPSERT HELPERS ───────────────────────────────────────

    public static function upsertSection(PDO $db, int $examId, string $skill, array $data, int $order): ?int
    {
        $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

        if ($id) {
            $db->prepare("
                UPDATE exam_sections SET
                    esSkill_code   = ?,
                    section_code   = ?,
                    section_title  = ?,
                    esDuration     = ?,
                    esMax_score    = ?,
                    esInstructions = ?,
                    esOrder_number = ?
                WHERE esId = ? AND exam_id = ?
            ")->execute([
                $skill,
                $data['sectionCode']  ?? '',
                $data['sectionTitle'] ?? '',
                $data['duration']     ?? 0,
                $data['maxScore']     ?? 0,
                $data['instructions'] ?? '',
                $order,
                $id, $examId
            ]);
            return $id;
        } else {
            $stmt = $db->prepare("
                INSERT INTO exam_sections
                    (exam_id, esSkill_code, section_code, section_title,
                     esDuration, esMax_score, esInstructions, esOrder_number,
                     section_number, esTotal_questions, section_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'standard')
            ");
            $stmt->execute([
                $examId, $skill,
                $data['sectionCode']  ?? '',
                $data['sectionTitle'] ?? '',
                $data['duration']     ?? 0,
                $data['maxScore']     ?? 0,
                $data['instructions'] ?? '',
                $order,
                $order + 1,
            ]);
            return (int)$db->lastInsertId();
        }
    }

    public static function upsertContentItem(PDO $db, int $sectionId, array $data, int $order): ?int
    {
        $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

        if ($id) {
            $db->prepare("
                UPDATE content_items SET
                    content_type     = ?,
                    coTitle          = ?,
                    content          = ?,
                    coMedia_url      = ?,
                    coMedia_duration = ?,
                    coTranscript     = ?,
                    coOrder_number   = ?
                WHERE coId = ? AND section_id = ?
            ")->execute([
                $data['contentType']   ?? 'text',
                $data['title']         ?? '',
                $data['content']       ?? '',
                $data['audioUrl']      ?? '',
                $data['audioDuration'] ?? 0,
                $data['transcript']    ?? '',
                $order,
                $id, $sectionId
            ]);
            return $id;
        } else {
            $stmt = $db->prepare("
                INSERT INTO content_items
                    (section_id, content_type, coTitle, 
                     content, coMedia_url, coMedia_duration,
                     coTranscript,  coOrder_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $sectionId,
                $data['contentType']   ?? 'text',
                $data['title']         ?? '',
                
                $data['content']       ?? '',
                $data['audioUrl']      ?? '',
                $data['audioDuration'] ?? 0,
                $data['transcript']    ?? '',
                
                $order
            ]);
            return (int)$db->lastInsertId();
        }
    }

    public static function upsertQuestion(PDO $db, int $sectionId, array $data, int $order): ?int
    {
        $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

        if ($id) {
            $db->prepare("
                UPDATE questions SET
                    question_number = ?,
                    question_type   = ?,
                    question_text   = ?,
                    qPoints         = ?,
                    qOrder_number   = ?
                WHERE qId = ? AND section_id = ?
            ")->execute([
                $data['questionNumber'] ?? $order + 1,
                $data['questionType']   ?? 'multiple_choice',
                $data['questionText']   ?? '',
                $data['points']         ?? 1,
                $order,
                $id, $sectionId
            ]);
            $qId = $id;
        } else {
            $stmt = $db->prepare("
                INSERT INTO questions
                    (section_id, question_number, question_type,
                     question_text, qPoints, qOrder_number)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $sectionId,
                $data['questionNumber'] ?? $order + 1,
                $data['questionType']   ?? 'multiple_choice',
                $data['questionText']   ?? '',
                $data['points']         ?? 1,
                $order
            ]);
            $qId = (int)$db->lastInsertId();
        }

        // Upsert answers
        $existingAIds = [];
        foreach (($data['answers'] ?? []) as $ans) {
            $aId = self::upsertAnswer($db, $qId, $ans);
            if ($aId) $existingAIds[] = $aId;
        }
        if (!empty($existingAIds)) {
            $ph = implode(',', array_fill(0, count($existingAIds), '?'));
            $db->prepare("DELETE FROM answers WHERE question_id = ? AND aId NOT IN ($ph)")
               ->execute(array_merge([$qId], $existingAIds));
        } else {
            $db->prepare("DELETE FROM answers WHERE question_id = ?")
               ->execute([$qId]);
        }

        // Upsert task_prompt
        if (!empty($data['taskPrompt'])) {
            self::upsertTaskPrompt($db, $qId, $data['taskPrompt']);
        } else {
            $db->prepare("DELETE FROM task_prompts WHERE question_id = ?")
               ->execute([$qId]);
        }

        return $qId;
    }

    public static function upsertAnswer(PDO $db, int $qId, array $data): ?int
    {
        $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;
        $isCorrect = empty($data['isCorrect']) ? 0 : 1;

        if ($id) {
            $db->prepare("
                UPDATE answers SET
                    option_key  = ?,
                    option_text = ?,
                    aIs_correct = ?
                WHERE aId = ? AND question_id = ?
            ")->execute([
                $data['answerKey']  ?? 'A',
                $data['answerText'] ?? '',
                $isCorrect,
                $id, $qId
            ]);
            return $id;
        } else {
            $stmt = $db->prepare("
                INSERT INTO answers (question_id, option_key, option_text, aIs_correct, aOrder_number)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $qId,
                $data['answerKey']  ?? 'A',
                $data['answerText'] ?? '',
                $isCorrect,
                0
            ]);
            return (int)$db->lastInsertId();
        }
    }

    public static function upsertTaskPrompt(PDO $db, int $qId, array $data): void
    {
        $exists = $db->prepare("SELECT tpId FROM task_prompts WHERE question_id = ? LIMIT 1");
        $exists->execute([$qId]);

        if ($exists->fetch()) {
            $db->prepare("
                UPDATE task_prompts SET
                    tpSituation      = ?,
                    tpRequirements   = ?,
                    tpCue_card       = ?,
                    tpMin_words      = ?,
                    tpSuggested_time = ?
                WHERE question_id = ?
            ")->execute([
                $data['situation']     ?? '',
                $data['requirements']  ?? '',
                $data['cueCard']       ?? '',
                $data['minWords']      ?? 0,
                $data['suggestedTime'] ?? 0,
                $qId
            ]);
        } else {
            $db->prepare("
                INSERT INTO task_prompts
                    (question_id, tpSituation, tpRequirements,
                     tpCue_card, tpMin_words, tpSuggested_time)
                VALUES (?, ?, ?, ?, ?, ?)
            ")->execute([
                $qId,
                $data['situation']     ?? '',
                $data['requirements']  ?? '',
                $data['cueCard']       ?? '',
                $data['minWords']      ?? 0,
                $data['suggestedTime'] ?? 0,
            ]);
        }
    }
    public static function createTemplateStructure(int $examId, string $template): void
{
    $db = Database::getInstance()->getConnection();
    
    // Define templates structure
    $templates = [
        'standard' => [
            ['skill' => 'Reading', 'sections' => 3, 'questionsPerSection' => 10],
            ['skill' => 'Listening', 'sections' => 3, 'questionsPerSection' => 10],
            ['skill' => 'Writing', 'sections' => 2, 'questionsPerSection' => 1],
            ['skill' => 'Speaking', 'sections' => 3, 'questionsPerSection' => 1]
        ],
        'receptive' => [
            ['skill' => 'Reading', 'sections' => 4, 'questionsPerSection' => 15],
            ['skill' => 'Listening', 'sections' => 4, 'questionsPerSection' => 15]
        ],
        'productive' => [
            ['skill' => 'Writing', 'sections' => 3, 'questionsPerSection' => 1],
            ['skill' => 'Speaking', 'sections' => 4, 'questionsPerSection' => 1]
        ]
    ];

    if (!isset($templates[$template])) {
        throw new \Exception("Invalid template: $template");
    }

    $structure = $templates[$template];
    $orderNumber = 1;

    foreach ($structure as $skillConfig) {
        $skill = $skillConfig['skill'];
        $numSections = $skillConfig['sections'];
        $questionsPerSection = $skillConfig['questionsPerSection'];

        for ($sectionNum = 1; $sectionNum <= $numSections; $sectionNum++) {
            // Tạo section
            $sectionCode = strtoupper(substr($skill, 0, 1)) . $sectionNum;
            $sectionTitle = "$skill - Part $sectionNum";
            
            $sql = "
                INSERT INTO exam_sections 
                (exam_id, esSkill_code, section_code, section_title, esDuration, esTotal_questions, esMax_score, esOrder_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ";
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                $examId,
                $skill,
                $sectionCode,
                $sectionTitle,
                15, // duration mặc định 15 phút
                $questionsPerSection,
                $questionsPerSection * 1, // mỗi câu 1 điểm
                $orderNumber++
            ]);
            
            $sectionId = (int)$db->lastInsertId();

            // Tạo questions mẫu cho section
            for ($qNum = 1; $qNum <= $questionsPerSection; $qNum++) {
                $questionType = self::getDefaultQuestionType($skill);
                $questionText = self::getPlaceholderQuestionText($skill, $qNum);
                
                $sqlQ = "
                    INSERT INTO questions 
                    (section_id, question_number, question_type, question_text, qPoints, qOrder_number)
                    VALUES (?, ?, ?, ?, ?, ?)
                ";
                
                $stmtQ = $db->prepare($sqlQ);
                $stmtQ->execute([
                    $sectionId,
                    $qNum,
                    $questionType,
                    $questionText,
                    1, // 1 điểm
                    $qNum
                ]);
                
                $questionId = (int)$db->lastInsertId();

                // Tạo answers mẫu cho multiple choice
                if ($questionType === 'multiple_choice') {
                    $options = ['A', 'B', 'C', 'D'];
                    foreach ($options as $idx => $key) {
                        $sqlA = "
                            INSERT INTO answers 
                            (question_id, option_key, option_text, aIs_correct)
                            VALUES (?, ?, ?, ?)
                        ";
                        $stmtA = $db->prepare($sqlA);
                        $stmtA->execute([
                            $questionId,
                            $key,
                            "Option $key (edit this)",
                            $idx === 0 ? 1 : 0 // A đúng mặc định
                        ]);
                    }
                }
            }
        }
    }
}

/**
 * Helper: Lấy question type mặc định theo skill
 */
public static function getDefaultQuestionType(string $skill): string
{
    $types = [
        'Reading' => 'multiple_choice',
        'Listening' => 'multiple_choice',
        'Writing' => 'essay',
        'Speaking' => 'speaking'
    ];
    return $types[$skill] ?? 'multiple_choice';
}

/**
 * Helper: Tạo placeholder question text
 */
public static function getPlaceholderQuestionText(string $skill, int $number): string
{
    $templates = [
        'Reading' => "Question $number: Read the passage and choose the best answer.",
        'Listening' => "Question $number: Listen to the audio and choose the correct option.",
        'Writing' => "Question $number: Write an essay (150-200 words) about the given topic.",
        'Speaking' => "Question $number: Speak about the given topic for 1-2 minutes."
    ];
    return $templates[$skill] ?? "Question $number";
}
public static function deleteSectionsByExamId(int $examId, int $teacherId): bool
    {
        $db = Database::getInstance()->getConnection();
        
        // 1. Verify ownership
        $checkSql = "SELECT COUNT(*) FROM exams WHERE eId = ? AND teacher_id = ?";
        $stmt = $db->prepare($checkSql);
        $stmt->execute([$examId, $teacherId]);
        
        if ($stmt->fetchColumn() == 0) {
            return false; // Not authorized
        }

        // 2. Get all section IDs for this exam
        $getSections = "SELECT esId FROM exam_sections WHERE exam_id = ?";
        $stmt = $db->prepare($getSections);
        $stmt->execute([$examId]);
        $sectionIds = $stmt->fetchAll(\PDO::FETCH_COLUMN);
        
        if (empty($sectionIds)) {
            return true; // No sections to delete
        }

        $db->beginTransaction();
        
        try {
            $placeholders = implode(',', array_fill(0, count($sectionIds), '?'));
            
            // 3. Delete content_items (có section_id)
            $sql = "DELETE FROM content_items WHERE section_id IN ($placeholders)";
            $stmt = $db->prepare($sql);
            $stmt->execute($sectionIds);
            
            // 4. Get all question IDs từ các sections
            $sql = "SELECT qId FROM questions WHERE section_id IN ($placeholders)";
            $stmt = $db->prepare($sql);
            $stmt->execute($sectionIds);
            $questionIds = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            
            if (!empty($questionIds)) {
                $qPlaceholders = implode(',', array_fill(0, count($questionIds), '?'));
                
                // 5. Delete answers
                $sql = "DELETE FROM answers WHERE question_id IN ($qPlaceholders)";
                $stmt = $db->prepare($sql);
                $stmt->execute($questionIds);
                
                // 6. Delete task_prompts (nếu có)
                $sql = "DELETE FROM task_prompts WHERE question_id IN ($qPlaceholders)";
                $stmt = $db->prepare($sql);
                $stmt->execute($questionIds);
            }
            
            // 7. Delete questions
            $sql = "DELETE FROM questions WHERE section_id IN ($placeholders)";
            $stmt = $db->prepare($sql);
            $stmt->execute($sectionIds);
            
            // 8. Delete exam_sections
            $sql = "DELETE FROM exam_sections WHERE exam_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$examId]);
            
            $db->commit();
            return true;
            
        } catch (\Exception $e) {
            $db->rollBack();
            error_log("Error deleting sections for exam $examId: " . $e->getMessage());
            return false;
        }
    }
public static function deleteExam(int $courseId, int $teacherId): bool
    {
        $db = Database::getInstance()->getConnection();
        // Ràng buộc uId của giáo viên để đảm bảo giáo viên chỉ xóa được khóa học của chính mình
        $stmt = $db->prepare("DELETE FROM course WHERE cId = ? AND cTeacher = ?");
        return $stmt->execute([$courseId, $teacherId]);
    }
}