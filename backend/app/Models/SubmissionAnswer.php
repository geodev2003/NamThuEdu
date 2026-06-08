<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionAnswer extends Model
{
    use HasFactory;

    protected $table = 'submission_answers';
    protected $primaryKey = 'saId';
    public $timestamps = false;

    protected $fillable = [
        'submission_id',
        'question_id',
        'saAnswer_text',
        'saIs_correct',
        'saPoints_awarded',
        'saTeacher_feedback',

        // AI grading fields
        'saAi_score',
        'saAi_feedback',
        'saAi_criteria',
        'saAi_model',
        'saAi_graded_at',

        // Review state
        'saReview_status',
        'saReviewed_at',
        'saReviewed_by',
    ];

    protected $casts = [
        'saIs_correct'      => 'boolean',
        'saPoints_awarded'  => 'decimal:2',
        'saAi_score'        => 'decimal:2',
        'saAi_criteria'     => 'array',
        'saAi_graded_at'    => 'datetime',
        'saReviewed_at'     => 'datetime',
    ];

    /**
     * Relationships
     */
    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id', 'sId');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'qId');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'saReviewed_by', 'uId');
    }

    public function gradingHistory()
    {
        return $this->hasMany(GradingHistory::class, 'answer_id', 'saId');
    }

    /* ─── Helpers ──────────────────────────────────────────────────── */

    /** True if AI has produced a score for this answer. */
    public function hasAiScore(): bool
    {
        return $this->saAi_score !== null;
    }

    /** True if the teacher has reviewed (accepted or modified) the AI suggestion. */
    public function isReviewed(): bool
    {
        return in_array($this->saReview_status, ['accepted', 'modified'], true);
    }
}
