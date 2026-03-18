<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $table = 'answers';
    protected $primaryKey = 'aId';
    public $timestamps = false;

    protected $fillable = [
        'question_id',
        'aContent',
        'aIs_correct',
    ];

    protected $casts = [
        'aIs_correct' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'qId');
    }
}
