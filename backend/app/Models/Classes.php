<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasFactory;

    protected $table = 'classes';
    protected $primaryKey = 'cId';
    public $timestamps = false;
    const CREATED_AT = 'cCreated_at';

    protected $fillable = [
        'cName',
        'cTeacher_id',
        'cDescription',
        'cStatus',
        'course',
    ];

    protected $casts = [
        'cCreated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'cTeacher_id', 'uId');
    }

    public function parentCourse()
    {
        return $this->belongsTo(Classes::class, 'course', 'cId');
    }

    public function enrollments()
    {
        return $this->hasMany(ClassEnrollment::class, 'class_id', 'cId');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'class_enrollments', 'class_id', 'student_id', 'cId', 'uId')
                    ->withPivot('enrolled_at');
    }
}
