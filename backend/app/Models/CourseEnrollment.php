<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseEnrollment extends Model
{
    use HasFactory;

    protected $table = 'course_enrollments';

    protected $fillable = [
        'course_id',
        'student_id',
        'status',
        'fee_paid',
        'notes',
        'enrolled_at',
        'completed_at',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
        'fee_paid' => 'decimal:2',
    ];

    /**
     * Relationships
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'cId');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'enrolled');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeDropped($query)
    {
        return $query->where('status', 'dropped');
    }

    public function scopeByCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}