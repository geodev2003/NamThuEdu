<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Audit log entry for any grading action (AI or teacher).
 */
class GradingHistory extends Model
{
    use HasFactory;

    protected $table = 'grading_history';
    protected $primaryKey = 'ghId';

    protected $fillable = [
        'submission_id',
        'answer_id',
        'ghAction',
        'ghActor_id',
        'ghPrev_score',
        'ghNew_score',
        'ghNote',
        'ghMetadata',
    ];

    protected $casts = [
        'ghPrev_score' => 'decimal:2',
        'ghNew_score'  => 'decimal:2',
        'ghMetadata'   => 'array',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id', 'sId');
    }

    public function answer()
    {
        return $this->belongsTo(SubmissionAnswer::class, 'answer_id', 'saId');
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'ghActor_id', 'uId');
    }

    /* ─── Action helpers ─────────────────────────────────────────────── */

    public const ACTION_AI_GRADE        = 'ai_grade';
    public const ACTION_AI_REGRADE      = 'ai_regrade';
    public const ACTION_TEACHER_ACCEPT  = 'teacher_accept';
    public const ACTION_TEACHER_MODIFY  = 'teacher_modify';
    public const ACTION_TEACHER_SAVE    = 'teacher_save_all';
}
