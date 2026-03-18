<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_code',
        'template_name',
        'category',
        'level',
        'age_group',
        'total_duration_minutes',
        'skills',
        'sections',
        'instructions',
        'description',
        'is_active',
    ];

    protected $casts = [
        'skills' => 'array',
        'sections' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function templateSections()
    {
        return $this->hasMany(TemplateSection::class, 'template_id');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'template_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    public function scopeByAgeGroup($query, $ageGroup)
    {
        return $query->where('age_group', $ageGroup);
    }

    /**
     * Accessors
     */
    public function getFormattedDurationAttribute()
    {
        $hours = floor($this->total_duration_minutes / 60);
        $minutes = $this->total_duration_minutes % 60;
        
        if ($hours > 0) {
            return $hours . 'h ' . $minutes . 'm';
        }
        return $minutes . 'm';
    }

    public function getTotalQuestionsAttribute()
    {
        return collect($this->sections)->sum(function ($section) {
            return collect($section['parts'] ?? [])->sum('questions') ?? $section['questions'] ?? 0;
        });
    }

    /**
     * Helper Methods
     */
    public function isYoungLearners()
    {
        return $this->category === 'cambridge_young';
    }

    public function isCambridgeMain()
    {
        return $this->category === 'cambridge_main';
    }

    public function isInternational()
    {
        return $this->category === 'international';
    }

    public function hasSkill($skill)
    {
        return in_array($skill, $this->skills);
    }

    public function getSectionByName($sectionName)
    {
        return collect($this->sections)->firstWhere('name', $sectionName);
    }

    public function getPartsBySection($sectionName)
    {
        $section = $this->getSectionByName($sectionName);
        return $section['parts'] ?? [];
    }
}