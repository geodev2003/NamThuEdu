<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';
    protected $primaryKey = 'uId';
    protected $dates = ['uDeleted_at'];
    const DELETED_AT = 'uDeleted_at';
    const CREATED_AT = 'uCreated_at';
    const UPDATED_AT = null; // No updated_at column

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uName',
        'uPhone',
        'uPassword',
        'uGender',
        'uAddress',
        'uClass',
        'uRole',
        'uDoB',
        'uStatus',
        'refresh_token',
        'refresh_token_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'uPassword',
        'refresh_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uDoB' => 'date',
        'uGender' => 'boolean',
        'uCreated_at' => 'datetime',
        'refresh_token_expires_at' => 'datetime',
    ];

    /**
     * Get the password for authentication.
     */
    public function getAuthPassword()
    {
        return $this->uPassword;
    }

    /**
     * Get the identifier for authentication.
     */
    public function getAuthIdentifierName()
    {
        return 'uId';
    }

    /**
     * Get the identifier for authentication.
     */
    public function getAuthIdentifier()
    {
        return $this->uId;
    }

    /**
     * Relationships
     */
    public function courses()
    {
        return $this->hasMany(Course::class, 'cTeacher', 'uId');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'pAuthor_id', 'uId');
    }

    public function otpLogs()
    {
        return $this->hasMany(OtpLog::class, 'userId', 'uId');
    }
}
