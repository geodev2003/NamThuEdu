<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpLog extends Model
{
    use HasFactory;

    protected $table = 'otp_logs';
    protected $primaryKey = 'oId';
    const CREATED_AT = 'oCreated_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'userId',
        'oCode',
        'oExpired_at',
        'oVerified',
    ];

    protected $casts = [
        'oExpired_at' => 'datetime',
        'oCreated_at' => 'datetime',
        'oVerified' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'uId');
    }

    /**
     * Scopes
     */
    public function scopeValid($query)
    {
        return $query->where('oVerified', false)
                    ->where('oExpired_at', '>', now());
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('userId', $userId);
    }
}
