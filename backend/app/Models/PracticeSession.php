<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeSession extends Model
{
    use HasFactory;

    protected $table = 'practice_sessions';
    protected $primaryKey = 'ps_id';
    public $timestamps = false;
    const CREATED_AT = 'ps_created_at';
    const UPDATED_AT = 'ps_updated_at';

    protected $fillable = [
        'ps_title',
        'ps_description',
        'ps_type',
        'ps_purpose',
        'ps_target_skill',
        'ps_topic',
        'ps_difficulty',
        'ps_duration_minutes',
        'ps_question_count',
        'ps_teacher_id',
        'ps_exam_id',
        'ps_config',
        'ps_is_active',
    ];

    protected $casts = [
        'ps_config' => 'array',
        'ps_is_active' => 'boolean',
        'ps_created_at' => 'datetime',
        'ps_updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'ps_teacher_id', 'uId');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'ps_exam_id', 'eId');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('ps_is_active', true);
    }

    public function scopeBySkill($query, $skill)
    {
        return $query->where('ps_target_skill', $skill);
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('ps_difficulty', $difficulty);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('ps_type', $type);
    }
}