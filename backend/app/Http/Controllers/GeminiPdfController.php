<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * GeminiPdfController
 * ─────────────────────
 * Upload PDF (kể cả PDF scan/ảnh) lên Gemini Files API,
 * rồi yêu cầu Gemini extract cấu trúc đề IELTS thành JSON.
 *
 * Route: POST /api/teacher/ielts/parse-pdf
 * Auth:  role:teacher
 * Body:  multipart/form-data
 *   - file: file PDF
 *   - skill: listening | reading | writing | speaking
 *   - test_type: Academic | General Training
 */
class GeminiPdfController extends Controller
{
    private $apiKey;
    private $uploadBaseUrl = 'https://generativelanguage.googleapis.com/upload/v1beta/files';
    private $generateUrl   = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    /**
     * Danh sách model fallback theo thứ tự ưu tiên khi model chính quá tải (503/429).
     * Lưu ý: gemini-1.5-* đã bị Google deprecate (trả 404 trên v1beta).
     * Chỉ dùng các model 2.x đang được hỗ trợ.
     */
    private $modelFallbacks = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
    ];

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    public function parsePdf(Request $request)
    {
        // Validate
        $request->validate([
            'file'      => 'required|file|mimes:pdf|max:20480', // 20MB max
            'skill'     => 'required|in:listening,reading,writing,speaking',
            'test_type' => 'required|in:Academic,General Training',
        ]);

        if (empty($this->apiKey) || $this->apiKey === 'PASTE_YOUR_NEW_KEY_HERE') {
            return response()->json([
                'success' => false,
                'message' => 'GEMINI_API_KEY chưa được cấu hình trong .env backend.',
            ], 500);
        }

        $file     = $request->file('file');
        $skill    = $request->input('skill');
        $testType = $request->input('test_type');

        try {
            // Step 1: Upload file lên Gemini Files API
            $fileUri = $this->uploadToGemini($file);

            // Step 2: Gọi generateContent với file URI + prompt
            $prompt  = $this->buildPrompt($skill, $testType);
            $result  = $this->generateContent($fileUri, $prompt);

            // Step 3: Post-process — merge sections trùng sectionNumber
            $result = $this->postProcess($result, $skill);

            return response()->json([
                'success' => true,
                'data'    => $result,
            ]);

        } catch (\Exception $e) {
            Log::error('Gemini PDF parse error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Gợi ý đáp án IELTS từ transcript (Listening) hoặc passage (Reading) bằng Groq.
     * Dùng để giúp giáo viên import xong có sẵn đáp án "tham khảo" — vẫn cảnh báo
     * có thể sai và yêu cầu giáo viên review.
     *
     * Route: POST /api/teacher/ielts/suggest-answers
     * Body: {
     *   skill: 'listening'|'reading',
     *   context: string,            // transcript hoặc passage text
     *   questions: [{ number, text, type, options? }]
     * }
     * Return: { success, answers: [{ number, answer, confidence }], warning }
     */
    public function suggestIeltsAnswers(Request $request)
    {
        $request->validate([
            'skill'     => 'required|string|in:listening,reading',
            'context'   => 'required|string|max:30000',
            'questions' => 'required|array|min:1|max:50',
            'questions.*.number' => 'required|numeric',
            'questions.*.text'   => 'required|string',
            'questions.*.type'   => 'nullable|string',
            'questions.*.options' => 'nullable|array',
        ]);

        $groqKey = config('services.groq.api_key');
        if (empty($groqKey)) {
            return response()->json([
                'success' => false,
                'message' => 'GROQ_API_KEY chưa được cấu hình.',
            ], 500);
        }

        try {
            $prompt = $this->buildSuggestAnswersPrompt(
                $request->input('skill'),
                $request->input('context'),
                $request->input('questions')
            );
            $result = $this->callGroqJson($prompt, $groqKey);

            $answers = $result['answers'] ?? [];
            if (!is_array($answers)) {
                throw new \Exception('Groq trả về cấu trúc answers không hợp lệ.');
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'answers' => array_values($answers),
                    'warning' => 'Đáp án do AI gợi ý — vui lòng kiểm tra lại trước khi xuất bản.',
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Groq suggest-answers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function buildSuggestAnswersPrompt(string $skill, string $context, array $questions): string
    {
        $skillLabel = $skill === 'listening' ? 'Listening transcript' : 'Reading passage';
        $qLines = [];
        foreach ($questions as $q) {
            $num = $q['number'] ?? '?';
            $text = trim($q['text'] ?? '');
            $type = strtolower($q['type'] ?? '');
            $line = "Q{$num} [{$type}]: {$text}";
            if (!empty($q['options']) && is_array($q['options'])) {
                $opts = [];
                foreach ($q['options'] as $k => $v) {
                    if ($v) $opts[] = "{$k}. {$v}";
                }
                if ($opts) $line .= "\n   Options: " . implode(' | ', $opts);
            }
            $qLines[] = $line;
        }
        $questionsBlock = implode("\n", $qLines);

        return "You are an expert IELTS test answer key generator.

Below is an IELTS {$skillLabel} and a list of questions. Determine the BEST answer for each question STRICTLY based on the {$skillLabel} content.

Rules:
1. For multiple-choice questions: return the letter (A, B, C, or D) that matches the {$skillLabel}.
2. For gap-fill / table-completion / sentence-completion / form-completion / note-completion / short-answer: return the EXACT word(s) or number copied verbatim from the {$skillLabel} (max 3 words unless instruction says otherwise).
3. For TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN: return one of those values exactly.
4. For matching: return the matching letter or label.
5. If you cannot find the answer in the {$skillLabel}, return empty string '' for that question (do NOT guess wildly).
6. Provide a 'confidence' value: 'high' | 'medium' | 'low' for each answer.
7. Keep numbers as digits (e.g., '5', '1990', not 'five').
8. Keep words lowercase unless they're proper nouns.

Return ONLY valid JSON in this exact format:
{
  \"answers\": [
    { \"number\": 1, \"answer\": \"...\", \"confidence\": \"high|medium|low\" },
    { \"number\": 2, \"answer\": \"...\", \"confidence\": \"high|medium|low\" }
  ]
}

{$skillLabel}:
\"\"\"
{$context}
\"\"\"

Questions:
{$questionsBlock}";
    }

    /**
     * Diarize transcript: dùng Groq LLM (free tier) phân tách speaker A/B
     * dựa trên ngữ nghĩa hội thoại — chính xác hơn pitch-based vì hiểu context.
     * Tiết kiệm Gemini API quota cho task PDF parsing.
     *
     * Route: POST /api/teacher/ielts/diarize-transcript
     * Body: { transcript: string, max_speakers?: 2|3 }
     * Return: { success, speaker_lines: string[] } — mỗi line dạng "A: ..." hoặc "B: ..."
     */
    public function diarizeTranscript(Request $request)
    {
        $request->validate([
            'transcript'   => 'required|string|max:50000',
            'max_speakers' => 'nullable|integer|min:2|max:4',
        ]);

        $groqKey = config('services.groq.api_key');
        if (empty($groqKey)) {
            return response()->json([
                'success' => false,
                'message' => 'GROQ_API_KEY chưa được cấu hình.',
            ], 500);
        }

        $transcript = trim($request->input('transcript'));
        $maxSpeakers = (int) $request->input('max_speakers', 2);

        if (strlen($transcript) < 20) {
            return response()->json([
                'success' => true,
                'data' => ['speaker_lines' => [$transcript]],
            ]);
        }

        try {
            $prompt = $this->buildDiarizationPrompt($transcript, $maxSpeakers);
            $result = $this->callGroqJson($prompt, $groqKey);

            $lines = $result['lines'] ?? [];
            if (!is_array($lines) || count($lines) === 0) {
                return response()->json([
                    'success' => true,
                    'data' => ['speaker_lines' => [$transcript]],
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => ['speaker_lines' => array_values($lines)],
            ]);
        } catch (\Exception $e) {
            Log::error('Groq diarize error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function buildDiarizationPrompt(string $transcript, int $maxSpeakers): string
    {
        $speakerList = [];
        for ($i = 0; $i < $maxSpeakers; $i++) {
            $speakerList[] = chr(65 + $i); // A, B, C, D
        }
        $labels = implode('/', $speakerList);

        return "You are an expert dialogue analyzer. Below is an English transcript without speaker labels (it may be from an IELTS Listening conversation).

Your task: assign speaker labels to each utterance/turn based on the conversation flow and meaning.

Rules:
1. Use labels: {$labels} (max {$maxSpeakers} distinct speakers)
2. Detect speaker changes from semantic clues:
   - Questions vs answers
   - Different perspectives or roles (interviewer/customer, tutor/student, host/guest)
   - Topic switches and turn-taking signals (\"Yes, sure\", \"That's great\", \"What about...\", \"I'd suggest...\")
3. Split the transcript into TURNS. Each turn = consecutive sentences from one speaker.
4. Keep the EXACT original wording. Do NOT paraphrase, summarize, or fix grammar.
5. If the transcript is clearly a monologue (1 speaker), return all text as a single 'A:' turn.

Return ONLY valid JSON in this format:
{
  \"lines\": [
    \"A: <first turn text>\",
    \"B: <second turn text>\",
    \"A: <third turn text>\"
  ]
}

Transcript to analyze:
\"\"\"
{$transcript}
\"\"\"";
    }

    /**
     * Gọi Groq Chat Completions API với JSON mode.
     * Free tier ~ 14400 req/day, latency rất thấp (~500ms).
     * Có fallback model khi rate-limit.
     */
    private function callGroqJson(string $prompt, string $apiKey): array
    {
        $models = [
            config('services.groq.model', 'llama-3.3-70b-versatile'),
            'llama-3.1-8b-instant',
            'gemma2-9b-it',
        ];
        // Loại trùng giữ thứ tự
        $models = array_values(array_unique(array_filter($models)));

        $url = 'https://api.groq.com/openai/v1/chat/completions';
        $verifySsl = !app()->environment('local');
        $response = null;
        $lastError = '';

        foreach ($models as $model) {
            $payload = [
                'model' => $model,
                'messages' => [[
                    'role' => 'user',
                    'content' => $prompt,
                ]],
                'temperature' => 0.1,
                'response_format' => ['type' => 'json_object'],
            ];

            for ($attempt = 1; $attempt <= 2; $attempt++) {
                try {
                    $response = Http::withOptions(['verify' => $verifySsl])
                        ->withHeaders([
                            'Authorization' => 'Bearer ' . $apiKey,
                            'Content-Type'  => 'application/json',
                        ])
                        ->timeout(45)
                        ->post($url, $payload);
                } catch (\Throwable $e) {
                    $lastError = $e->getMessage();
                    sleep($attempt);
                    continue;
                }

                if ($response->successful()) break 2;

                $status = $response->status();
                $lastError = $response->body();

                if ($status === 429 || $status === 503) {
                    sleep($attempt);
                    continue;
                }
                if ($status === 404 || $status === 400) {
                    Log::warning("Groq model '{$model}' unavailable ({$status}), trying next");
                    break;
                }
                break 2;
            }
        }

        if (!$response || !$response->successful()) {
            throw new \Exception('Groq API failed: ' . $lastError);
        }

        $body = $response->json();
        $text = $body['choices'][0]['message']['content'] ?? null;
        if (!$text) {
            throw new \Exception('Groq không trả về kết quả.');
        }

        // Một số model trả kèm code fence dù đã bật response_format json
        $text = preg_replace('/^```json\s*/i', '', trim($text));
        $text = preg_replace('/\s*```$/i', '', $text);

        $parsed = json_decode($text, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception('Groq trả về JSON không hợp lệ: ' . json_last_error_msg());
        }
        return $parsed;
    }

    /**
     * @deprecated Giữ lại cho các nơi khác có thể đang dùng — task diarize đã chuyển sang Groq.
     * Gọi Gemini với text-only prompt (không có file).
     */
    private function generateTextOnly(string $prompt): array
    {
        $payload = [
            'contents' => [[
                'parts' => [['text' => $prompt]],
            ]],
            'generationConfig' => [
                'temperature' => 0.1,
                'responseMimeType' => 'application/json',
            ],
        ];

        $verifySsl = !app()->environment('local');
        $response = null;
        $lastError = '';

        foreach ($this->modelFallbacks as $model) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . $this->apiKey;
            for ($attempt = 1; $attempt <= 2; $attempt++) {
                try {
                    $response = Http::withOptions(['verify' => $verifySsl])
                        ->timeout(60)
                        ->post($url, $payload);
                } catch (\Throwable $e) {
                    $lastError = $e->getMessage();
                    sleep($attempt);
                    continue;
                }
                if ($response->successful()) break 2;

                $status = $response->status();
                $lastError = $response->body();
                if ($status === 503 || $status === 429) {
                    sleep($attempt);
                    continue;
                }
                if ($status === 404 || ($status === 400 && stripos($lastError, 'model') !== false)) {
                    Log::warning("Gemini model '{$model}' unavailable (status {$status}), trying next");
                    break;
                }
                break 2;
            }
        }

        if (!$response || !$response->successful()) {
            throw new \Exception('Gemini diarize failed: ' . $lastError);
        }

        $body = $response->json();
        $text = $body['candidates'][0]['content']['parts'][0]['text'] ?? null;
        if (!$text) {
            throw new \Exception('Gemini không trả về kết quả.');
        }

        $text = preg_replace('/^```json\s*/i', '', trim($text));
        $text = preg_replace('/\s*```$/i', '', $text);

        $parsed = json_decode($text, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception('Gemini trả về JSON không hợp lệ: ' . json_last_error_msg());
        }
        return $parsed;
    }

    /**
     * Post-process kết quả từ Gemini:
     * - Merge các section/passage trùng số (Gemini hay split nhỏ)
     * - Sort questions theo questionNumber
     * - Đảm bảo options luôn là object {A,B,C,D}, không phải array []
     */
    private function postProcess(array $data, string $skill): array
    {
        if ($skill === 'listening' && isset($data['sections'])) {
            $data['sections'] = $this->mergeByNumber($data['sections'], 'sectionNumber', 'questions');
        } elseif ($skill === 'reading' && isset($data['passages'])) {
            $data['passages'] = $this->mergeByNumber($data['passages'], 'passageNumber', 'questions');
        }

        // Đảm bảo options là object cho mọi câu hỏi
        $sectionsKey = $skill === 'listening' ? 'sections' : ($skill === 'reading' ? 'passages' : null);
        if ($sectionsKey && isset($data[$sectionsKey])) {
            foreach ($data[$sectionsKey] as &$sec) {
                if (!isset($sec['questions'])) continue;
                foreach ($sec['questions'] as &$q) {
                    // Empty array [] → empty object {} → unset (cleaner JSON)
                    if (isset($q['options']) && (empty($q['options']) || array_values($q['options']) === $q['options'])) {
                        unset($q['options']);
                    }
                }
                unset($q);
            }
            unset($sec);
        }

        return $data;
    }

    /** Merge các section/passage có cùng số: gộp questions, dedupe theo questionNumber */
    private function mergeByNumber(array $items, string $numberKey, string $childKey): array
    {
        $grouped = [];
        foreach ($items as $item) {
            $num = $item[$numberKey] ?? null;
            if ($num === null) continue;
            if (!isset($grouped[$num])) {
                $grouped[$num] = $item;
                $grouped[$num][$childKey] = $item[$childKey] ?? [];
            } else {
                // Append questions không trùng questionNumber
                $existing = array_column($grouped[$num][$childKey], 'questionNumber');
                foreach ($item[$childKey] ?? [] as $q) {
                    if (!in_array($q['questionNumber'] ?? -1, $existing, true)) {
                        $grouped[$num][$childKey][] = $q;
                        $existing[] = $q['questionNumber'] ?? -1;
                    }
                }
            }
        }
        // Sort by number, sort questions inside by questionNumber
        ksort($grouped);
        $result = [];
        foreach ($grouped as $g) {
            usort($g[$childKey], fn($a, $b) => ($a['questionNumber'] ?? 0) <=> ($b['questionNumber'] ?? 0));
            $result[] = $g;
        }
        return $result;
    }

    /**
     * Upload file PDF lên Gemini Files API
     * Trả về URI của file để dùng trong generateContent
     */
    private function uploadToGemini($file): string
    {
        $fileSize    = $file->getSize();
        $mimeType    = 'application/pdf';
        $displayName = $file->getClientOriginalName();
        $verifySsl   = app()->environment('production'); // tắt SSL verify trên local

        // Bước 1: Khởi tạo resumable upload session
        $initResponse = Http::withOptions(['verify' => $verifySsl])
            ->withHeaders([
                'X-Goog-Upload-Protocol' => 'resumable',
                'X-Goog-Upload-Command'  => 'start',
                'X-Goog-Upload-Header-Content-Length' => $fileSize,
                'X-Goog-Upload-Header-Content-Type'   => $mimeType,
                'Content-Type'           => 'application/json',
            ])->post($this->uploadBaseUrl . '?key=' . $this->apiKey, [
                'file' => ['display_name' => $displayName],
            ]);

        if (!$initResponse->successful()) {
            throw new \Exception('Lỗi khởi tạo upload Gemini: ' . $initResponse->body());
        }

        $uploadUrl = $initResponse->header('X-Goog-Upload-URL');
        if (!$uploadUrl) {
            throw new \Exception('Không nhận được upload URL từ Gemini');
        }

        // Bước 2: Upload file bytes
        $fileContent    = file_get_contents($file->getRealPath());
        $uploadResponse = Http::withOptions(['verify' => $verifySsl])
            ->withHeaders([
                'Content-Length'        => $fileSize,
                'X-Goog-Upload-Offset'  => '0',
                'X-Goog-Upload-Command' => 'upload, finalize',
            ])->withBody($fileContent, $mimeType)->post($uploadUrl);

        if (!$uploadResponse->successful()) {
            throw new \Exception('Lỗi upload file PDF lên Gemini: ' . $uploadResponse->body());
        }

        $fileData = $uploadResponse->json();
        $uri = isset($fileData['file']['uri']) ? $fileData['file']['uri'] : null;

        if (!$uri) {
            throw new \Exception('Không nhận được file URI từ Gemini sau upload');
        }

        return $uri;
    }

    /**
     * Gọi Gemini generateContent với file đã upload + prompt
     */
    private function generateContent(string $fileUri, string $prompt): array
    {
        $verifySsl = app()->environment('production');

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        [
                            'file_data' => [
                                'mime_type' => 'application/pdf',
                                'file_uri'  => $fileUri,
                            ],
                        ],
                        ['text' => $prompt],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature'      => 0.1,
                'responseMimeType' => 'application/json',
            ],
        ];

        $response = null;
        $lastError = '';

        // Thử lần lượt từng model; mỗi model retry tối đa 3 lần với backoff khi gặp 503/429
        foreach ($this->modelFallbacks as $model) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . $this->apiKey;

            for ($attempt = 1; $attempt <= 3; $attempt++) {
                try {
                    $response = Http::withOptions(['verify' => $verifySsl])
                        ->timeout(90)
                        ->post($url, $payload);
                } catch (\Throwable $e) {
                    $lastError = $e->getMessage();
                    sleep($attempt); // backoff khi lỗi mạng
                    continue;
                }

                if ($response->successful()) {
                    break 2; // thành công → thoát cả 2 vòng lặp
                }

                $status = $response->status();
                $lastError = $response->body();

                // 503 (quá tải) hoặc 429 (rate limit) → retry/fallback; lỗi khác → dừng model này
                if ($status === 503 || $status === 429) {
                    sleep($attempt); // 1s, 2s, 3s
                    continue;
                }

                // 404 = model không tồn tại / đã deprecate → skip sang model kế tiếp.
                // 400 với "model" trong message thường là cùng nguyên nhân → cũng skip.
                $isModelGone =
                    $status === 404 ||
                    ($status === 400 && stripos($lastError, 'model') !== false);
                if ($isModelGone) {
                    \Log::warning("Gemini model '{$model}' unavailable (status {$status}), trying next fallback");
                    break; // thoát retry loop, vòng for ngoài sẽ thử model kế tiếp
                }

                // Lỗi không retry được khác (401, 403, 500 cụ thể, ...) → dừng hẳn
                break 2;
            }
        }

        if (!$response || !$response->successful()) {
            $isOverloaded = $response && in_array($response->status(), [503, 429]);
            $msg = $isOverloaded
                ? 'Hệ thống AI đang quá tải. Vui lòng thử lại sau ít phút hoặc nhập nội dung đề thủ công bên dưới.'
                : 'Lỗi Gemini generateContent: ' . $lastError;
            throw new \Exception($msg);
        }

        $body = $response->json();

        // Extract JSON từ response
        $text = isset($body['candidates'][0]['content']['parts'][0]['text'])
            ? $body['candidates'][0]['content']['parts'][0]['text']
            : null;

        if (!$text) {
            throw new \Exception('Gemini không trả về kết quả');
        }

        // Bóc JSON ra (có thể bị wrap trong ```json ... ```)
        $text = preg_replace('/^```json\s*/i', '', trim($text));
        $text = preg_replace('/\s*```$/i', '', $text);

        $parsed = json_decode($text, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception('Gemini trả về JSON không hợp lệ: ' . json_last_error_msg());
        }

        return $parsed;
    }

    /**
     * Build prompt theo skill
     */
    private function buildPrompt(string $skill, string $testType): string
    {
        $prompts = [
            'listening' => "Extract all IELTS {$testType} Listening questions from this PDF.
Return ONLY valid JSON in this exact format:
{
  \"sections\": [
    {
      \"sectionNumber\": 1,
      \"sectionTitle\": \"Restaurant recommendations\",
      \"sectionInstruction\": \"Complete the table below. Write NO MORE THAN TWO WORDS for each answer.\",
      \"transcript\": \"\",
      \"questions\": [
        {
          \"questionNumber\": 1,
          \"questionType\": \"form-completion\",
          \"taskTitle\": \"Places to eat in the city centre\",
          \"questionText\": \"Good for people who are especially keen on ___\",
          \"options\": {\"A\": \"\", \"B\": \"\", \"C\": \"\"},
          \"correctAnswer\": \"\"
        }
      ]
    }
  ]
}

CRITICAL RULES — READ CAREFULLY:

1. STRUCTURE: Return EXACTLY 4 sections (sectionNumber 1, 2, 3, 4). DO NOT split a section into multiple objects.
   - sectionNumber=1 contains all 10 questions of Part 1 (Q1-10)
   - sectionNumber=2 contains all 10 questions of Part 2 (Q11-20)
   - sectionNumber=3 contains all 10 questions of Part 3 (Q21-30)
   - sectionNumber=4 contains all 10 questions of Part 4 (Q31-40)

1b. sectionTitle — REQUIRED for each section. A short topic/context phrase describing what the part is about, inferred from the content (e.g. 'Restaurant recommendations', 'Pottery class', 'Loneliness and mental health', 'Rivers in cities'). Do NOT use generic labels like 'Section 1' or 'Part 1'. Use empty string '' only if the topic truly cannot be determined.

1c. sectionInstruction — REQUIRED for each section. The exact instruction line(s) of that part, copied from the PDF (e.g. 'Complete the notes below. Write ONE WORD ONLY for each answer.', 'Choose the correct letter, A, B or C.', 'Complete the table below. Write NO MORE THAN TWO WORDS for each answer.'). Combine the 'Complete...' line and the 'Write...' line into one string. Use empty string '' only if no instruction is present.

1d. taskTitle — For each question, the heading/title of the table, notes box, or question group it belongs to (e.g. 'Places to eat in the city centre', 'River transport notes'). Questions in the same table/group MUST share the SAME taskTitle. Leave empty string '' when there is no such heading (e.g. standalone MCQ).

2. questionText — THE MOST IMPORTANT FIELD. NEVER copy the generic instruction (e.g. 'Complete the table below', 'Complete the notes below', 'Write ONE WORD ONLY'). Instead:
   - For TABLE completion (Section 1 typically): Each blank in the table corresponds to one question. The questionText must contain the SPECIFIC sentence or phrase around the numbered blank, with ___ marking the gap.
     ★ CRITICAL FOR TABLES WITH A ROW LABEL (e.g. restaurant name, person name, place name in the leftmost column):
       PREPEND that row label to questionText using ' — ' (space-emdash-space) as separator, so the student knows which row/entity the blank belongs to.
       EXAMPLE — table row 'The Junction | ... | keen on 1 ___' → questionText for Q1 = 'The Junction — Good for people who are especially keen on ___'
       EXAMPLE — same row, 'The 2 ___ is a good place for a drink' → Q2 = 'The Junction — The ___ is a good place for a drink'
       EXAMPLE — row 'Paloma | 3 ___ food, good for sharing' → Q3 = 'Paloma — ___ food, good for sharing'
       EXAMPLE — if the ROW LABEL ITSELF is the blank (e.g. leftmost cell is 'The 5 ___', a restaurant whose name must be filled in), then questionText = 'The ___ (name of the restaurant)' and DO NOT prepend anything.
       Reuse the SAME row label for every blank belonging to that row.
     ★ NEVER include the question number inside questionText. Strip leading/trailing question numbers.
       WRONG: 'Set lunch costs 9 £ ___ per person'  →  RIGHT: 'Set lunch costs £ ___ per person'
       WRONG: 'Portions probably of 10 ___ size'    →  RIGHT: 'Portions probably of ___ size'
   - For NOTE completion (Section 4 typically): Each numbered blank in the notes/bullet points becomes one question. Capture the EXACT sentence containing the blank, with ___ marking the gap. NEVER include question numbers in the text.
     EXAMPLE — bullet 'pollution from 31 ___ on the river bank' → questionText = 'pollution from ___ on the river bank'
     EXAMPLE — '32 ___ was declared biologically dead' → questionText = '___ was declared biologically dead'
     ★ ONE question = ONE blank. If a sentence has two blanks (e.g. blank 39 and blank 40), split it: Q39 gets the part up to its blank, Q40 gets ONLY its own clause with a single ___ . NEVER put two ___ or another question's number in one questionText.
   - For SENTENCE/SHORT-ANSWER completion: Capture the full sentence with ___ at the gap.

3. For 'Choose TWO letters A-E' questions (e.g. Q17-18, Q19-20, Q21-22): create TWO separate question rows with the SAME options A-E and SAME questionText (the kilns question for Q17 AND Q18, same options A-E, etc).

4. questionType values: multiple-choice | form-completion | note-completion | table-completion | sentence-completion | matching | map-labelling | flow-chart-completion

5. For multiple-choice, fill options A/B/C or A/B/C/D (or A-E for 'choose TWO').

6. For completion types, OMIT the options field entirely (do not include empty array or empty object).

7. Leave correctAnswer as empty string '' if not provided in the PDF.

REMEMBER: questionText must be UNIQUE per question and contain the actual context around the blank. NEVER use the same generic instruction text for multiple questions.",

            'reading' => "Extract all IELTS {$testType} Reading questions from this PDF.
Return ONLY valid JSON:
{
  \"passages\": [
    {
      \"passageNumber\": 1,
      \"title\": \"passage title\",
      \"body\": \"full passage text\",
      \"wordCount\": 800,
      \"questions\": [
        {
          \"questionNumber\": 1,
          \"questionType\": \"true-false-not-given\",
          \"questionText\": \"question text\",
          \"correctAnswer\": \"\"
        }
      ]
    }
  ]
}

CRITICAL RULES:
- Return EXACTLY 3 passages (passageNumber 1, 2, 3) — DO NOT split a passage into multiple objects.
  All questions of Passage 1 (Q1-13 typically) must be in passageNumber=1.
  All questions of Passage 2 (Q14-26) must be in passageNumber=2.
  All questions of Passage 3 (Q27-40) must be in passageNumber=3.
- Include the COMPLETE passage body text (do not truncate).
- questionType values: multiple-choice | true-false-not-given | yes-no-not-given | matching-headings | matching-information | matching-features | sentence-completion | summary-completion | short-answer | flow-chart-completion
- For multiple-choice, fill options A/B/C/D as object: {\"A\":\"...\",\"B\":\"...\",\"C\":\"...\",\"D\":\"...\"}
- For non-MCQ types, OMIT the options field entirely.
- Leave correctAnswer as empty string '' if not in PDF.",

            'writing' => "Extract all IELTS {$testType} Writing tasks from this PDF.
Return ONLY valid JSON:
{
  \"tasks\": [
    {
      \"taskNumber\": 1,
      \"prompt\": \"full task prompt text including all instructions\",
      \"chartType\": \"bar\",
      \"tone\": \"formal\",
      \"essayType\": \"opinion\",
      \"modelAnswer\": \"\"
    }
  ]
}

CRITICAL RULES:
- Return EXACTLY 2 tasks: taskNumber=1 and taskNumber=2.
- For Task 1 of {$testType}:
  * If Academic: include chartType (bar | line | pie | table | process | map). OMIT tone and essayType.
  * If General Training: include tone (formal | semi-formal | informal). OMIT chartType and essayType.
- For Task 2: include essayType (opinion | discuss | problem-solution | advantages-disadvantages). OMIT chartType and tone.
- Include the FULL prompt text including 'Write at least X words' instruction.
- Leave modelAnswer as empty string '' (it's optional).",

            'speaking' => "Extract all IELTS Speaking questions from this PDF.
Return ONLY valid JSON:
{
  \"parts\": [
    {
      \"partNumber\": 1,
      \"questions\": [
        {\"topic\": \"Hometown\", \"text\": \"Where are you from?\"}
      ]
    },
    {
      \"partNumber\": 2,
      \"cueCard\": {
        \"topic\": \"Describe a memorable journey\",
        \"bullets\": [\"Where you went\", \"Who you went with\", \"What you did\", \"Why it was memorable\"],
        \"followUp\": \"Would you like to go again?\"
      }
    },
    {
      \"partNumber\": 3,
      \"questions\": [
        {\"text\": \"How has travel changed in recent years?\"}
      ]
    }
  ]
}

CRITICAL RULES:
- Return EXACTLY 3 parts (partNumber 1, 2, 3) — one entry per part.
- Part 1: 'questions' array with topic + text. Group by topic (e.g. Hometown, Work, Hobbies).
- Part 2: 'cueCard' object with topic (the main 'Describe...' line), bullets (3-4 'You should say:' items), followUp (optional final question).
- Part 3: 'questions' array — open-ended discussion questions tied to Part 2 topic.",
        ];

        return $prompts[$skill] ?? $prompts['listening'];
    }
}
