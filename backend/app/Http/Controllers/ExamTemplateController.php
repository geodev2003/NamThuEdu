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
            // Listening types
            'listening_announcement' => "You will hear a short announcement. Choose the best answer for question {$questionNumber}.",
            'listening_dialogue' => "You will hear a conversation between two people. Choose the best answer for question {$questionNumber}.",
            'listening_lecture' => "You will hear part of a lecture. Choose the best answer for question {$questionNumber}.",
            
            // Reading types  
            'reading_inference' => "Based on the passage, what can be inferred about...? (Question {$questionNumber})",
            'reading_main_idea' => "What is the main idea of the passage? (Question {$questionNumber})",
            'reading_vocabulary' => "The word '...' in line X is closest in meaning to: (Question {$questionNumber})",
            
            // Writing types
            'short_writing' => "Task 1: Write a letter/email (150 words minimum)\n\nYou have received the following email from your friend. Write a reply.\n\n[Sample email content would go here]",
            'essay' => "Task 2: Write an essay (250 words minimum)\n\nSome people believe that social media has a positive impact on society, while others think it has negative effects. Discuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            
            // Speaking types
            'speaking_interaction' => "Part 1: Social Interaction (3 minutes)\n\nLet's talk about your daily routine.\n- What time do you usually get up?\n- What do you usually have for breakfast?\n- How do you get to work/school?",
            'speaking_solution' => "Part 2: Solution Discussion (4 minutes)\n\nYour friend wants to improve their English but doesn't have much time. Here are three suggestions:\n1. Take an online course\n2. Watch English movies with subtitles\n3. Join an English conversation club\n\nWhich do you think is the best solution? Explain your choice.",
            'speaking_topic' => "Part 3: Topic Development (5 minutes)\n\nDescribe the advantages and disadvantages of living in a big city.\n\nYou have 1 minute to prepare and 3 minutes to speak. The examiner may ask follow-up questions.",
            
            // General types
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
            // Listening configs
            'listening_announcement' => [
                'audio_type' => 'announcement',
                'play_limit' => 2,
                'transcript_available' => true
            ],
            'listening_dialogue' => [
                'audio_type' => 'dialogue',
                'play_limit' => 2,
                'transcript_available' => true,
                'speakers' => 2
            ],
            'listening_lecture' => [
                'audio_type' => 'lecture',
                'play_limit' => 2,
                'transcript_available' => true,
                'academic_content' => true
            ],
            
            // Reading configs
            'reading_inference' => [
                'skill_type' => 'inference',
                'passage_length' => '400-700 words'
            ],
            'reading_main_idea' => [
                'skill_type' => 'main_idea',
                'passage_length' => '400-700 words'
            ],
            'reading_vocabulary' => [
                'skill_type' => 'vocabulary',
                'context_clues' => true
            ],
            
            // Writing configs
            'short_writing' => [
                'min_words' => 150,
                'task_type' => 'letter_email',
                'time_limit' => 20, // minutes
                'weight' => 33.33
            ],
            'essay' => [
                'min_words' => 250,
                'task_type' => 'argumentative',
                'time_limit' => 40, // minutes
                'weight' => 66.67
            ],
            
            // Speaking configs
            'speaking_interaction' => [
                'duration' => 3, // minutes
                'question_count' => '3-6',
                'preparation_time' => 0
            ],
            'speaking_solution' => [
                'duration' => 4, // minutes
                'options_count' => 3,
                'preparation_time' => 1 // minute
            ],
            'speaking_topic' => [
                'duration' => 5, // minutes (1 prep + 3 speak + 1 follow-up)
                'preparation_time' => 1, // minute
                'speaking_time' => 3, // minutes
                'follow_up' => true
            ],
            
            // General configs
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
            // Multiple choice types (Listening & Reading)
            case 'multiple_choice':
            case 'multiple_choice_cloze':
            case 'listening_announcement':
            case 'listening_dialogue':
            case 'listening_lecture':
            case 'reading_inference':
            case 'reading_main_idea':
            case 'reading_vocabulary':
                $this->createSampleAnswers($question);
                break;
                
            case 'true_false':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'True', 'aIs_correct' => true]);
                Answer::create(['question_id' => $question->qId, 'aContent' => 'False', 'aIs_correct' => false]);
                break;
                
            // Writing types - no predefined answers
            case 'essay':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'Sample essay response (250+ words)', 'aIs_correct' => true]);
                break;
                
            case 'short_writing':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'Sample letter/email response (150+ words)', 'aIs_correct' => true]);
                break;
                
            // Speaking types - no predefined answers
            case 'speaking_interaction':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'Sample speaking response for social interaction', 'aIs_correct' => true]);
                break;
                
            case 'speaking_solution':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'Sample solution discussion response', 'aIs_correct' => true]);
                break;
                
            case 'speaking_topic':
                Answer::create(['question_id' => $question->qId, 'aContent' => 'Sample topic development response', 'aIs_correct' => true]);
                break;
                
            // Fill-in types
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

    /* ========================================
     * ADMIN METHODS - Template Management
     * ======================================== */

    /**
     * GET /api/admin/exam-templates
     * Quản lý mẫu đề thi (Admin only)
     */
    public function adminTemplates(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $query = ExamTemplate::query();

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by level
        if ($request->has('level')) {
            $query->byLevel($request->level);
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('template_name', 'LIKE', "%{$search}%")
                  ->orWhere('template_code', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 20);
        $templates = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $templates
        ]);
    }

    /**
     * POST /api/admin/exam-templates
     * Tạo mẫu đề thi mới (Admin)
     */
    public function adminCreateTemplate(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền tạo mẫu đề thi.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'template_code' => 'required|string|max:50|unique:exam_templates,template_code',
            'template_name' => 'required|string|max:255',
            'category' => 'required|in:cambridge_young,cambridge_main,international,specialized',
            'level' => 'required|in:pre_a1,a1,a2,b1,b2,c1,c2',
            'age_group' => 'required|in:young_learners,adult',
            'total_duration_minutes' => 'required|integer|min:1',
            'skills' => 'required|array',
            'sections' => 'required|array',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $template = ExamTemplate::create([
            'template_code' => $request->template_code,
            'template_name' => $request->template_name,
            'category' => $request->category,
            'level' => $request->level,
            'age_group' => $request->age_group,
            'total_duration_minutes' => $request->total_duration_minutes,
            'skills' => json_encode($request->skills),
            'sections' => json_encode($request->sections),
            'description' => $request->description,
            'is_active' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo mẫu đề thi thành công.',
            'data' => $template
        ], 201);
    }

    /**
     * PUT /api/admin/exam-templates/{id}
     * Cập nhật mẫu đề thi (Admin)
     */
    public function adminUpdateTemplate(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền cập nhật mẫu đề thi.'
            ], 403);
        }

        $template = ExamTemplate::find($id);

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy mẫu đề thi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'template_code' => 'sometimes|required|string|max:50|unique:exam_templates,template_code,' . $id,
            'template_name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:cambridge_young,cambridge_main,international,specialized',
            'level' => 'sometimes|required|in:pre_a1,a1,a2,b1,b2,c1,c2',
            'age_group' => 'sometimes|required|in:young_learners,adult',
            'total_duration_minutes' => 'sometimes|required|integer|min:1',
            'skills' => 'sometimes|required|array',
            'sections' => 'sometimes|required|array',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = $request->only([
            'template_code', 'template_name', 'category', 'level', 'age_group',
            'total_duration_minutes', 'description', 'is_active'
        ]);

        if ($request->has('skills')) {
            $updateData['skills'] = json_encode($request->skills);
        }

        if ($request->has('sections')) {
            $updateData['sections'] = json_encode($request->sections);
        }

        $template->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật mẫu đề thi thành công.',
            'data' => $template
        ]);
    }

    /**
     * DELETE /api/admin/exam-templates/{id}
     * Xóa mẫu đề thi (Admin)
     */
    public function adminDeleteTemplate(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền xóa mẫu đề thi.'
            ], 403);
        }

        $template = ExamTemplate::find($id);

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy mẫu đề thi.'
            ], 404);
        }

        // Check if template is being used
        $examCount = Exam::where('template_id', $id)->count();
        if ($examCount > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa mẫu đề thi đang được sử dụng.',
                'data' => [
                    'exams_using_template' => $examCount
                ]
            ], 400);
        }

        $template->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa mẫu đề thi thành công.'
        ]);
    }

    /**
     * POST /api/admin/exam-templates/{id}/activate
     * Kích hoạt mẫu đề thi
     */
    public function activateTemplate(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền kích hoạt mẫu đề thi.'
            ], 403);
        }

        $template = ExamTemplate::find($id);

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy mẫu đề thi.'
            ], 404);
        }

        $template->update(['is_active' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kích hoạt mẫu đề thi thành công.',
            'data' => [
                'template_id' => $template->id,
                'template_name' => $template->template_name,
                'is_active' => true
            ]
        ]);
    }

    /**
     * POST /api/admin/exam-templates/{id}/deactivate
     * Vô hiệu hóa mẫu đề thi
     */
    public function deactivateTemplate(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền vô hiệu hóa mẫu đề thi.'
            ], 403);
        }

        $template = ExamTemplate::find($id);

        if (!$template) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy mẫu đề thi.'
            ], 404);
        }

        $template->update(['is_active' => false]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vô hiệu hóa mẫu đề thi thành công.',
            'data' => [
                'template_id' => $template->id,
                'template_name' => $template->template_name,
                'is_active' => false
            ]
        ]);
    }

    /**
     * GET /api/admin/templates/statistics
     * Thống kê mẫu đề thi
     */
    public function templateStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        // Templates statistics
        $totalTemplates = ExamTemplate::count();
        $activeTemplates = ExamTemplate::where('is_active', true)->count();
        $inactiveTemplates = ExamTemplate::where('is_active', false)->count();

        // Templates by category
        $templatesByCategory = ExamTemplate::selectRaw('category, COUNT(*) as count')
                                         ->groupBy('category')
                                         ->pluck('count', 'category');

        // Templates by level
        $templatesByLevel = ExamTemplate::selectRaw('level, COUNT(*) as count')
                                      ->groupBy('level')
                                      ->pluck('count', 'level');

        // Usage statistics
        $templatesUsage = ExamTemplate::withCount('exams')
                                    ->orderByDesc('exams_count')
                                    ->limit(5)
                                    ->get()
                                    ->map(function($template) {
                                        return [
                                            'template_name' => $template->template_name,
                                            'usage_count' => $template->exams_count
                                        ];
                                    });

        return response()->json([
            'status' => 'success',
            'data' => [
                'templates' => [
                    'total' => $totalTemplates,
                    'active' => $activeTemplates,
                    'inactive' => $inactiveTemplates,
                    'activation_rate' => $totalTemplates > 0 ? round(($activeTemplates / $totalTemplates) * 100, 2) : 0
                ],
                'by_category' => $templatesByCategory,
                'by_level' => $templatesByLevel,
                'usage' => $templatesUsage
            ]
        ]);
    }
}