<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'category';
    protected $primaryKey = 'caId';
    public $timestamps = false;

    protected $fillable = [
        'caName',
    ];

    /**
     * Relationships
     */
    public function courses()
    {
        return $this->hasMany(Course::class, 'cCategory', 'caId');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'pCategory', 'caId');
    }
}
