<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Exam;
use App\Models\User;
use App\Services\IELTSService;
use Database\Seeders\Ielts\IeltsSampleListeningData;
use Database\Seeders\Ielts\IeltsSampleReadingData;
use Database\Seeders\Ielts\IeltsSampleWritingSpeakingData;

/**
 * Seed 1 complete IELTS Academic exam — Cambridge-style.
 *
 * Result: 1 Exam (eId), 4 Listening sections (40 Q), 3 Reading passages (40 Q),
 *         2 Writing tasks, 3 Speaking parts. Total ~80 objective + 5 subjective.
 *
 * Usage:
 *   php artisan db:seed --class=Database\\Seeders\\IeltsAcademicSampleSeeder
 */
class IeltsAcademicSampleSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('uPhone', '0336695863')
            ->orWhere('uRole', 'teacher')
            ->first();

        if (!$teacher) {
            $this->command->error('No teacher user found. Aborting.');
            return;
        }

        $title = 'Cambridge IELTS Academic Sample — Full Test';

        // Avoid duplicates if seeder is re-run
        $existing = Exam::where('eTitle', $title)->first();
        if ($existing) {
            $this->command->warn("Exam '{$title}' already exists (eId={$existing->eId}). Re-publishing data.");
            $exam = $existing;
        } else {
            $exam = Exam::create([
                'eTitle'             => $title,
                'eDescription'       => 'Full IELTS Academic mock test — Listening (40 Q) + Reading (40 Q) + Writing (2 tasks) + Speaking (3 parts). Style: Cambridge IELTS. Use this as reference exam for all teachers and students.',
                'eType'              => 'IELTS',
                'eSkill'             => 'mixed',
                'eDuration_minutes'  => 165, // 30 + 60 + 60 + ~15
                'eTotal_score'       => 9,
                'ePass_score'        => 6,
                'eStatus'            => 'draft', // will be flipped to published by IELTSService
                'eIs_private'        => false,
                'eTeacher_id'        => $teacher->uId,
                'teacher_id'         => $teacher->uId,
                'age_group'          => 'adults',
                'content_type'       => 'exam',
                'difficulty_level'   => 'B2-C1',
                'eDifficulty_level'  => 'intermediate',
                'eTarget_level'      => 'B2',
                'eDuration'          => 165,
                'eVisibility'        => 'public',
                'eSource_type'       => 'manual',
                'ePurpose'           => 'exam',
                'eTopic'             => 'IELTS Academic',
                'eDifficulty'        => 'medium',
                'eTags'              => ['IELTS', 'Academic', 'Sample', 'Cambridge'],
            ]);
        }

        $this->command->info("Publishing IELTS sample exam (eId={$exam->eId})…");

        $payload = [
            'listening' => [
                'sections' => IeltsSampleListeningData::get(),
            ],
            'reading' => [
                'passages' => IeltsSampleReadingData::get(),
            ],
            'writing' => [
                'tasks' => IeltsSampleWritingSpeakingData::writing(),
            ],
            'speaking' => [
                'parts' => IeltsSampleWritingSpeakingData::speaking(),
            ],
        ];

        $result = IELTSService::publishIeltsExam($exam, 'Academic', $payload);

        $this->command->info('  ✔ Exam ID:        ' . $exam->eId);
        $this->command->info('  ✔ Test type:      Academic');
        $this->command->info('  ✔ Total questions: ' . ($result['total_questions'] ?? 0));
        $this->command->info('  ✔ Status:         published');
        $this->command->info('  ✔ Visibility:     public (shared with all teachers)');

        // Quick per-skill counts for verification
        $exam->refresh();
        $bySkill = $exam->questions()
            ->selectRaw('qSkill, COUNT(*) as c')
            ->groupBy('qSkill')
            ->pluck('c', 'qSkill')
            ->toArray();

        $this->command->line('');
        $this->command->info('  Question counts by skill:');
        foreach (['listening', 'reading', 'writing', 'speaking'] as $skill) {
            $cnt = $bySkill[$skill] ?? 0;
            $this->command->line(sprintf('    • %-10s %d', $skill, $cnt));
        }
    }
}
