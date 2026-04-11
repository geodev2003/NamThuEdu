<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPoint extends Model
{
    use HasFactory;

    protected $table = 'student_points';
    public $timestamps = false;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'student_id',
        'points',
        'source',
        'source_id',
        'description',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }
}
