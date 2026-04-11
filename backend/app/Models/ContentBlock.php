<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentBlock extends Model
{
    protected $table = 'content_blocks';

    protected $fillable = [
        'exam_id',
        'block_type',
        'content',
        'metadata',
        'display_order',
    ];

    protected $casts = [
        'metadata' => 'array',
        'display_order' => 'integer',
    ];

    /**
     * Relationship: ContentBlock belongs to Exam
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'eId');
    }

    /**
     * Relationship: ContentBlock has many Questions
     */
    public function questions()
    {
        return $this->hasMany(Question::class, 'content_block_id');
    }

    /**
     * Scope: Filter by block type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('block_type', $type);
    }

    /**
     * Scope: Order by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
