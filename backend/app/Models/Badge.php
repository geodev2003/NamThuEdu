<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'rarity',
        'age_group',
        'requirements',
        'coin_reward',
        'is_active',
    ];

    protected $casts = [
        'requirements' => 'array',
        'coin_reward' => 'integer',
        'is_active' => 'boolean',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'student_badges', 'badge_id', 'student_id')
                    ->withPivot('earned_at', 'metadata')
                    ->withTimestamps();
    }
}
