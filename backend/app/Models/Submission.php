<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $table = 'submissions';
    protected $primaryKey = 'sId';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'exam_id',
        'assignment_id',
        'sAttempt',
        'sStart_time',
        'sSubmit_time',
        'sGraded_time',
        'sScore',
        'sStatus' => 'draft',
        'sTeacher_feedback',
        'sGemini_feedback',
    ];

    protected $casts = [
        'sStart_time' => 'datetime',
        'sSubmit_time' => 'datetime',
        'sGraded_time' => 'datetime',
        'sScore' => 'decimal:2',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'uId');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'eId');
    }

    public function assignment()
    {
        return $this->belongsTo(TestAssignment::class, 'assignment_id', 'taId');
    }

    public function answers()
    {
        return $this->hasMany(SubmissionAnswer::class, 'submission_id', 'sId');
    }
}
