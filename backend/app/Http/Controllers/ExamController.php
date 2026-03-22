<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;

class ExamController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/exams",
     *     tags={"Exams"},
     *     summary="Get teacher exams",
     *     description="Get list of exams created by authenticated teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Exams retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * GET /api/teacher/exams
     * Lấy danh sách bài thi của teacher
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exams = Exam::where('eTeacher_id', $user->uId)
                    ->orderBy('eCreated_at', 'desc')
                    ->get();

        return response()->json([
            'status' => 'success',
            'data' => $exams
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/exams",
     *     tags={"Exams"},
     *     summary="Create new exam",
     *     description="Create a new exam (teacher only)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"eTitle","eType"},
     *             @OA\Property(property="eTitle", type="string", example="VSTEP Practice Test"),
     *             @OA\Property(property="eDescription", type="string", example="Practice test for VSTEP preparation"),
     *             @OA\Property(property="eType", type="string", example="VSTEP"),
     *             @OA\Property(property="eSkill", type="string", example="listening"),
     *             @OA\Property(property="eDuration", type="integer", example=90),
     *             @OA\Property(property="eTotal_score", type="integer", example=100)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Exam created successfully"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     * 
     * POST /api/teacher/exams
     * Tạo bài thi mới
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'eTitle' => 'required|string|max:255',
            'eDescription' => 'nullable|string',
            'eType' => 'required|in:VSTEP,IELTS,GENERAL',
            'eSkill' => 'required|in:listening,reading,writing,speaking',
            'eDuration_minutes' => 'required|integer|min:1',
            'eIs_private' => 'nullable|boolean',
            'eSource_type' => 'nullable|in:manual,upload',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $exam = Exam::create([
            'eTitle' => $request->eTitle,
            'eDescription' => $request->eDescription,
            'eType' => $request->eType,
            'eSkill' => $request->eSkill,
            'eTeacher_id' => $user->uId,
            'eDuration_minutes' => $request->eDuration_minutes,
            'eIs_private' => $request->eIs_private ?? false,
            'eSource_type' => $request->eSource_type ?? 'manual',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'examId' => $exam->eId
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/exams/{id}",
     *     tags={"Exams"},
     *     summary="Get exam details",
     *     description="Get detailed information about a specific exam",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\Response(response=200, description="Exam details retrieved successfully"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     * 
     * GET /api/teacher/exams/{id}
     * Lấy chi tiết bài thi với câu hỏi và đáp án
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->with(['questions.answers'])
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $exam
        ]);
    }

    /**
     * @OA\Put(
     *     path="/teacher/exams/{id}",
     *     tags={"Exams"},
     *     summary="Update exam",
     *     description="Update exam information",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="eTitle", type="string"),
     *             @OA\Property(property="eDescription", type="string"),
     *             @OA\Property(property="eDuration", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Exam updated successfully"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     * 
     * PUT /api/teacher/exams/{id}
     * Cập nhật thông tin bài thi
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'eTitle' => 'sometimes|required|string|max:255',
            'eDescription' => 'nullable|string',
            'eType' => 'sometimes|required|in:VSTEP,IELTS,GENERAL',
            'eSkill' => 'sometimes|required|in:listening,reading,writing,speaking',
            'eDuration_minutes' => 'sometimes|required|integer|min:1',
            'eIs_private' => 'nullable|boolean',
            'eSource_type' => 'nullable|in:manual,upload',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $exam->update($request->only([
            'eTitle', 'eDescription', 'eType', 'eSkill', 
            'eDuration_minutes', 'eIs_private', 'eSource_type'
        ]));

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Cập nhật bài thi thành công'
            ]
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/teacher/exams/{id}",
     *     tags={"Exams"},
     *     summary="Delete exam",
     *     description="Delete an exam (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Exam deleted successfully"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     * 
     * DELETE /api/teacher/exams/{id}
     * Xóa bài thi (soft delete)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $exam->delete();

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Xóa bài thi thành công'
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/exams/{id}/questions",
     *     tags={"Exams"},
     *     summary="Add questions to exam",
     *     description="Add multiple questions to an exam",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="questions",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="qText", type="string"),
     *                     @OA\Property(property="qType", type="string"),
     *                     @OA\Property(property="qScore", type="integer")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=201, description="Questions added successfully"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     * 
     * POST /api/teacher/exams/{id}/questions
     * Thêm câu hỏi vào bài thi (hàng loạt)
     */
    public function addQuestions(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'questions' => 'required|array|min:1',
            'questions.*.qContent' => 'required|string',
            'questions.*.qPoints' => 'required|integer|min:0',
            'questions.*.qMedia_url' => 'nullable|string',
            'questions.*.qTranscript' => 'nullable|string',
            'questions.*.qExplanation' => 'nullable|string',
            'questions.*.qListen_limit' => 'nullable|integer|min:1',
            'questions.*.answers' => 'required|array|min:1',
            'questions.*.answers.*.aContent' => 'required|string',
            'questions.*.answers.*.aIs_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Validate each question has at least one correct answer
        $invalidQuestions = [];
        foreach ($request->questions as $index => $questionData) {
            $hasCorrectAnswer = false;
            foreach ($questionData['answers'] as $answer) {
                if ($answer['aIs_correct']) {
                    $hasCorrectAnswer = true;
                    break;
                }
            }
            if (!$hasCorrectAnswer) {
                $invalidQuestions[] = $index + 1;
            }
        }

        if (!empty($invalidQuestions)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mỗi câu hỏi phải có ít nhất một đáp án đúng.',
                'invalidQuestions' => $invalidQuestions
            ], 400);
        }

        // Remove transaction for now to avoid savepoint issues in tests
        try {
            $questionsAdded = 0;

            foreach ($request->questions as $questionData) {
                $question = Question::create([
                    'exam_id' => $id,
                    'qContent' => $questionData['qContent'],
                    'qPoints' => $questionData['qPoints'],
                    'qMedia_url' => $questionData['qMedia_url'] ?? null,
                    'qTranscript' => $questionData['qTranscript'] ?? null,
                    'qExplanation' => $questionData['qExplanation'] ?? null,
                    'qListen_limit' => $questionData['qListen_limit'] ?? 1, // Default to 1 if not provided
                ]);

                foreach ($questionData['answers'] as $answerData) {
                    Answer::create([
                        'question_id' => $question->qId,
                        'aContent' => $answerData['aContent'],
                        'aIs_correct' => $answerData['aIs_correct'],
                    ]);
                }

                $questionsAdded++;
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'questionsAdded' => $questionsAdded
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi thêm câu hỏi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/teacher/exams/{examId}/questions/{questionId}",
     *     tags={"Exams"},
     *     summary="Update question in exam",
     *     description="Update a specific question in an exam",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="examId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="questionId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Question updated successfully")
     * )
     * 
     * PUT /api/teacher/exams/{examId}/questions/{questionId}
     * Cập nhật câu hỏi
     */
    public function updateQuestion(Request $request, $examId, $questionId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $examId)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $question = Question::where('qId', $questionId)
                           ->where('exam_id', $examId)
                           ->first();

        if (!$question) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy câu hỏi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'qContent' => 'sometimes|required|string',
            'qPoints' => 'sometimes|required|integer|min:0',
            'qMedia_url' => 'nullable|string',
            'qTranscript' => 'nullable|string',
            'qExplanation' => 'nullable|string',
            'qListen_limit' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $question->update($request->only([
            'qContent', 'qPoints', 'qMedia_url', 
            'qTranscript', 'qExplanation', 'qListen_limit'
        ]));

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Cập nhật câu hỏi thành công'
            ]
        ]);
    }

    /**
     * DELETE /api/teacher/exams/{examId}/questions/{questionId}
     * Xóa câu hỏi
     */
    public function deleteQuestion(Request $request, $examId, $questionId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $examId)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $question = Question::where('qId', $questionId)
                           ->where('exam_id', $examId)
                           ->first();

        if (!$question) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy câu hỏi.'
            ], 404);
        }

        // Delete answers first (cascade)
        Answer::where('question_id', $questionId)->delete();
        $question->delete();

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Xóa câu hỏi thành công'
            ]
        ]);
    }

    /**
     * GET /api/teacher/exams/{id}/sections
     * Xem cấu trúc sections của đề thi
     */
    /**
     * @OA\Get(
     *     path="/teacher/exams/{id}/sections",
     *     tags={"Exams"},
     *     summary="Get exam sections",
     *     description="Get exam structure organized by sections (listening, reading, writing, speaking)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Exam sections retrieved successfully"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     */
    public function sections(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->with(['questions.answers'])
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        // Organize questions by sections based on exam type
        $sections = $this->organizeQuestionsBySection($exam);

        return response()->json([
            'status' => 'success',
            'data' => [
                'exam' => [
                    'eId' => $exam->eId,
                    'eTitle' => $exam->eTitle,
                    'eType' => $exam->eType,
                    'eDuration_minutes' => $exam->eDuration_minutes,
                ],
                'sections' => $sections,
                'total_questions' => $exam->questions->count(),
                'total_points' => $exam->questions->sum('qPoints'),
            ]
        ]);
    }

    /**
     * POST /api/teacher/exams/{id}/clone
     * Nhân bản đề thi
     */
    /**
     * @OA\Post(
     *     path="/teacher/exams/{id}/clone",
     *     tags={"Exams"},
     *     summary="Clone exam",
     *     description="Create a copy of an existing exam with all questions and answers",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="eTitle", type="string", example="Copy of Original Exam"),
     *             @OA\Property(property="eDescription", type="string", example="Cloned exam description")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Exam cloned successfully"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     */
    public function clone(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $originalExam = Exam::where('eId', $id)
                           ->where('eTeacher_id', $user->uId)
                           ->with(['questions.answers'])
                           ->first();

        if (!$originalExam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        // Remove transaction for now to avoid savepoint issues in tests
        try {
            // Clone exam
            $newExam = Exam::create([
                'eTitle' => $request->eTitle ?? 'Copy of ' . $originalExam->eTitle,
                'eDescription' => $request->eDescription ?? $originalExam->eDescription,
                'eType' => $originalExam->eType,
                'eSkill' => $originalExam->eSkill,
                'eTeacher_id' => $user->uId,
                'eDuration_minutes' => $originalExam->eDuration_minutes,
                'eIs_private' => $originalExam->eIs_private,
                'eSource_type' => 'manual',
                'template_id' => $originalExam->template_id,
                'eParent_exam_id' => $originalExam->eId, // Set parent exam ID
            ]);

            // Clone questions and answers
            foreach ($originalExam->questions as $originalQuestion) {
                $newQuestion = Question::create([
                    'exam_id' => $newExam->eId,
                    'qContent' => $originalQuestion->qContent,
                    'qPoints' => $originalQuestion->qPoints,
                    'qMedia_url' => $originalQuestion->qMedia_url,
                    'qTranscript' => $originalQuestion->qTranscript,
                    'qExplanation' => $originalQuestion->qExplanation,
                    'qListen_limit' => $originalQuestion->qListen_limit ?? 1,
                ]);

                // Clone answers
                foreach ($originalQuestion->answers as $originalAnswer) {
                    Answer::create([
                        'question_id' => $newQuestion->qId,
                        'aContent' => $originalAnswer->aContent,
                        'aIs_correct' => $originalAnswer->aIs_correct,
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'examId' => $newExam->eId,
                    'message' => 'Nhân bản đề thi thành công',
                    'cloned_questions' => $originalExam->questions->count(),
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi nhân bản đề thi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/teacher/exams/{id}/preview
     * Xem trước đề thi
     */
    /**
     * @OA\Get(
     *     path="/teacher/exams/{id}/preview",
     *     tags={"Exams"},
     *     summary="Preview exam",
     *     description="Get exam preview as students would see it",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Exam preview retrieved successfully"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     */
    public function preview(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->with(['questions.answers'])
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        // Format for student view (hide correct answers)
        $previewQuestions = $exam->questions->map(function($question) {
            return [
                'qId' => $question->qId,
                'qContent' => $question->qContent,
                'qPoints' => $question->qPoints,
                'qMedia_url' => $question->qMedia_url,
                'qTranscript' => $question->qTranscript,
                'qListen_limit' => $question->qListen_limit,
                'answers' => $question->answers->map(function($answer) {
                    return [
                        'aId' => $answer->aId,
                        'aContent' => $answer->aContent,
                        // Hide correct answer in preview
                    ];
                }),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'exam' => [
                    'eId' => $exam->eId,
                    'eTitle' => $exam->eTitle,
                    'eDescription' => $exam->eDescription,
                    'eType' => $exam->eType,
                    'eSkill' => $exam->eSkill,
                    'eDuration_minutes' => $exam->eDuration_minutes,
                ],
                'questions' => $previewQuestions,
                'total_questions' => $exam->questions->count(),
                'total_points' => $exam->questions->sum('qPoints'),
                'estimated_time' => $exam->eDuration_minutes . ' phút',
            ]
        ]);
    }

    /**
     * POST /api/teacher/exams/{id}/publish
     * Xuất bản đề thi
     */
    /**
     * @OA\Post(
     *     path="/teacher/exams/{id}/publish",
     *     tags={"Exams"},
     *     summary="Publish exam",
     *     description="Publish exam to make it available for assignments",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Exam published successfully"),
     *     @OA\Response(response=400, description="Exam cannot be published"),
     *     @OA\Response(response=404, description="Exam not found")
     * )
     */
    public function publish(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $id)
                   ->where('eTeacher_id', $user->uId)
                   ->with('questions')
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        // Validate exam can be published
        $validationErrors = [];

        if ($exam->questions->count() === 0) {
            $validationErrors[] = 'Đề thi phải có ít nhất 1 câu hỏi.';
        }

        if (!$exam->eTitle) {
            $validationErrors[] = 'Đề thi phải có tiêu đề.';
        }

        if (!$exam->eDuration_minutes || $exam->eDuration_minutes <= 0) {
            $validationErrors[] = 'Đề thi phải có thời gian làm bài hợp lệ.';
        }

        if (!empty($validationErrors)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xuất bản đề thi.',
                'errors' => $validationErrors
            ], 400);
        }

        // Update exam status
        $exam->update([
            'eStatus' => 'published',
            'eIs_private' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Xuất bản đề thi thành công',
                'exam_id' => $exam->eId,
                'questions_count' => $exam->questions->count(),
            ]
        ]);
    }

    /**
     * Helper method to organize questions by sections
     */
    private function organizeQuestionsBySection($exam)
    {
        $sections = [];
        
        // Default section structure based on exam type
        if ($exam->eType === 'VSTEP') {
            $sections = [
                'listening' => [
                    'name' => 'Listening', 
                    'questions' => [], 
                    'duration' => 40,
                    'total_questions' => 35,
                    'parts' => [
                        ['name' => 'Part 1: Announcements', 'questions' => 8, 'description' => 'Short announcements and instructions'],
                        ['name' => 'Part 2: Dialogues', 'questions' => 12, 'description' => 'Conversations between two or more people'],
                        ['name' => 'Part 3: Lectures', 'questions' => 15, 'description' => 'Academic lectures and presentations']
                    ]
                ],
                'reading' => [
                    'name' => 'Reading', 
                    'questions' => [], 
                    'duration' => 60,
                    'total_questions' => 40,
                    'parts' => [
                        ['name' => 'Passage 1', 'questions' => 10, 'description' => 'Short factual text (400-500 words)'],
                        ['name' => 'Passage 2', 'questions' => 10, 'description' => 'Descriptive or narrative text (400-500 words)'],
                        ['name' => 'Passage 3', 'questions' => 10, 'description' => 'Argumentative text (500-600 words)'],
                        ['name' => 'Passage 4', 'questions' => 10, 'description' => 'Academic text (600-700 words)']
                    ]
                ],
                'writing' => [
                    'name' => 'Writing', 
                    'questions' => [], 
                    'duration' => 60,
                    'total_questions' => 2,
                    'parts' => [
                        ['name' => 'Task 1: Letter/Email', 'questions' => 1, 'description' => 'Write a letter or email (150 words minimum)', 'weight' => 33.33],
                        ['name' => 'Task 2: Essay', 'questions' => 1, 'description' => 'Write an argumentative essay (250 words minimum)', 'weight' => 66.67]
                    ]
                ],
                'speaking' => [
                    'name' => 'Speaking', 
                    'questions' => [], 
                    'duration' => 12,
                    'total_questions' => 3,
                    'parts' => [
                        ['name' => 'Part 1: Social Interaction', 'questions' => 1, 'description' => 'Answer questions about familiar topics (3 minutes)'],
                        ['name' => 'Part 2: Solution Discussion', 'questions' => 1, 'description' => 'Choose and explain a solution (4 minutes)'],
                        ['name' => 'Part 3: Topic Development', 'questions' => 1, 'description' => 'Develop a topic with follow-ups (5 minutes)']
                    ]
                ]
            ];
        } elseif ($exam->eType === 'IELTS') {
            $sections = [
                'listening' => ['name' => 'Listening', 'questions' => [], 'duration' => 30],
                'reading' => ['name' => 'Reading', 'questions' => [], 'duration' => 60],
                'writing' => ['name' => 'Writing', 'questions' => [], 'duration' => 60],
                'speaking' => ['name' => 'Speaking', 'questions' => [], 'duration' => 15],
            ];
        } else {
            // General exam - single section
            $sections = [
                $exam->eSkill => ['name' => ucfirst($exam->eSkill), 'questions' => [], 'duration' => $exam->eDuration_minutes],
            ];
        }

        // Distribute questions to sections based on qSection field
        foreach ($exam->questions as $question) {
            $sectionKey = strtolower($question->qSection ?? $exam->eSkill);
            
            // Map section names to keys
            if (strpos($sectionKey, 'listening') !== false || strpos($sectionKey, 'announcement') !== false || strpos($sectionKey, 'dialogue') !== false || strpos($sectionKey, 'lecture') !== false) {
                $sectionKey = 'listening';
            } elseif (strpos($sectionKey, 'reading') !== false || strpos($sectionKey, 'passage') !== false) {
                $sectionKey = 'reading';
            } elseif (strpos($sectionKey, 'writing') !== false || strpos($sectionKey, 'task') !== false) {
                $sectionKey = 'writing';
            } elseif (strpos($sectionKey, 'speaking') !== false || strpos($sectionKey, 'part') !== false) {
                $sectionKey = 'speaking';
            }
            
            if (isset($sections[$sectionKey])) {
                $sections[$sectionKey]['questions'][] = $question;
            }
        }

        // Calculate statistics for each section
        foreach ($sections as $sectionKey => &$section) {
            $section['question_count'] = count($section['questions']);
            $section['total_points'] = collect($section['questions'])->sum('qPoints');
        }

        return $sections;
    }

    /* ========================================
     * ADMIN METHODS - Exam Moderation
     * ======================================== */

    /**
     * GET /api/admin/exams
     * Kiểm duyệt đề thi (Admin only)
     */
    public function adminExams(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $query = Exam::with(['teacher'])
                    ->withCount('questions');

        // Filter by status
        if ($request->has('is_private')) {
            $query->where('eIs_private', $request->is_private);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('eType', $request->type);
        }

        // Filter by skill
        if ($request->has('skill')) {
            $query->where('eSkill', $request->skill);
        }

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('eTeacher_id', $request->teacher_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('eTitle', 'LIKE', "%{$search}%")
                  ->orWhere('eDescription', 'LIKE', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'eCreated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 20);
        $exams = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $exams
        ]);
    }

    /**
     * GET /api/admin/exams/{id}
     * Xem chi tiết đề thi (Admin)
     */
    public function adminExamDetail(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $exam = Exam::with(['teacher', 'questions.answers', 'template'])
                   ->withCount('questions')
                   ->where('eId', $id)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đề thi.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $exam
        ]);
    }

    /**
     * POST /api/admin/exams/{id}/approve
     * Duyệt đề thi
     */
    public function approveExam(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền duyệt đề thi.'
            ], 403);
        }

        $exam = Exam::where('eId', $id)->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đề thi.'
            ], 404);
        }

        if (!$exam->eIs_private) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đề thi đã được duyệt rồi.'
            ], 400);
        }

        $exam->update([
            'eIs_private' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Duyệt đề thi thành công.',
            'data' => [
                'exam_id' => $exam->eId,
                'exam_title' => $exam->eTitle,
                'approved_by' => $user->uName,
                'approved_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * POST /api/admin/exams/{id}/reject
     * Từ chối đề thi
     */
    public function rejectExam(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền từ chối đề thi.'
            ], 403);
        }

        $exam = Exam::where('eId', $id)->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đề thi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng nhập lý do từ chối.',
                'errors' => $validator->errors()
            ], 400);
        }

        // For now, we'll keep it private and add a note in description
        $exam->update([
            'eIs_private' => true,
            'eDescription' => ($exam->eDescription ?? '') . "\n\n[ADMIN REJECTED: " . $request->reason . "]"
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Từ chối đề thi thành công.',
            'data' => [
                'exam_id' => $exam->eId,
                'exam_title' => $exam->eTitle,
                'reason' => $request->reason,
                'rejected_by' => $user->uName,
                'rejected_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * DELETE /api/admin/exams/{id}
     * Xóa đề thi (Admin)
     */
    public function adminDeleteExam(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền xóa đề thi.'
            ], 403);
        }

        $exam = Exam::where('eId', $id)->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đề thi.'
            ], 404);
        }

        // Check if exam is being used in assignments
        $assignmentCount = DB::table('test_assignments')->where('exam_id', $id)->count();
        if ($assignmentCount > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa đề thi đang được giao bài.',
                'data' => [
                    'assignments_count' => $assignmentCount
                ]
            ], 400);
        }

        $exam->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa đề thi thành công.'
        ]);
    }

    /**
     * GET /api/admin/exams/pending
     * Danh sách đề thi chờ duyệt
     */
    public function pendingExams(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $pendingExams = Exam::with(['teacher'])
                           ->withCount('questions')
                           ->where('eIs_private', true)
                           ->orderBy('eCreated_at', 'desc')
                           ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'pending_exams' => $pendingExams,
                'total_pending' => $pendingExams->count()
            ]
        ]);
    }

    /**
     * GET /api/admin/exams/statistics
     * Thống kê đề thi
     */
    public function examStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        // Exams statistics
        $totalExams = Exam::count();
        $publicExams = Exam::where('eIs_private', false)->count();
        $privateExams = Exam::where('eIs_private', true)->count();

        // Exams by type
        $examsByType = Exam::selectRaw('eType, COUNT(*) as count')
                          ->groupBy('eType')
                          ->pluck('count', 'eType');

        // Exams by skill
        $examsBySkill = Exam::selectRaw('eSkill, COUNT(*) as count')
                           ->groupBy('eSkill')
                           ->pluck('count', 'eSkill');

        // Exams by teacher (top 5)
        $examsByTeacher = Exam::with('teacher')
                             ->selectRaw('eTeacher_id, COUNT(*) as count')
                             ->groupBy('eTeacher_id')
                             ->orderByDesc('count')
                             ->limit(5)
                             ->get()
                             ->map(function($item) {
                                 return [
                                     'teacher_name' => $item->teacher->uName ?? 'Unknown',
                                     'exam_count' => $item->count
                                 ];
                             });

        // Recent activity
        $recentExams = Exam::where('eCreated_at', '>=', now()->subDays(7))->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'exams' => [
                    'total' => $totalExams,
                    'public' => $publicExams,
                    'private' => $privateExams,
                    'approval_rate' => $totalExams > 0 ? round(($publicExams / $totalExams) * 100, 2) : 0
                ],
                'by_type' => $examsByType,
                'by_skill' => $examsBySkill,
                'by_teacher' => $examsByTeacher,
                'activity' => [
                    'recent_exams' => $recentExams
                ]
            ]
        ]);
    }
}
