<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Seed dữ liệu "người đã luyện tập" cho IELTS Listening Exam #70.
 *
 * Mục đích: làm số liệu hiển thị ở trang chi tiết đề (StudentIeltsExamDetail)
 *  → "{n} người đã luyện tập đề thi này" hết bằng 0.
 *
 * Tạo:
 *  • Đảm bảo có ít nhất 12 student (tự tạo nếu thiếu)
 *  • 12 submission với các trạng thái thực tế:
 *      - 8 đã graded (có sScore, sSubmit_time, đầy đủ submission_answers)
 *      - 2 đã submitted (đang chờ chấm — sStatus='submitted')
 *      - 2 đang in_progress (sStart_time > 60s trước, sSubmit_time NULL)
 *  • Mỗi submission có sample submission_answers (5–10 câu) để có quan hệ đầy đủ
 *
 * Cách chạy:
 *      php artisan db:seed --class=IeltsExam70ParticipantsSeeder
 *
 * Idempotent: chạy lại sẽ XÓA submissions+answers cũ của exam 70 do seeder này
 *  tạo (xác định bằng marker trong sTeacher_feedback) trước khi tạo mới.
 */
class IeltsExam70ParticipantsSeeder extends Seeder
{
    private const EXAM_ID = 70;
    private const MARKER = '[seed:exam70-participants]';
    private const TARGET_PARTICIPANTS = 12;

    public function run(): void
    {
        $exam = Exam::find(self::EXAM_ID);
        if (!$exam) {
            $this->command->error("Exam #" . self::EXAM_ID . " không tồn tại.");
            return;
        }

        $this->command->info("Seeding participants cho exam #{$exam->eId} — {$exam->eTitle}");

        // 1) Lấy danh sách câu hỏi để gắn answer
        $questions = Question::where('exam_id', self::EXAM_ID)
            ->where('qSkill', 'listening')
            ->orderBy('qPart')->orderBy('qSection_order')
            ->get(['qId', 'qPart', 'qType', 'qCorrect_answer']);

        if ($questions->isEmpty()) {
            $this->command->warn("Exam #" . self::EXAM_ID . " không có câu hỏi listening — bỏ qua tạo answers.");
        } else {
            $this->command->info("  • Tìm thấy {$questions->count()} câu hỏi");
        }

        // 2) Đảm bảo có đủ student
        $students = $this->ensureStudents(self::TARGET_PARTICIPANTS);
        $this->command->info("  • Có {$students->count()} student để gán submission");

        // 3) Xóa dữ liệu seeder cũ (idempotent)
        $this->cleanupPreviousSeed();

        // 4) Tạo 12 submission với phân phối thực tế
        DB::transaction(function () use ($students, $questions) {
            $now = Carbon::now();

            // 8 graded — đã hoàn thành, có điểm số
            $gradedScores = [9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5];
            for ($i = 0; $i < 8; $i++) {
                $student = $students[$i];
                $startedAt = $now->copy()->subDays(rand(1, 30))->subMinutes(rand(0, 1440));
                $submittedAt = $startedAt->copy()->addMinutes(rand(28, 40));

                $submission = Submission::create([
                    'user_id'             => $student->uId,
                    'exam_id'             => self::EXAM_ID,
                    'assignment_id'       => null,
                    'sAttempt'            => 1,
                    'sStart_time'         => $startedAt,
                    'sSubmit_time'        => $submittedAt,
                    'sGraded_time'        => $submittedAt->copy()->addMinutes(rand(5, 60)),
                    'sScore'              => $gradedScores[$i],
                    'sStatus'             => 'graded',
                    'sTeacher_feedback'   => self::MARKER . ' Good attempt — keep practising listening for detail.',
                ]);

                $this->seedAnswers($submission, $questions, $gradedScores[$i] / 9 * 100);
            }

            // 2 submitted — chưa chấm
            for ($i = 8; $i < 10; $i++) {
                $student = $students[$i];
                $startedAt = $now->copy()->subDays(rand(0, 3))->subMinutes(rand(0, 720));
                $submittedAt = $startedAt->copy()->addMinutes(rand(30, 40));

                $submission = Submission::create([
                    'user_id'             => $student->uId,
                    'exam_id'             => self::EXAM_ID,
                    'assignment_id'       => null,
                    'sAttempt'            => 1,
                    'sStart_time'         => $startedAt,
                    'sSubmit_time'        => $submittedAt,
                    'sScore'              => null,
                    'sStatus'             => 'submitted',
                    'sTeacher_feedback'   => self::MARKER,
                ]);

                $this->seedAnswers($submission, $questions, 70);
            }

            // 2 in_progress — đang làm dở (đã ngồi > 60s nên được tính)
            for ($i = 10; $i < 12; $i++) {
                $student = $students[$i];
                $startedAt = $now->copy()->subMinutes(rand(2, 25));

                $submission = Submission::create([
                    'user_id'             => $student->uId,
                    'exam_id'             => self::EXAM_ID,
                    'assignment_id'       => null,
                    'sAttempt'            => 1,
                    'sStart_time'         => $startedAt,
                    'sSubmit_time'        => null,
                    'sScore'              => null,
                    'sStatus'             => 'in_progress',
                    'sTeacher_feedback'   => self::MARKER,
                ]);

                // Dùng partial answer (đã làm vài câu)
                $this->seedAnswers($submission, $questions->take(rand(5, 15)), 60);
            }
        });

        // 5) Báo cáo kết quả
        $count = $this->countByLogic();
        $this->command->info("✓ Hoàn tất! Số người đã luyện tập (theo logic countParticipants): {$count}");
    }

