<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * KidsAssignedExamSeeder
 *
 * Tạo 1 đề thi Cambridge Young Learners (Starters) thật sự dành cho kids và
 * GIAO cho lớp kids + các tài khoản kids test, để màn hình "Bài thi của em"
 * (KidsDashboard) có dữ liệu hiển thị.
 *
 * - Đề: eType=GENERAL, age_group=kids, eStatus=published → lọt qua mọi bộ lọc
 *   tuổi ở backend StudentTestController@index.
 * - Câu hỏi: multiple_choice + answers (đúng định dạng KidsTestTaking đọc được).
 * - Idempotent: nhận diện theo exam_code 'KIDS-STARTERS-DEMO', chạy lại không nhân đôi.
 */
class KidsAssignedExamSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = DB::table('users')->where('uRole', 'teacher')->first();
        if (!$teacher) {
            $this->command->error('Không tìm thấy giáo viên. Hãy seed user trước.');
            return;
        }
        $teacherId = $teacher->uId;

        DB::transaction(function () use ($teacherId) {
            // ─── 1. Đề thi (idempotent theo exam_code) ──────────────────────
            $examCode = 'KIDS-STARTERS-DEMO';
            $existing = DB::table('exams')->where('exam_code', $examCode)->first();

            if ($existing) {
                $examId = $existing->eId;
                $this->command->info("Đề đã tồn tại (eId={$examId}), chỉ kiểm tra lại assignment.");
            } else {
                $examId = DB::table('exams')->insertGetId([
                    'exam_code'         => $examCode,
                    'eTitle'            => 'Cambridge Starters – Bài thi mẫu',
                    'eDescription'      => 'Đề thi mẫu cho bé luyện tập: màu sắc, con vật, đồ vật quanh em.',
                    'eDuration'         => 20,
                    'eDuration_minutes' => 20,
                    'eTotal_score'      => 50,
                    'ePass_score'       => 30,
                    'eType'             => 'GENERAL',
                    'age_group'         => 'kids',
                    'eStatus'           => 'published',
                    'eVisibility'       => 'public',
                    'teacher_id'        => $teacherId,
                    'eTeacher_id'       => $teacherId,
                    'eCreated_at'       => now(),
                ]);

                $this->seedQuestions($examId);
                $this->command->info("✓ Tạo đề Cambridge Starters (eId={$examId}) + 5 câu hỏi.");
            }

            // ─── 2. Giao bài ────────────────────────────────────────────────
            // a) Giao cho lớp kids (class 3 — Bé Minh đang ở lớp này)
            $kidsClassIds = DB::table('classes')->where('age_group', 'kids')->pluck('cId')->all();
            foreach ($kidsClassIds as $cid) {
                $this->ensureAssignment($examId, $teacherId, 'class', $cid, $cid);
            }

            // b) Giao trực tiếp CHỈ cho học viên kids CHƯA có lớp (tránh trùng thẻ
            //    với assignment theo lớp ở trên).
            $kidIds = DB::table('users')
                ->where('uRole', 'student')
                ->where('age_group', 'kids')
                ->whereNull('class_id')
                ->pluck('uId')->all();
            foreach ($kidIds as $uid) {
                $this->ensureAssignment($examId, $teacherId, 'student', $uid, null);
            }

            $this->command->info('✓ Đã giao đề cho ' . count($kidsClassIds) . ' lớp kids và ' . count($kidIds) . ' học viên kids (chưa có lớp).');
        });
    }

    /** Tạo assignment nếu chưa có (idempotent theo exam + target). */
    private function ensureAssignment(int $examId, int $teacherId, string $targetType, int $targetId, ?int $classId): void
    {
        $exists = DB::table('test_assignments')
            ->where('exam_id', $examId)
            ->where('taTarget_type', $targetType)
            ->where('taTarget_id', $targetId)
            ->exists();
        if ($exists) {
            return;
        }

        DB::table('test_assignments')->insert([
            'exam_id'        => $examId,
            'age_group'      => 'kids',
            'taTarget_type'  => $targetType,
            'taTarget_id'    => $targetId,
            'student_id'     => $targetType === 'student' ? $targetId : null,
            'class_id'       => $classId,
            'taTeacher_id'   => $teacherId,
            'assigned_by'    => $teacherId,
            'taStart_time'   => now(),
            'taDeadline'     => Carbon::now()->addDays(14),
            'taMax_attempt'  => 3,
            'taIs_public'    => 0,
            'status'         => 'active',
            'taCreated_at'   => now(),
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);
    }

    /** 5 câu trắc nghiệm thân thiện cho bé, mỗi câu 4 đáp án. */
    private function seedQuestions(int $examId): void
    {
        $questions = [
            ['What color is the sky on a sunny day? ☀️', [['Blue', true], ['Green', false], ['Red', false], ['Black', false]]],
            ['How many legs does a cat have? 🐱',         [['Two', false], ['Four', true], ['Six', false], ['Eight', false]]],
            ['Which animal says "moo"? 🐮',               [['Dog', false], ['Cat', false], ['Cow', true], ['Duck', false]]],
            ['What do we use to see? 👀',                 [['Ears', false], ['Nose', false], ['Hands', false], ['Eyes', true]]],
            ['Which fruit is yellow? 🍌',                 [['Banana', true], ['Apple', false], ['Grape', false], ['Cherry', false]]],
        ];

        $order = 1;
        foreach ($questions as [$content, $answers]) {
            $qId = DB::table('questions')->insertGetId([
                'exam_id'     => $examId,
                'qContent'    => $content,
                'qType'       => 'multiple_choice',
                'age_group'   => 'kids',
                'qPoints'     => 10,
                'qScore'      => 10,
                'qOrder'      => $order,
                'qDifficulty' => 'easy',
                'qCreated_at' => now(),
            ]);
            foreach ($answers as [$text, $isCorrect]) {
                DB::table('answers')->insert([
                    'question_id' => $qId,
                    'aContent'    => $text,
                    'aIs_correct' => $isCorrect ? 1 : 0,
                ]);
            }
            $order++;
        }
    }
}
