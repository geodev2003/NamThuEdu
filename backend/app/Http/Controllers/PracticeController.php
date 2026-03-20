<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PracticeSession;
use App\Models\QuestionBank;
use App\Models\ExamTemplate;
use App\Services\PracticeService;

/**
 * @OA\Tag(
 *     name="Practice",
 *     description="API endpoints for practice sessions and question banks"
 * )
 */
class PracticeController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/practice-sessions",
     *     tags={"Practice"},
     *     summary="Get teacher's practice sessions",
     *     description="Retrieve all practice sessions created by the teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Filter by practice type",
     *         @OA\Schema(type="string", enum={"topic_based", "skill_based", "random", "template_based", "custom"})
     *     ),
     *     @OA\Parameter(
     *         name="skill",
     *         in="query",
     *         description="Filter by target skill",
     *         @OA\Schema(type="string", enum={"listening", "reading", "writing", "speaking"})
     *     ),
     *     @OA\Response(response=200, description="Practice sessions retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
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

        $query = PracticeSession::where('ps_teacher_id', $user->uId)
                                ->with(['exam' => function($q) {
                                    $q->select('eId', 'eTitle', 'eDuration_minutes', 'eCreated_at');
                                }]);

        // Filters
        if ($request->has('type')) {
            $query->where('ps_type', $request->type);
        }

        if ($request->has('skill')) {
            $query->where('ps_target_skill', $request->skill);
        }

        if ($request->has('purpose')) {
            $query->where('ps_purpose', $request->purpose);
        }

        if ($request->has('difficulty')) {
            $query->where('ps_difficulty', $request->difficulty);
        }

        $sessions = $query->orderBy('ps_created_at', 'desc')
                         ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $sessions
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/practice-sessions/topic-based",
     *     tags={"Practice"},
     *     summary="Create topic-based practice session",
     *     description="Create a practice session focused on specific topic",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","skill","topic"},
     *             @OA\Property(property="title", type="string", example="Grammar Practice - Present Tense"),
     *             @OA\Property(property="description", type="string", example="Practice session for present tense grammar"),
     *             @OA\Property(property="skill", type="string", enum={"listening","reading","writing","speaking"}),
     *             @OA\Property(property="topic", type="string", example="grammar"),
     *             @OA\Property(property="difficulty", type="string", enum={"easy","medium","hard"}, example="medium"),
     *             @OA\Property(property="duration", type="integer", example=30),
     *             @OA\Property(property="question_count", type="integer", example=15),
     *             @OA\Property(property="purpose", type="string", enum={"review","practice","drill","mock_test","homework"})
     *         )
     *     ),
     *     @OA\Response(response=201, description="Practice session created successfully"),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function createTopicBased(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'skill' => 'required|in:listening,reading,writing,speaking',
            'topic' => 'required|string|max:100',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'duration' => 'nullable|integer|min:5|max:180',
            'question_count' => 'nullable|integer|min:5|max:50',
            'purpose' => 'nullable|in:review,practice,drill,mock_test,homework',
            'exam_type' => 'nullable|in:VSTEP,IELTS_ACADEMIC,IELTS_GENERAL,GENERAL',
            'is_private' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $data = array_merge($request->all(), ['teacher_id' => $user->uId]);
            $result = PracticeService::createTopicBasedPractice($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo bài ôn tập theo chủ đề thành công.',
                'data' => [
                    'practice_session_id' => $result['practice_session']->ps_id,
                    'exam_id' => $result['exam']->eId,
                    'questions_count' => $result['questions_count']
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi tạo bài ôn tập.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/teacher/practice-sessions/template-based",
     *     tags={"Practice"},
     *     summary="Create template-based practice session",
     *     description="Create a practice session based on existing template",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"template_id"},
     *             @OA\Property(property="template_id", type="integer", example=1),
     *             @OA\Property(property="title", type="string", example="VSTEP Listening Practice"),
     *             @OA\Property(property="description", type="string", example="Practice based on VSTEP template"),
     *             @OA\Property(property="skill", type="string", enum={"listening","reading","writing","speaking"}),
     *             @OA\Property(property="difficulty", type="string", enum={"easy","medium","hard"}),
     *             @OA\Property(property="question_count", type="integer", example=20),
     *             @OA\Property(property="duration", type="integer", example=40)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Practice session created successfully"),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Template not found")
     * )
     */
    public function createTemplateBased(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'template_id' => 'required|exists:exam_templates,id',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'skill' => 'nullable|in:listening,reading,writing,speaking',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'duration' => 'nullable|integer|min:5|max:300',
            'question_count' => 'nullable|integer|min:5|max:100',
            'purpose' => 'nullable|in:review,practice,drill,mock_test,homework',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $data = array_merge($request->all(), ['teacher_id' => $user->uId]);
            $result = PracticeService::createTemplateBasedPractice($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo bài ôn tập từ template thành công.',
                'data' => [
                    'practice_session_id' => $result['practice_session']->ps_id,
                    'exam_id' => $result['exam']->eId,
                    'template_name' => $result['template']->template_name,
                    'questions_count' => $result['questions_count']
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi tạo bài ôn tập.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/teacher/practice-sessions/random",
     *     tags={"Practice"},
     *     summary="Create random practice session",
     *     description="Create a practice session with random questions",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Random Practice Session"),
     *             @OA\Property(property="description", type="string", example="Mixed questions for general practice"),
     *             @OA\Property(property="skill", type="string", enum={"listening","reading","writing","speaking"}),
     *             @OA\Property(property="difficulty", type="string", enum={"easy","medium","hard","mixed"}),
     *             @OA\Property(property="duration", type="integer", example=30),
     *             @OA\Property(property="question_count", type="integer", example=15),
     *             @OA\Property(property="exam_type", type="string", enum={"VSTEP","IELTS_ACADEMIC","IELTS_GENERAL","GENERAL"})
     *         )
     *     ),
     *     @OA\Response(response=201, description="Practice session created successfully")
     * )
     */
    public function createRandom(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'skill' => 'nullable|in:listening,reading,writing,speaking',
            'difficulty' => 'nullable|in:easy,medium,hard,mixed',
            'duration' => 'nullable|integer|min:5|max:120',
            'question_count' => 'nullable|integer|min:5|max:30',
            'purpose' => 'nullable|in:review,practice,drill,mock_test,homework',
            'exam_type' => 'nullable|in:VSTEP,IELTS_ACADEMIC,IELTS_GENERAL,GENERAL',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $data = array_merge($request->all(), ['teacher_id' => $user->uId]);
            $result = PracticeService::createRandomPractice($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo bài ôn tập ngẫu nhiên thành công.',
                'data' => [
                    'practice_session_id' => $result['practice_session']->ps_id,
                    'exam_id' => $result['exam']->eId,
                    'questions_count' => $result['questions_count']
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi tạo bài ôn tập.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/teacher/practice-sessions/{id}",
     *     tags={"Practice"},
     *     summary="Get practice session details",
     *     description="Retrieve detailed information about a practice session",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Practice session details retrieved successfully"),
     *     @OA\Response(response=404, description="Practice session not found")
     * )
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

        $practiceSession = PracticeSession::with(['exam.questions.answers'])
                                         ->where('ps_id', $id)
                                         ->where('ps_teacher_id', $user->uId)
                                         ->first();

        if (!$practiceSession) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài ôn tập.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $practiceSession
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/practice-sessions/statistics",
     *     tags={"Practice"},
     *     summary="Get practice statistics",
     *     description="Get statistics about teacher's practice sessions",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Statistics retrieved successfully")
     * )
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $filters = $request->only(['type', 'skill', 'purpose']);
        $statistics = PracticeService::getPracticeStatistics($user->uId, $filters);

        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/templates",
     *     tags={"Practice"},
     *     summary="Get available templates",
     *     description="Get list of available exam templates for creating practice sessions",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Templates retrieved successfully")
     * )
     */
    public function getTemplates(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $templates = ExamTemplate::select('id', 'template_code', 'template_name', 'category', 'level', 'total_duration_minutes', 'skills', 'description')
                                ->orderBy('category')
                                ->orderBy('template_name')
                                ->get();

        return response()->json([
            'status' => 'success',
            'data' => $templates
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/teacher/practice-sessions/{id}",
     *     tags={"Practice"},
     *     summary="Delete practice session",
     *     description="Delete a practice session and its associated exam",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Practice session deleted successfully"),
     *     @OA\Response(response=404, description="Practice session not found")
     * )
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

        $practiceSession = PracticeSession::where('ps_id', $id)
                                         ->where('ps_teacher_id', $user->uId)
                                         ->first();

        if (!$practiceSession) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài ôn tập.'
            ], 404);
        }

        // Delete associated exam and its questions/answers (cascade)
        if ($practiceSession->exam) {
            $practiceSession->exam->delete();
        }

        $practiceSession->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa bài ôn tập thành công.'
        ]);
    }
}