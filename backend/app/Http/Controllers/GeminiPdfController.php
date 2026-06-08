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

        $response = Http::withOptions(['verify' => $verifySsl])
            ->timeout(60)->post(
            $this->generateUrl . '?key=' . $this->apiKey,
            [
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
                    'temperature'     => 0.1,
                    'responseMimeType' => 'application/json',
                ],
            ]
        );

        if (!$response->successful()) {
            throw new \Exception('Lỗi Gemini generateContent: ' . $response->body());
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
      \"transcript\": \"\",
      \"questions\": [
        {
          \"questionNumber\": 1,
          \"questionType\": \"form-completion\",
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

2. questionText — THE MOST IMPORTANT FIELD. NEVER copy the generic instruction (e.g. 'Complete the table below', 'Complete the notes below', 'Write ONE WORD ONLY'). Instead:
   - For TABLE completion (Section 1 typically): Each blank in the table corresponds to one question. The questionText must contain the SPECIFIC sentence or phrase around the numbered blank, with ___ marking the gap.
     EXAMPLE — if the table cell says 'Good for people who are especially keen on 1 ___' → questionText for Q1 = 'Good for people who are especially keen on ___'
     EXAMPLE — if cell says 'The 2 ___ is a good place for a drink' → questionText for Q2 = 'The ___ is a good place for a drink'
     EXAMPLE — if cell says 'A famous chef' (header for Q5 in 'Name of restaurant' column) and the blank is 'The 5 ___' → questionText = 'The ___ (famous chef restaurant)'
   - For NOTE completion (Section 4 typically): Each numbered blank in the notes/bullet points becomes one question. Capture the EXACT sentence containing the blank, with ___ marking the gap.
     EXAMPLE — bullet 'pollution from 31 ___ on the river bank' → questionText = 'pollution from ___ on the river bank'
     EXAMPLE — '32 ___ was declared biologically dead' → questionText = '___ was declared biologically dead'
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