    /**
     * Đảm bảo có đủ student. Nếu thiếu thì tạo thêm.
     */
    private function ensureStudents(int $needed)
    {
        $existing = User::where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->orderBy('uId')
            ->limit($needed)
            ->get();

        if ($existing->count() >= $needed) {
            return $existing;
        }

        $missing = $needed - $existing->count();
        $vietnameseNames = [
            'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức',
            'Hoàng Thị Em', 'Vũ Văn Phong', 'Đặng Thu Giang', 'Bùi Quốc Hùng',
            'Đỗ Thị Lan', 'Ngô Văn Khoa', 'Dương Hải Linh', 'Trịnh Văn Mạnh',
        ];

        $startIdx = $existing->count();
        for ($i = 0; $i < $missing; $i++) {
            $name = $vietnameseNames[($startIdx + $i) % count($vietnameseNames)] . ' ' . ($startIdx + $i + 1);
            User::create([
                'uName'         => $name,
                'uEmail'        => 'student' . time() . $i . '@seed.test',
                'uPhone'        => '098' . str_pad((string)(1000000 + $startIdx + $i), 7, '0', STR_PAD_LEFT),
                'uPassword'     => Hash::make('123456'),
                'plain_password' => '123456',
                'uRole'         => 'student',
                'uStatus'       => 'active',
                'age_group'     => 'adults',
                'uGender'       => $i % 2 === 0,
            ]);
        }

        return User::where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->orderBy('uId')
            ->limit($needed)
            ->get();
    }

    /**
     * Tạo submission_answers cho 1 submission, với tỉ lệ đúng/sai theo percentCorrect.
     */
    private function seedAnswers(Submission $submission, $questions, float $percentCorrect): void
    {
        if ($questions->isEmpty()) return;

        $answersToInsert = [];
        foreach ($questions as $q) {
            $isCorrect = (mt_rand(0, 100) < $percentCorrect);

            // Lấy đáp án đúng từ qData['correct_answer'] (IELTS lưu ở đây), fallback
            // qCorrect_answer. Nếu không có → tạo 1 từ giả lập theo loại câu.
            $type = (string) ($q->qType ?? '');
            $correctAnswer = $this->resolveCorrectAnswer($q, $type);

            // Đúng → dùng đáp án đúng; sai → biến thể sai phù hợp loại câu.
            $answerText = $isCorrect
                ? $correctAnswer
                : $this->fakeWrongAnswer($correctAnswer, $type);

            $answersToInsert[] = [
                'submission_id'    => $submission->sId,
                'question_id'      => $q->qId,
                'saAnswer_text'    => $answerText,
                'saIs_correct'     => $isCorrect,
                'saPoints_awarded' => $isCorrect ? 1.00 : 0.00,
            ];
        }

        // Bulk insert cho hiệu năng
        SubmissionAnswer::insert($answersToInsert);
    }

