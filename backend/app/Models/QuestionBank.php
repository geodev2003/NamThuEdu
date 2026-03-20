<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionBank extends Model
{
    use HasFactory;

    protected $table = 'question_banks';
    protected $primaryKey = 'qb_id';
    public $timestamps = false;
    const CREATED_AT = 'qb_created_at';
    const UPDATED_AT = 'qb_updated_at';

    protected $fillable = [
        'qb_name',
        'qb_description',
        'qb_type',
        'qb_skill',
        'qb_topic',
        'qb_difficulty',
        'qb_teacher_id',
        'qb_is_public',
        'qb_question_count',
        'qb_tags',
    ];

    protected $casts = [
        'qb_tags' => 'array',
        'qb_is_public' => 'boolean',
        'qb_created_at' => 'datetime',
        'qb_updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'qb_teacher_id', 'uId');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'question_bank_questions', 'qb_id', 'question_id');
    }

    /**
     * Scopes
     */
    public function scopePublic($query)
    {
        return $query->where('qb_is_public', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('qb_type', $type);
    }

    public function scopeBySkill($query, $skill)
    {
        return $query->where('qb_skill', $skill);
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('qb_difficulty', $difficulty);
    }
}