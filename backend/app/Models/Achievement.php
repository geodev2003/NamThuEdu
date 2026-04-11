<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achievement extends Model
{
    protected $fillable = [
        'code',
        'name',
        'slug',
        'description',
        'icon',
        'category',
        'age_group',
        'target_value',
        'target_type',
        'coin_reward',
        'is_active',
    ];

    protected $casts = [
        'target_value' => 'integer',
        'coin_reward' => 'integer',
        'is_active' => 'boolean',
    ];

    public function studentAchievements(): HasMany
    {
        return $this->hasMany(StudentAchievement::class);
    }
}
