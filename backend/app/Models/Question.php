<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'questions';
    protected $primaryKey = 'qId';
    public $timestamps = false;
    const CREATED_AT = 'qCreated_at';

    protected $fillable = [
        'exam_id',
        'content_block_id', // NEW: Link to content_blocks
        'qContent',
        'qType',
        'qSection',
        'qSkill',          // Alternative to qSection (for frontend compatibility)
        'qSection_order',
        'qPart',           // Part number (1, 2, 3) for VSTEP structure
        'qSubPart',        // Cambridge sub-part number (Part 1, Part 2, etc. within a skill)
        'qMedia_url',
        'qAudio_duration', // Duration in seconds for audio questions
        'qPoints',
        'qTranscript',
        'qExplanation',
        'qListen_limit',
        'qConfig',
        'qDifficulty',
        'qTags',
        'qPassage_text',   // For reading passages (deprecated - use content_blocks)
        'qWord_count',     // For writing tasks
        'qTime_limit',     // For speaking tasks
        'qData',           // NEW: Flexible JSON metadata
        // Age-group content fields
        'age_group',
        'media_type',
        'interactive_config',
        'feedback_config',
        // Kids exam fields
        'kids_task_config',
        // Part reordering fields
        'qOrder',          // Display order
        'qPartNumber',     // Part number for display (Part 1, Part 2, etc.)
        'qCustomTitle',    // Custom title for the part
        'qSkillSection',   // Skill section (listening, reading, speaking)
    ];

    protected $casts = [
        'qCreated_at' => 'datetime',
        'qData' => 'array',            // NEW: Cast to array
        'interactive_config' => 'array',
        'feedback_config' => 'array',
        'kids_task_config' => 'array',
        'qOrder' => 'integer',
        'qPart' => 'integer',
        'qSubPart' => 'integer',
        'qPartNumber' => 'integer',
    ];

    /**
     * Relationships
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'eId');
    }

    public function contentBlock()
    {
        return $this->belongsTo(ContentBlock::class, 'content_block_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'question_id', 'qId');
    }

    public function submissionAnswers()
    {
        return $this->hasMany(SubmissionAnswer::class, 'question_id', 'qId');
    }

    /**
     * Kids exam relationships
     */
    public function taskType()
    {
        return $this->belongsTo(\stdClass::class, 'task_type_id', 'id')
            ->from('kids_task_types');
    }

    /**
     * Scope to get questions ordered by qOrder
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('qOrder', 'asc')->orderBy('qId', 'asc');
    }

    /**
     * Scope to get questions by skill section
     */
    public function scopeBySkillSection($query, $skillSection)
    {
        return $query->where('qSkillSection', $skillSection);
    }

    /**
     * Scope to get questions by sub-part (Cambridge mode)
     */
    public function scopeBySubPart($query, $part, $subPart)
    {
        return $query->where('qPart', $part)
                     ->where('qSubPart', $subPart);
    }

    /**
     * Scope to get Cambridge mode questions (has sub-part)
     */
    public function scopeCambridgeMode($query)
    {
        return $query->whereNotNull('qSubPart');
    }

    /**
     * Scope to get Flexible mode questions (no sub-part)
     */
    public function scopeFlexibleMode($query)
    {
        return $query->whereNull('qSubPart');
    }
}
