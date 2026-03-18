<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\ExamTemplate;
use App\Models\TemplateSection;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;

class ExamTemplateController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/exam-templates",
     *     tags={"Exam Templates"},
     *     summary="Get all exam templates",
     *     description="Get list of all available exam templates",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="category",
     *         in="query",
     *         description="Filter by category",
     *         @OA\Schema(type="string", enum={"cambridge_young", "cambridge_main", "international", "specialized"})
     *     ),
     *     @OA\Parameter(
     *         name="level",
     *         in="query", 
     *         description="Filter by level",
     *         @OA\Schema(type="string", enum={"pre_a1", "a1", "a2", "b1", "b2", "c1", "c2"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Templates retrieved successfully"
     *     )
     * )
     * 
     * GET /api/teacher/exam-templates
     * Lấy danh sách tất cả exam templates
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

        $query = ExamTemplate::active();

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by level
        if ($request->has('level')) {
            $query->byLevel($request->level);
        }

        // Filter by age group
        if ($request->has('age_group')) {
            $query->byAgeGroup($request->age_group);
        }

        $templates = $query->orderBy('category')
                          ->orderBy('level')
                          ->get();

        // Group by category for better organization
        $groupedTemplates = $templates->groupBy('category');

        return response()->json([
            'status' => 'success',
            'data' => [
                'templates' => $templates,
                'grouped' => $groupedTemplates,
                'categories' => [
                    'cambridge_young' => 'Cambridge Young Learners',
                    'cambridge_main' => 'Cambridge Main Suite', 
                    'international' => 'International Tests',
                    'specialized' => 'Specialized Tests'
                ]
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/exam-templates/{category}",
     *     tags={"Exam Templates"},
     *     summary="Get templates by category",
     *     description="Get exam templates filtered by category",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=200, description="Templates retrieved successfully")
     * )
     * 
     * GET /api/teacher/exam-templates/{category}
     * Lấy templates theo category
     */
    public function byCategory(Request $request, $category)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $templates = ExamTemplate::active()
                                ->byCategory($category)
                                ->orderBy('level')
                                ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'category' => $category,
                'templates' => $templates
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/exam-templates/{id}",
     *     tags={"Exam Templates"},
     *     summary="Get template details",
     *     description="Get detailed information about a specific exam template",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Template details retrieved successfully"),
     *     @OA\Response(response=404, description="Template not found")
     * )
     * 
     * GET /api/teacher/exam-templates/{id}
     * Lấy chi tiết template
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

        $template = ExamTemplate::with('templateSections')
                               ->where('id', $id)
                               ->where('is_active', true)
                               ->first();

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy template.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $template
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/exam-templates/{id}/sections",
     *     tags={"Exam Templates"},
     *     summary="Get template sections",
     *     description="Get sections of a specific exam template",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Template sections retrieved successfully")
     * )
     * 
     * GET /api/teacher/exam-templates/{id}/sections
     * Lấy sections của template
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

        $template = ExamTemplate::where('id', $id)
                               ->where('is_active', true)
                               ->first();

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy template.'
            ], 404);
        }

        $sections = TemplateSection::where('template_id', $id)
                                  ->ordered()
                                  ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'template' => $template,
                'sections' => $sections
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/exams/from-template/{templateId}",
     *     tags={"Exam Templates"},
     *     summary="Create exam from template",
     *     description="Create a new exam based on a template",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="templateId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"eTitle"},
     *             @OA\Property(property="eTitle", type="string", example="VSTEP Practice Test - Class A"),
     *             @OA\Property(property="eDescription", type="string", example="Practice test based on VSTEP template"),
     *             @OA\Property(property="eIs_private", type="boolean", example=true),
     *             @OA\Property(property="customize_duration", type="boolean", example=false),
     *             @OA\Property(property="custom_duration_minutes", type="integer", example=120)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Exam created from template successfully"),
     *     @OA\Response(response=404, description="Template not found")
     * )
     * 
     * POST /api/teacher/exams/from-template/{templateId}
     * Tạo exam từ template
     */
    public function createFromTemplate(Request $request, $templateId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $template = ExamTemplate::where('id', $templateId)
                               ->where('is_active', true)
                               ->first();

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy template.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'eTitle' => 'required|string|max:255',
            'eDescription' => 'nullable|string',
            'eIs_private' => 'nullable|boolean',
            'customize_duration' => 'nullable|boolean',
            'custom_duration_minutes' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Determine duration
            $duration = $template->total_duration_minutes;
            if ($request->customize_duration && $request->custom_duration_minutes) {
                $duration = $request->custom_duration_minutes;
            }

            // Determine primary skill (first skill in template)
            $primarySkill = $template->skills[0] ?? 'listening';

            // Create exam from template
            $exam = Exam::create([
                'template_id' => $template->id,
                'eTitle' => $request->eTitle,
                'eDescription' => $request->eDescription ?? $template->description,
                'eType' => $template->template_code,
                'eSkill' => $primarySkill,
                'eTeacher_id' => $user->uId,
                'eDuration_minutes' => $duration,
                'eIs_private' => $request->eIs_private ?? false,
                'eSource_type' => 'template',
            ]);

            // Create sample questions based on template structure
            $this->createSampleQuestions($exam, $template);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'examId' => $exam->eId,
                    'template' => $template->template_name,
                    'message' => 'Tạo bài thi từ template thành công'
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo bài thi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create sample questions based on template structure
     */
    private function createSampleQuestions($exam, $template)
    {
        $questionOrder = 1;

        foreach ($template->sections as $section) {
            $sectionName = $section['name'];
            $parts = $section['parts'] ?? [];

            if (empty($parts)) {
                // Simple section without parts
                $this->createQuestionsForSection($exam, $sectionName, $section['questions'] ?? 5, $questionOrder);
                $questionOrder += $section['questions'] ?? 5;
            } else {
                // Section with parts
                foreach ($parts as $part) {
                    $partName = $sectionName . ' - ' . $part['name'];
                    $questionCount = $part['questions'] ?? 5;
                    $questionType = $part['type'] ?? 'multiple_choice';
                    
                    $this->createQuestionsForPart($exam, $partName, $questionCount, $questionType, $questionOrder, $part);
                    $questionOrder += $questionCount;
                }
            }
        }
    }

    private function createQuestionsForSection($exam, $sectionName, $questionCount, &$questionOrder)
    {
        for ($i = 1; $i <= $questionCount; $i++) {
            $question = Question::create([
                'exam_id' => $exam->eId,
                'qContent' => "Sample question {$i} for {$sectionName}",
                'qType' => 'multiple_choice',
                'qSection' => $sectionName,
                'qSection_order' => $questionOrder,
                'qPoints' => 1,
                'qDifficulty' => 'medium'
            ]);

            // Create sample answers
            $this->createSampleAnswers($question);
            $questionOrder++;
        }
    }

    private function createQuestionsForPart($exam, $partName, $questionCount, $questionType, &$questionOrder, $partConfig)
    {
        for ($i = 1; $i <= $questionCount; $i++) {
            $question = Question::create([
                'exam_id' => $exam->eId,
                'qContent' => $this->generateSampleQuestionContent($questionType, $i, $partName),
                'qType' => $questionType,
                'qSection' => $partName,
                'qSection_order' => $questionOrder,
                'qPoints' => 1,
                'qDifficulty' => 'medium',
                'qConfig' => $this->getQuestionConfig($questionType, $partConfig)
            ]);

            // Create answers based on question type
            $this->createAnswersForQuestionType($question, $questionType);
            $questionOrder++;
        }
    }

    private function generateSampleQuestionContent($questionType, $questionNumber, $partName)
    {
        $samples = [
            'multiple_choice' => "Choose the correct answer for question {$questionNumber} in {$partName}.",
            'fill_blank' => "Fill in the blank for question {$questionNumber}: The cat is _____ the table.",
            'true_false' => "True or False: This is question {$questionNumber} in {$partName}.",
            'matching' => "Match the items for question {$questionNumber}.",
            'matching_lines' => "Draw a line to match for question {$questionNumber}.",
            'coloring' => "Color the correct item for question {$questionNumber}.",
            'short_answer' => "Write a short answer for question {$questionNumber}.",
            'speaking_identification' => "What is this? (Question {$questionNumber})",
            'speaking_comparison' => "Find the difference (Question {$questionNumber})"
        ];

        return $samples[$questionType] ?? "Sample question {$questionNumber} for {$partName}";
    }

    private function getQuestionConfig($questionType, $partConfig)
    {
        $configs = [
            'coloring' => ['colors' => ['red', 'blue', 'green', 'yellow']],
            'matching_lines' => ['items_count' => 5],
            'speaking_identification' => ['time_limit' => 30],
            'speaking_comparison' => ['differences_count' => 4]
        ];

        return $configs[$questionType] ?? null;
    }

    private function createAnswersForQuestionType($question, $questionType)
    {
        switch ($questionType) {
            case 'multiple_choice':
            case 'multiple_choice_cloze':
                $this->createSampleAnswers($question);
                break;
                
            case 'true_false':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'True', 'aIs_correct' => true]);
                Answer::create(['question_id' => $question->qId, 'aContent' => 'False', 'aIs_correct' => false]);
                break;
                
            case 'fill_blank':
            case 'short_answer':
            case 'word_completion':
            case 'open_cloze':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'sample answer', 'aIs_correct' => true]);
                break;
                
            default:
                $this->createSampleAnswers($question);
        }
    }

    private function createSampleAnswers($question)
    {
        $answers = [
            ['content' => 'Option A', 'correct' => true],
            ['content' => 'Option B', 'correct' => false],
            ['content' => 'Option C', 'correct' => false],
            ['content' => 'Option D', 'correct' => false]
        ];

        foreach ($answers as $answer) {
            Answer::create([
                'question_id' => $question->qId,
                'aContent' => $answer['content'],
                'aIs_correct' => $answer['correct']
            ]);
        }
    }
}