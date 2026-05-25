<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetKeyword extends Model
{
    protected $table = 'asset_keywords';

    public $timestamps = false;

    protected $fillable = [
        'asset_id',
        'keyword',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relationships
    public function asset(): BelongsTo
    {
        return $this->belongsTo(ContributorAsset::class, 'asset_id');
    }

    // Static helper to sync keywords
    public static function syncKeywords($assetId, array $keywords)
    {
        // Remove old keywords
        self::where('asset_id', $assetId)->delete();

        // Add new keywords
        foreach ($keywords as $keyword) {
            $keyword = trim($keyword);
            if (!empty($keyword)) {
                self::create([
                    'asset_id' => $assetId,
                    'keyword' => $keyword,
                ]);
            }
        }
    }
}
