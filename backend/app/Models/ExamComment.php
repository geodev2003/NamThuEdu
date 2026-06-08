<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamComment extends Model
{
    protected $table = 'exam_comments';

    protected $fillable = ['exam_id', 'user_id', 'parent_id', 'content', 'is_deleted'];

    protected $casts = ['is_deleted' => 'boolean'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'uId');
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'eId');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ExamComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ExamComment::class, 'parent_id')
                    ->with('user')
                    ->orderBy('created_at');
    }
}
