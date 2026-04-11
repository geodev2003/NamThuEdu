<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Answer;
use App\Models\Exam;
use App\Models\Question;
use App\Models\User;
use Illuminate\Support\Facades\DB;

$sourceUrl = 'https://vstep.edu.vn/de-thi-mau-chung-chi-b1-b2-c1-tieng-anh-theo-dinh-dang-vstep';

function fetchHtml(string $url): string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 45,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; NamThuEduImporter/1.0)',
    ]);
    $html = curl_exec($ch);
    if ($html === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('Fetch failed: ' . $error);
    }
    curl_close($ch);
    return $html;
}

function normalizeText(string $html): string
{
    $html = preg_replace('/<script\b[^>]*>[\s\S]*?<\/script>/i', ' ', $html);
    $html = preg_replace('/<style\b[^>]*>[\s\S]*?<\/style>/i', ' ', $html);
    $text = strip_tags((string)$html);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = str_replace("\r", '', $text);
    $lines = array_filter(array_map(static fn ($line) => trim($line), explode("\n", $text)));
    return implode("\n", $lines);
}

function parseMcq(string $text): array
{
    $lines = explode("\n", $text);
    $questions = [];
    $lineCount = count($lines);

    for ($i = 0; $i < $lineCount; $i++) {
        if (!preg_match('/^(\d{1,2})\.\s*(.+)$/u', $lines[$i], $m)) {
            continue;
        }

        $number = (int)$m[1];
        if ($number < 1 || $number > 40) {
            continue;
        }

        $stem = trim($m[2]);
        $j = $i + 1;
        while ($j < $lineCount && !preg_match('/^A\.\s*/u', $lines[$j]) && !preg_match('/^\d{1,2}\.\s*/u', $lines[$j])) {
            $stem .= ' ' . trim($lines[$j]);
            $j++;
        }

        if ($j >= $lineCount || !preg_match('/^A\.\s*(.+)$/u', $lines[$j], $a)) {
            continue;
        }
        $j++;
        if ($j >= $lineCount || !preg_match('/^B\.\s*(.+)$/u', $lines[$j], $b)) {
            continue;
        }
        $j++;
        if ($j >= $lineCount || !preg_match('/^C\.\s*(.+)$/u', $lines[$j], $c)) {
            continue;
        }
        $j++;
        if ($j >= $lineCount || !preg_match('/^D\.\s*(.+)$/u', $lines[$j], $d)) {
            continue;
        }

        if (!isset($questions[$number])) {
            $questions[$number] = [
                'number' => $number,
                'stem' => trim($stem),
                'options' => [trim($a[1]), trim($b[1]), trim($c[1]), trim($d[1])],
            ];
        }
    }

    ksort($questions);
    return array_values($questions);
}

function parseSpeaking(string $text): array
{
    $parts = [];
    if (preg_match('/Part 1: Social Interaction[\s\S]*?(?=Part 2: Solution Discussion|$)/u', $text, $m1)) {
        $parts[] = ['part' => 'part_1', 'prompt' => trim($m1[0])];
    }
    if (preg_match('/Part 2: Solution Discussion[\s\S]*?(?=Part 3: Topic Development|$)/u', $text, $m2)) {
        $parts[] = ['part' => 'part_2', 'prompt' => trim($m2[0])];
    }
    if (preg_match('/Part 3: Topic Development[\s\S]*?(?=Ngoài đề thi mẫu|$)/u', $text, $m3)) {
        $parts[] = ['part' => 'part_3', 'prompt' => trim($m3[0])];
    }
    return $parts;
}

$teacherId = User::where('uRole', 'teacher')->min('uId');
if (!$teacherId) {
    throw new RuntimeException('No teacher user found to own imported exam.');
}

$html = fetchHtml($sourceUrl);
$text = normalizeText($html);
$mcq = parseMcq($text);
$speaking = parseSpeaking($text);
$writing = [
    [
        'part' => 'task_1',
        'prompt' => "You received an email from your English friend, Jane. She asked for information about your friend An, who wants to stay with Jane's family in London. Write an email responding to Jane about An's personality, hobbies/interests, and current work/study. Write at least 120 words.",
    ],
    [
        'part' => 'task_2',
        'prompt' => 'Tourism has become one of the fastest growing industries in the world. Some people argue that tourism has negative effects on local communities; others think the effects are positive. Write an essay discussing the effects of tourism on local communities with reasons/examples. Write at least 250 words.',
    ],
];

