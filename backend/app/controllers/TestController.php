<?php

namespace App\Controllers;

use App\Core\Response;
use App\Models\TestModel;
use App\Models\UserModel;

class TestController
{
    public function teacherTest()
    {
        // Uncomment these lines when authentication is ready
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        // Temporarily using hardcoded teacher_id = 1 for testing
        $tests = TestModel::getTestsByTeacherId($user['uId']);

        // Return the tests data directly
        Response::success($tests);
    }



    public function store()
{
    $user = UserModel::getAuthenticatedUser();

    if (!$user || $user['uRole'] !== 'teacher') {
        Response::error('AUTH_UNAUTHORIZED', 'Unauthorized access.', null, 401);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    // Validation
    if (
        empty($input['examTypeId']) || empty($input['examCode']) || empty($input['examTitle'])
        || empty($input['examDuration']) || empty($input['totalScore']) || empty($input['passScore'])
    ) {
        Response::error('TEST_INVALID_DATA', 'Missing required fields.', null, 400);
        return;
    }

    try {
        // 1. Tạo test
        $newTestId = TestModel::createTest(
            $input['examTypeId'],
            $input['examCode'],
            $input['examTitle'],
            $input['examDescription'] ?? '',
            (int)$input['examDuration'],
            (int)$input['totalScore'],
            (int)$input['passScore'],
            $user['uId']
        );

        // 2. Tạo structure mẫu theo template (nếu không phải blank)
        $template = $input['template'] ?? 'standard';
        if ($template !== 'blank') {
            TestModel::createTemplateStructure($newTestId, $template);
        }

        Response::success([
            'testId' => $newTestId,
            'message' => 'Test created successfully',
            'template' => $template
        ]);
    } catch (\Exception $e) {
        error_log('Error creating test: ' . $e->getMessage());
        Response::error('TEST_CREATE_FAILED', 'Failed to create test: ' . $e->getMessage(), null, 500);
    }
}

    public function destroy($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
            return;
        }

        $result = TestModel::deleteExam($id, $user['uId']);

        if ($result) {
            Response::success([
                'message' => 'Xóa test thành công'
            ]);
        } else {
            Response::error('DELETE_TEST_FAILED', 'Không thể xóa test', null, 500);
        }
    }

    public function show($id)
    {
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        // Implement getTestById method in TestModel
        $test = TestModel::getTestById($id, $user['uId']);
        if ($test) {
            Response::success($test);
        } else {
            Response::error('TEST_NOT_FOUND', 'Không tìm thấy test.', null, 404);
        }
    }

