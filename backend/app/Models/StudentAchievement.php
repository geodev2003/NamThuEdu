<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAchievement extends Model
{
    public $timestamps = false; // Disable automatic timestamps
    
    protected $fillable = [
        'student_id',
        'achievement_id',
        'current_value',
        'target_value',
        'is_completed',
        'completed_at',
        'metadata',
    ];

    protected $casts = [
        'current_value' => 'integer',
        'target_value' => 'integer',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }

    public function achievement(): BelongsTo
    {
        return $this->belongsTo(Achievement::class);
    }
}
