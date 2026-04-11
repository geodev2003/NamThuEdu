<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'age_group',
        'template_type',
        'template_config',
        'default_settings',
        'is_active',
        'usage_count',
        'avg_rating',
    ];

    protected $casts = [
        'template_config' => 'array',
        'default_settings' => 'array',
        'is_active' => 'boolean',
        'avg_rating' => 'decimal:2',
    ];

    /**
     * Scope for active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific age group
     */
    public function scopeForAgeGroup($query, $ageGroup)
    {
        return $query->where('age_group', $ageGroup)
                    ->orWhere('age_group', 'all');
    }

    /**
     * Increment usage count
     */
    public function incrementUsage()
    {
        $this->increment('usage_count');
    }
}
