<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'questions';
    protected $primaryKey = 'qId';
    public $timestamps = false;
    const CREATED_AT = 'qCreated_at';

    protected $fillable = [
        'exam_id',
        'qContent',
        'qMedia_url',
        'qPoints',
        'qTranscript',
        'qExplanation',
        'qListen_limit',
    ];

    protected $casts = [
        'qCreated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'eId');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'question_id', 'qId');
    }

    public function submissionAnswers()
    {
        return $this->hasMany(SubmissionAnswer::class, 'question_id', 'qId');
    }
}
