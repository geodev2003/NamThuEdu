<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'section_name',
        'section_order',
        'duration_minutes',
        'question_count',
        'question_types',
        'instructions',
        'section_config',
    ];

    protected $casts = [
        'question_types' => 'array',
        'section_config' => 'array',
    ];

    /**
     * Relationships
     */
    public function examTemplate()
    {
        return $this->belongsTo(ExamTemplate::class, 'template_id');
    }

    /**
     * Scopes
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('section_order');
    }

    /**
     * Accessors
     */
    public function getFormattedDurationAttribute()
    {
        return $this->duration_minutes . ' minutes';
    }

    /**
     * Helper Methods
     */
    public function hasQuestionType($type)
    {
        return in_array($type, $this->question_types);
    }

    public function getQuestionTypesListAttribute()
    {
        return implode(', ', $this->question_types);
    }

    public function isListeningSection()
    {
        return stripos($this->section_name, 'listening') !== false;
    }

    public function isReadingSection()
    {
        return stripos($this->section_name, 'reading') !== false;
    }

    public function isWritingSection()
    {
        return stripos($this->section_name, 'writing') !== false;
    }

    public function isSpeakingSection()
    {
        return stripos($this->section_name, 'speaking') !== false;
    }
}