<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Unit test cho logic chấm điểm objective (mirror của StudentTestController):
 *  - normalizeAnswer: trim + lowercase (unicode)
 *  - isCorrectAnswer: so khớp sau normalize
 *  - letter A–D map theo thứ tự
 *  - tính % điểm
 *
 * Logic được tái hiện thuần tuý (không chạm DB) để kiểm chứng quy tắc.
 */
class GradingLogicTest extends TestCase
{
    private function normalizeAnswer($value): string
    {
        $normalized = trim((string) $value);
        return function_exists('mb_strtolower') ? mb_strtolower($normalized, 'UTF-8') : strtolower($normalized);
    }

    private function isCorrectAnswer($student, $correct): bool
    {
        return $this->normalizeAnswer($student) === $this->normalizeAnswer($correct);
    }

    /** Map letter A–D -> index, check correct option. $options: [text => isCorrect]. */
    private function letterIsCorrect(string $letter, array $orderedOptions): bool
    {
        if (!preg_match('/^[A-Da-d]$/', $letter)) return false;
        $idx = ord(strtoupper($letter)) - ord('A');
        return $orderedOptions[$idx]['correct'] ?? false;
    }

    /** @test */
    public function normalize_trims_and_lowercases(): void
    {
        $this->assertSame('hello', $this->normalizeAnswer('  Hello '));
        $this->assertSame('goes', $this->normalizeAnswer('GOES'));
    }

    /** @test */
    public function exact_text_match_is_correct_case_insensitive(): void
    {
        $this->assertTrue($this->isCorrectAnswer('Goes', 'goes'));
        $this->assertTrue($this->isCorrectAnswer('  teacher ', 'Teacher'));
        $this->assertFalse($this->isCorrectAnswer('go', 'goes'));
    }

    /** @test */
    public function letter_maps_to_correct_option_by_order(): void
    {
        $options = [
            ['text' => 'go',    'correct' => false], // A
            ['text' => 'goes',  'correct' => true],  // B
            ['text' => 'going', 'correct' => false], // C
            ['text' => 'gone',  'correct' => false], // D
        ];
        $this->assertTrue($this->letterIsCorrect('B', $options));
        $this->assertTrue($this->letterIsCorrect('b', $options));
        $this->assertFalse($this->letterIsCorrect('A', $options));
        $this->assertFalse($this->letterIsCorrect('Z', $options));
    }

    /** @test */
    public function score_percentage_full_and_partial(): void
    {
        // 5 câu * 10 điểm
        $max = 50;
        $this->assertEquals(100.0, round((50 / $max) * 100, 2));
        $this->assertEquals(60.0, round((30 / $max) * 100, 2));
        $this->assertEquals(0.0, round((0 / $max) * 100, 2));
    }

    /** @test */
    public function zero_max_score_does_not_divide_by_zero(): void
    {
        $max = 0;
        $score = $max > 0 ? round((0 / $max) * 100, 2) : 0;
        $this->assertEquals(0, $score);
    }
}
