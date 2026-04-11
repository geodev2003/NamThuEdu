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
    public function scopeEnrolled($query)
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
    
    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
    
    public function scopeByCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }
    
    /**
     * Boot method for model events
     */
    protected static function boot()
    {
        parent::boot();
        
        // Validate before creating enrollment
        static::creating(function ($enrollment) {
            $student = User::find($enrollment->student_id);
            $course = Course::with('class')->find($enrollment->course_id);
            
            if (!$student) {
                throw new \Exception('Student not found');
            }
            
            if (!$course) {
                throw new \Exception('Course not found');
            }
            
            // Validate student has a class
            if (!$student->class_id) {
                throw new \Exception('Student must be assigned to a class before enrolling in courses');
            }
            
            // Validate course belongs to student's class
            if ($student->class_id !== $course->class_id) {
                $studentClass = $student->class ? $student->class->cName : 'Unknown';
                $courseClass = $course->class ? $course->class->cName : 'Unknown';
                
                throw new \Exception(
                    "Course '{$course->cName}' does not belong to your class. " .
                    "Your class: {$studentClass}, Course class: {$courseClass}"
                );
            }
            
            // Check for duplicate enrollment
            $existing = self::where('course_id', $enrollment->course_id)
                ->where('student_id', $enrollment->student_id)
                ->whereIn('status', ['enrolled', 'completed'])
                ->exists();
            
            if ($existing) {
                throw new \Exception('Student is already enrolled in this course');
            }
            
            // Set enrolled_at if not set
            if (!$enrollment->enrolled_at) {
                $enrollment->enrolled_at = now();
            }
        });
        
        // Update completed_at when status changes to completed
        static::updating(function ($enrollment) {
            if ($enrollment->isDirty('status') && $enrollment->status === 'completed') {
                $enrollment->completed_at = now();
            }
        });
    }
}
