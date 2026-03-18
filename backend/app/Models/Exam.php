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
    ];

    protected $casts = [
        'eIs_private' => 'boolean',
        'eCreated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function examTemplate()
    {
        return $this->belongsTo(ExamTemplate::class, 'template_id');
    }

    public function examType()
    {
        return $this->belongsTo(ExamType::class, 'exam_type_id', 'etId');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id', 'uId')
                    ->orWhere('eTeacher_id', 'uId'); // Backward compatibility
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
}
