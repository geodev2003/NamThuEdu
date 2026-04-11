<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'age_group',
        'total_attempts',
        'total_completions',
        'avg_score',
        'avg_completion_time',
        'engagement_rate',
        'performance_breakdown',
    ];

    protected $casts = [
        'avg_score' => 'decimal:2',
        'avg_completion_time' => 'decimal:2',
        'engagement_rate' => 'decimal:2',
        'performance_breakdown' => 'array',
    ];

    /**
     * Relationship with Exam
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Update analytics after submission
     */
    public static function updateAfterSubmission($examId, $ageGroup, $score, $completionTime)
    {
        $analytics = self::firstOrCreate(
            ['exam_id' => $examId, 'age_group' => $ageGroup],
            [
                'total_attempts' => 0,
                'total_completions' => 0,
                'avg_score' => 0,
                'avg_completion_time' => 0,
                'engagement_rate' => 0,
            ]
        );

        $analytics->total_attempts++;
        $analytics->total_completions++;
        
        // Calculate new averages
        $analytics->avg_score = (($analytics->avg_score * ($analytics->total_completions - 1)) + $score) / $analytics->total_completions;
        $analytics->avg_completion_time = (($analytics->avg_completion_time * ($analytics->total_completions - 1)) + $completionTime) / $analytics->total_completions;
        
        $analytics->save();

        return $analytics;
    }
}