$result = DB::transaction(function () use ($teacherId, $sourceUrl, $mcq, $writing, $speaking) {
    $exam = Exam::create([
        'eTitle' => 'VSTEP Sample Import (vstep.edu.vn) ' . now()->format('Y-m-d H:i:s'),
        'eDescription' => 'Imported from: ' . $sourceUrl . ' | MCQ captured: ' . count($mcq) . '/40. Answer key unavailable from source.',
        'eType' => 'VSTEP',
        'eSkill' => 'mixed',
        'eTeacher_id' => $teacherId,
        'eDuration_minutes' => 172,
        'eIs_private' => true,
        'eSource_type' => 'manual',
        'eStatus' => 'draft',
        'eVisibility' => 'private',
        'ePurpose' => 'practice',
        'eTopic' => 'vstep-sample-web-import',
        'eDifficulty' => 'medium',
    ]);

    $answerLabels = ['A', 'B', 'C', 'D'];
    $mcqInserted = 0;
    $answersInserted = 0;

    foreach ($mcq as $item) {
        $num = (int)$item['number'];
        $isListening = $num <= 20;

        $question = Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Q' . $num . '. ' . $item['stem'],
            'qType' => $isListening ? ($num <= 8 ? 'listening_announcement' : 'listening_dialogue') : 'reading_main_idea',
            'qSection' => $isListening ? ($num <= 8 ? 'Listening Part 1' : 'Listening Part 2') : 'Reading',
            'qSection_order' => $num,
            'qPoints' => 1,
            'qDifficulty' => 'medium',
            'qConfig' => json_encode([
                'source' => 'vstep.edu.vn',
                'source_url' => $sourceUrl,
                'source_question_number' => $num,
                'answer_key_available' => false,
            ], JSON_UNESCAPED_UNICODE),
        ]);
        $mcqInserted++;

        foreach ($item['options'] as $idx => $option) {
            Answer::create([
                'question_id' => $question->qId,
                'aContent' => ($answerLabels[$idx] ?? '?') . '. ' . $option,
                'aIs_correct' => false,
            ]);
            $answersInserted++;
        }
    }

    $writingInserted = 0;
    foreach ($writing as $idx => $item) {
        $part = $item['part'];
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => strtoupper($part) . ': ' . $item['prompt'],
            'qType' => 'essay',
            'qSection' => 'Writing',
            'qSection_order' => 100 + $idx,
            'qPoints' => $part === 'task_2' ? 20 : 10,
            'qWord_count' => $part === 'task_2' ? 250 : 120,
            'qDifficulty' => 'medium',
            'qConfig' => json_encode(['source' => 'vstep.edu.vn', 'scoring' => 'manual'], JSON_UNESCAPED_UNICODE),
        ]);
        $writingInserted++;
    }

    $speakingTypes = ['speaking_interaction', 'speaking_solution', 'speaking_topic'];
    $speakingTimes = [3, 4, 5];
    $speakingInserted = 0;

    foreach ($speaking as $idx => $item) {
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => strtoupper($item['part']) . ': ' . $item['prompt'],
            'qType' => $speakingTypes[$idx] ?? 'speaking_topic',
            'qSection' => 'Speaking',
            'qSection_order' => 200 + $idx,
            'qPoints' => 10,
            'qTime_limit' => $speakingTimes[$idx] ?? 4,
            'qDifficulty' => 'medium',
            'qConfig' => json_encode(['source' => 'vstep.edu.vn', 'scoring' => 'manual'], JSON_UNESCAPED_UNICODE),
        ]);
        $speakingInserted++;
    }

    return [
        'exam_id' => $exam->eId,
        'mcq' => $mcqInserted,
        'answers' => $answersInserted,
        'writing' => $writingInserted,
        'speaking' => $speakingInserted,
    ];
});

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . PHP_EOL;
