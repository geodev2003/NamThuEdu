<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentStats extends Model
{
    protected $fillable = [
        'student_id',
        'lessons_completed',
        'exams_taken',
        'practice_sessions',
        'total_points',
        'average_score',
        'study_time_minutes',
    ];

    protected $casts = [
        'lessons_completed' => 'integer',
        'exams_taken' => 'integer',
        'practice_sessions' => 'integer',
        'total_points' => 'integer',
        'average_score' => 'decimal:2',
        'study_time_minutes' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }
}