    /** MCQ-style → trả về letter A/B/C/D; còn lại → từ/cụm từ (completion). */
    private function isMcqType(string $type): bool
    {
        return in_array($type, [
            'multiple_choice', 'multiple_choice_multi', 'mcq',
            'true_false_not_given', 'yes_no_not_given',
            'matching', 'matching_headings', 'matching_features',
            'matching_information', 'matching_sentence_endings',
        ], true);
    }

    private function resolveCorrectAnswer($q, string $type): string
    {
        $qData = $q->qData ?? [];
        $stored = $qData['correct_answer'] ?? $q->qCorrect_answer ?? null;
        if (is_array($stored)) {
            $stored = implode(', ', $stored);
        }
        $stored = is_string($stored) ? trim($stored) : '';
        if ($stored !== '') {
            return $stored;
        }

        // Không có đáp án lưu sẵn → fallback theo loại câu
        if ($this->isMcqType($type)) {
            return ['A', 'B', 'C', 'D'][array_rand(['A', 'B', 'C', 'D'])];
        }
        // Completion / short answer → 1 từ tiếng Anh giả lập
        $words = ['music', 'garden', 'morning', 'local', 'fresh', 'medium',
                  'window', 'river', 'health', 'sharing', '15', 'modern'];
        return $words[array_rand($words)];
    }

    private function fakeWrongAnswer(?string $correct, string $type = ''): string
    {
        if ($this->isMcqType($type)) {
            $alternatives = ['A', 'B', 'C', 'D'];
            $alternatives = array_values(array_filter($alternatives, fn($a) => $a !== $correct));
            return $alternatives[array_rand($alternatives)];
        }
        // Completion: 1 từ sai khác với đáp án đúng
        $words = ['quiet', 'evening', 'cheese', 'expensive', 'small', 'old',
                  'street', 'lake', 'cooking', '20', 'cold', 'busy'];
        $words = array_values(array_filter($words, fn($w) => $w !== $correct));
        return $words[array_rand($words)];
    }

    /**
     * Xóa submission cũ do seeder này tạo (idempotent).
     */
    private function cleanupPreviousSeed(): void
    {
        $oldSubmissions = Submission::where('exam_id', self::EXAM_ID)
            ->where('sTeacher_feedback', 'like', self::MARKER . '%')
            ->pluck('sId');

        if ($oldSubmissions->isEmpty()) {
            return;
        }

        SubmissionAnswer::whereIn('submission_id', $oldSubmissions)->delete();
        Submission::whereIn('sId', $oldSubmissions)->delete();

        $this->command->info("  • Đã xóa {$oldSubmissions->count()} submission seed cũ");
    }

    /**
     * Đếm theo cùng logic countParticipants() trong IeltsExamController.
     */
    private function countByLogic(): int
    {
        return Submission::where('exam_id', self::EXAM_ID)
            ->whereNotNull('sStart_time')
            ->where(function ($q) {
                $q->whereRaw('TIMESTAMPDIFF(SECOND, sStart_time, sSubmit_time) >= 60')
                  ->orWhere(function ($q2) {
                      $q2->whereNull('sSubmit_time')
                         ->whereRaw('TIMESTAMPDIFF(SECOND, sStart_time, NOW()) >= 60');
                  });
            })
            ->distinct('user_id')
            ->count('user_id');
    }
}
