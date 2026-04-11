<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentCoin extends Model
{
    protected $fillable = [
        'student_id',
        'total_coins',
        'lifetime_coins',
        'spent_coins',
    ];

    protected $casts = [
        'total_coins' => 'integer',
        'lifetime_coins' => 'integer',
        'spent_coins' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'uId');
    }
}
