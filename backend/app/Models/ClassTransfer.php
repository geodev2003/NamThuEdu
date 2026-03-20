<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassTransfer extends Model
{
    use HasFactory;

    protected $table = 'class_transfers';

    protected $fillable = [
        'student_id',
        'from_class_id',
        'to_class_id',
        'teacher_id',
        'reason',
        'notes',
        'transferred_at',
    ];

    protected $casts = [
        'transferred_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }

    public function fromClass()
    {
        return $this->belongsTo(Classes::class, 'from_class_id', 'cId');
    }

    public function toClass()
    {
        return $this->belongsTo(Classes::class, 'to_class_id', 'cId');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id', 'uId');
    }

    /**
     * Scopes
     */
    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeByClass($query, $classId)
    {
        return $query->where(function($q) use ($classId) {
            $q->where('from_class_id', $classId)
              ->orWhere('to_class_id', $classId);
        });
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('transferred_at', '>=', now()->subDays($days));
    }
}