    public function showFull($id)
    {
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        // Get complete test structure
        $test = TestModel::getFullTestDetail($user['uId'], $id);

        if ($test) {
            Response::success($test);
        } else {
            Response::error('TEST_NOT_FOUND', 'Không tìm thấy test.', null, 404);
        }
    }
    public function getExamTypes()
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
            return;
        }
        $types = TestModel::getExamTypes();
        Response::success($types);
    }

    public function update($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        // Validate required fields
        if (empty($input['examTitle'])) {
            Response::error('VALIDATION_ERROR', 'Exam title is required.', null, 400);
            return;
        }

        if (!empty($input['passScore']) && !empty($input['totalScore'])) {
            if ((int)$input['passScore'] > (int)$input['totalScore']) {
                Response::error('VALIDATION_ERROR', 'Pass score cannot exceed total score.', null, 400);
                return;
            }
        }

        $result = TestModel::updateTestBasicInfo($id, $user['uId'], [
            'examTitle'       => $input['examTitle']       ?? null,
            'examTypeId'      => isset($input['examTypeId']) ? (int)$input['examTypeId'] : null,
            'examDescription' => $input['examDescription'] ?? '',
            'examDuration'    => isset($input['examDuration'])    ? (int)$input['examDuration']    : null,
            'totalScore'      => isset($input['totalScore'])      ? (int)$input['totalScore']      : null,
            'passScore'       => isset($input['passScore'])       ? (int)$input['passScore']       : null,
            'targetLevel'     => $input['targetLevel']     ?? null,
            'status'          => $input['status']          ?? null,
            'visibility'      => $input['visibility']      ?? null,
        ]);

        if ($result) {
            Response::success(['message' => 'Test updated successfully']);
        } else {
            Response::error('UPDATE_FAILED', 'Failed to update test.', null, 500);
        }
    }

    // ─── GET /api/teacher/tests/{id}/builder ─────────────────
    public function getBuilder($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Unauthorized.', null, 401);
            return;
        }

        $data = TestModel::getFullStructure((int)$id, $user['uId']);
        if (!$data) {
            Response::error('NOT_FOUND', 'Test not found.', null, 404);
            return;
        }

        Response::success($data);
    }

    // ─── PUT /api/teacher/tests/{id}/builder ─────────────────
    public function saveBuilder($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Unauthorized.', null, 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            Response::error('INVALID_INPUT', 'Invalid JSON.', null, 400);
            return;
        }

        $result = TestModel::saveFullStructure((int)$id, $user['uId'], $input);
        if ($result) {
            Response::success(['message' => 'Test saved successfully.']);
        } else {
            Response::error('SAVE_FAILED', 'Failed to save test.', null, 500);
        }
    }
    /**
     * Update full test (sections, questions, answers)
     * PUT /api/teacher/tests/{id}/full
     */
    public function updateFull($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        try {
            // 1. Update basic test info
            if (!empty($input['testInfo'])) {
                $info = $input['testInfo'];
                TestModel::updateTestInfo(
                    $id,
                    $user['uId'],
                    $info['title'] ?? null,
                    $info['description'] ?? null,
                    isset($info['duration']) ? (int)$info['duration'] : null,
                    isset($info['totalScore']) ? (int)$info['totalScore'] : null,
                    isset($info['passScore']) ? (int)$info['passScore'] : null,
                    $info['targetLevel'] ?? null,
                    $info['visibility'] ?? null,
                    $info['status'] ?? null
                );
            }

            // 2. Update sections and questions
            if (!empty($input['skills']) && is_array($input['skills'])) {
                // Delete existing sections first (cascade delete will handle questions)
                TestModel::deleteSectionsByExamId($id, $user['uId']);

                // Recreate sections
                foreach ($input['skills'] as $skill) {
                    if (!empty($skill['sections']) && is_array($skill['sections'])) {
                        foreach ($skill['sections'] as $section) {
                            $sectionId = TestModel::createSection(
                                $id,
                                $section['skillCode'],
                                $section['sectionNumber'] ?? 1,
                                $section['sectionCode'] ?? '',
                                $section['sectionTitle'] ?? '',
                                $section['instructions'] ?? '',
                                (int)($section['duration'] ?? 0),
                                (int)($section['totalQuestions'] ?? 0),
                                (float)($section['maxScore'] ?? 0),
                                $section['sectionType'] ?? 'standard',
                                (int)($section['orderNumber'] ?? 1)
                            );

                            // Recreate questions
                            if (!empty($section['questions']) && is_array($section['questions'])) {
                                foreach ($section['questions'] as $question) {
                                    $questionId = TestModel::createQuestion(
                                        $sectionId,
                                        $question['questionNumber'] ?? 1,
                                        $question['questionText'] ?? '',
                                        $question['questionType'] ?? 'multiple_choice',
                                        (float)($question['points'] ?? 1),
                                        (int)($question['orderNumber'] ?? 1)
                                    );

                                    // Recreate answers
                                    if (!empty($question['answers']) && is_array($question['answers'])) {
                                        foreach ($question['answers'] as $answer) {
                                            TestModel::createAnswer(
                                                $questionId,
                                                $answer['optionKey'] ?? 'A',
                                                $answer['optionText'] ?? '',
                                                (bool)($answer['isCorrect'] ?? false),
                                                (int)($answer['orderNumber'] ?? 1)
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Response::success(['message' => 'Cập nhật test đầy đủ thành công']);
        } catch (\Exception $e) {
            Response::error('UPDATE_FAILED', 'Lỗi khi cập nhật: ' . $e->getMessage(), null, 500);
        }
    }
}