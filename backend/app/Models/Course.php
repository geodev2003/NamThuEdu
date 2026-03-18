<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'course';
    protected $primaryKey = 'cId';
    const CREATED_AT = 'cCreateAt';
    const UPDATED_AT = 'cUpdateAt';

    protected $fillable = [
        'cName',
        'cCategory',
        'cNumberOfStudent',
        'cTime',
        'cSchedule',
        'cStartDate',
        'cEndDate',
        'cStatus',
        'cTeacher',
        'cDescription',
    ];

    protected $casts = [
        'cStartDate' => 'date',
        'cEndDate' => 'date',
        'cCreateAt' => 'datetime',
        'cUpdateAt' => 'datetime',
        'cDeleteAt' => 'datetime',
    ];

    protected $dates = ['cDeleteAt'];

    /**
     * Relationships
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'cTeacher', 'uId');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'cCategory', 'caId');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('cStatus', 'active');
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('cTeacher', $teacherId);
    }
}
