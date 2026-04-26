<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogType extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_value',
        'type_label',
        'type_icon',
        'is_default',
        'sort_order',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get all blog types ordered by sort_order
     */
    public static function getAllOrdered()
    {
        return self::orderBy('sort_order')->get();
    }

    /**
     * Check if type value already exists
     */
    public static function typeExists(string $typeValue): bool
    {
        return self::where('type_value', $typeValue)->exists();
    }
}
