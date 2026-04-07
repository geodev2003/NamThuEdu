<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassEnrollment extends Model
{
    use HasFactory;

    protected $table = 'class_enrollments';
    protected $primaryKey = ['class_id', 'student_id'];
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'class_id',
        'student_id',
        'enrolled_at',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id', 'cId');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }
}
