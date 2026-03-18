<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamType extends Model
{
    use HasFactory;

    protected $table = 'exam_types';
    protected $primaryKey = 'etId';
    public $timestamps = false;
    const CREATED_AT = 'etCreated_at';

    protected $fillable = [
        'type_code',
        'type_name',
        'etDescription',
        'etHas_reading',
        'etHas_listening',
        'etHas_writing',
        'etHas_speaking',
        'etScoring_system',
        'etMax_score',
        'etMin_pass_score',
        'etOfficial_website',
        'etIs_active',
    ];

    protected $casts = [
        'etHas_reading' => 'boolean',
        'etHas_listening' => 'boolean',
        'etHas_writing' => 'boolean',
        'etHas_speaking' => 'boolean',
        'etIs_active' => 'boolean',
        'etMax_score' => 'decimal:2',
        'etMin_pass_score' => 'decimal:2',
        'etCreated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function exams()
    {
        return $this->hasMany(Exam::class, 'exam_type_id', 'etId');
    }
}