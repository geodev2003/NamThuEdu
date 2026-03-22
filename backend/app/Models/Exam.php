<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $table = 'exams';
    protected $primaryKey = 'eId';
    public $timestamps = false;
    const CREATED_AT = 'eCreated_at';

    protected $fillable = [
        'exam_type_id',
        'template_id', // New: Link to exam template
        'exam_code',
        'eTitle',
        'eDescription',
        'eDifficulty_level',
        'eTarget_level',
        'eDuration',
        'eTotal_score',
        'ePass_score',
        'eStatus',
        'eVisibility',
        'teacher_id',
        'eTags',
        'eType',
        'eSkill',
        'eTeacher_id',
        'eDuration_minutes',
        'eIs_private',
        'eSource_type',
        'ePurpose', // New: Purpose of exam (exam, practice, review, etc.)
        'eTopic', // New: Topic for practice sessions
        'eDifficulty', // New: Difficulty level
        'eParent_exam_id', // New: Link to parent exam if cloned
    ];

    protected $casts = [
        'eIs_private' => 'boolean',
        'eCreated_at' => 'datetime',
        'eTags' => 'array',
    ];

    /**
     * Relationships
     */
    public function examTemplate()
    {
        return $this->belongsTo(ExamTemplate::class, 'template_id');
    }

    // Alias for examTemplate relationship
    public function template()
    {
        return $this->belongsTo(ExamTemplate::class, 'template_id');
    }

    public function examType()
    {
        return $this->belongsTo(ExamType::class, 'exam_type_id', 'etId');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'eTeacher_id', 'uId');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'exam_id', 'eId');
    }

    public function testAssignments()
    {
        return $this->hasMany(TestAssignment::class, 'exam_id', 'eId');
    }

    public function assignments()
    {
        return $this->hasMany(TestAssignment::class, 'exam_id', 'eId');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'exam_id', 'eId');
    }

    public function practiceSession()
    {
        return $this->hasOne(PracticeSession::class, 'ps_exam_id', 'eId');
    }

    public function parentExam()
    {
        return $this->belongsTo(Exam::class, 'eParent_exam_id', 'eId');
    }

    public function childExams()
    {
        return $this->hasMany(Exam::class, 'eParent_exam_id', 'eId');
    }

    /**
     * Scopes
     */
    public function scopePractice($query)
    {
        return $query->where('ePurpose', 'practice');
    }

    public function scopeByPurpose($query, $purpose)
    {
        return $query->where('ePurpose', $purpose);
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('eDifficulty', $difficulty);
    }
}
