<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentReminder extends Model
{
    use HasFactory;

    protected $table = 'assignment_reminders';

    protected $fillable = [
        'assignment_id',
        'student_id',
        'teacher_id',
        'message',
        'dismissed_at',
        'read_at',
    ];

    protected $casts = [
        'dismissed_at' => 'datetime',
        'read_at'      => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(TestAssignment::class, 'assignment_id', 'taId');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id', 'uId');
    }

    public function scopeActive($q)
    {
        return $q->whereNull('dismissed_at');
    }

    public function scopeForStudent($q, $studentId)
    {
        return $q->where('student_id', $studentId);
    }
}
