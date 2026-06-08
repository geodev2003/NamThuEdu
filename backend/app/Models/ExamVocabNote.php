<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamVocabNote extends Model
{
    protected $fillable = [
        'user_id',
        'exam_id',
        'word',
        'context',
    ];
}
