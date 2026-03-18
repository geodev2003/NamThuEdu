<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestAssignment extends Model
{
    use HasFactory;

    protected $table = 'test_assignments';
    protected $primaryKey = 'taId';
    public $timestamps = false;
    const CREATED_AT = 'taCreated_at';

    protected $fillable = [
        'exam_id',
        'taTarget_type',
        'taTarget_id',
        'taDeadline',
        'taMax_attempt',
        'taIs_public',
    ];

    protected $casts = [
        'taDeadline' => 'datetime',
        'taIs_public' => 'boolean',
        'taCreated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'eId');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'assignment_id', 'taId');
    }

    /**
     * Get the target (class or student)
     */
    public function target()
    {
        if ($this->taTarget_type === 'class') {
            return $this->belongsTo(Classes::class, 'taTarget_id', 'cId');
        } else {
            return $this->belongsTo(User::class, 'taTarget_id', 'uId');
        }
    }
}
