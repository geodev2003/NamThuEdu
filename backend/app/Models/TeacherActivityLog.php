<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherActivityLog extends Model
{
    protected $table = 'teacher_activity_logs';

    public $timestamps = false; // chỉ có created_at, useCurrent

    protected $fillable = [
        'teacher_id',
        'action',
        'entity_type',
        'entity_id',
        'detail',
        'meta',
        'created_at',
    ];

    protected $casts = [
        'meta'       => 'array',
        'created_at' => 'datetime',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id', 'uId');
    }
}
