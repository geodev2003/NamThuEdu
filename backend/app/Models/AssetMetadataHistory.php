<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetMetadataHistory extends Model
{
    protected $table = 'asset_metadata_history';

    public $timestamps = false;

    protected $fillable = [
        'asset_id',
        'field_name',
        'old_value',
        'new_value',
        'changed_by',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    // Relationships
    public function asset(): BelongsTo
    {
        return $this->belongsTo(ContributorAsset::class, 'asset_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by', 'uId');
    }

    // Static helper to log changes
    public static function logChange($assetId, $fieldName, $oldValue, $newValue, $changedBy)
    {
        return self::create([
            'asset_id' => $assetId,
            'field_name' => $fieldName,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'changed_by' => $changedBy,
            'changed_at' => now(),
        ]);
    }
}
