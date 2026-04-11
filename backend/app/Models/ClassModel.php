<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    use HasFactory;

    protected $table = 'classes';
    protected $primaryKey = 'cId';
    public $timestamps = false;
    
    protected $fillable = [
        'cName',
        'cTeacher_id',
        'cDescription',
        'age_group',
        'max_students',
        'cStatus',
        'course',
    ];
    
    protected $casts = [
        'max_students' => 'integer',
        'cCreated_at' => 'datetime',
    ];
    
    protected $appends = ['current_student_count', 'is_full'];
    
    /**
     * Relationships
     */
    
    // Teacher who manages this class
    public function teacher()
    {
        return $this->belongsTo(User::class, 'cTeacher_id', 'uId');
    }
    
    // Students in this class
    public function students()
    {
        return $this->hasMany(User::class, 'class_id', 'cId')
                    ->where('uRole', 'student');
    }
    
    // Courses in this class
    public function courses()
    {
        return $this->hasMany(Course::class, 'class_id', 'cId');
    }
    
    /**
     * Accessors
     */
    public function getCurrentStudentCountAttribute()
    {
        return $this->students()->count();
    }
    
    public function getIsFullAttribute()
    {
        return $this->current_student_count >= $this->max_students;
    }
    
    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('cStatus', 'active');
    }
    
    public function scopeByAgeGroup($query, $ageGroup)
    {
        return $query->where('age_group', $ageGroup);
    }
    
    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('cTeacher_id', $teacherId);
    }
    
    /**
     * Boot method for model events
     */
    protected static function boot()
    {
        parent::boot();
        
        // Prevent deletion of class with enrolled students
        static::deleting(function ($class) {
            if ($class->students()->count() > 0) {
                throw new \Exception('Cannot delete class with enrolled students. Please transfer students first.');
            }
        });
    }
}
