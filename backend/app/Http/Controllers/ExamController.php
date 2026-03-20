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

        DB::beginTransaction();
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
                    'qListen_limit' => $questionData['qListen_limit'] ?? null,
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

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'questionsAdded' => $questionsAdded
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi thêm câu hỏi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
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
}
