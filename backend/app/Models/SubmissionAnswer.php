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
    ];

    protected $casts = [
        'saIs_correct' => 'boolean',
        'saPoints_awarded' => 'decimal:2',
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
}
