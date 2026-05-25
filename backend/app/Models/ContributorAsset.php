<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContributorAsset extends Model
{
    use SoftDeletes;

    protected $table = 'contributor_assets';

    protected $fillable = [
        'contributor_id',
        'filename',
        'file_path',
        'file_size',
        'mime_type',
        'width',
        'height',
        'title',
        'description',
        'keywords',
        'category_1',
        'category_2',
        'status',
        'submitted_at',
        'reviewed_at',
        'approved_at',
        'published_at',
        'reviewer_id',
        'rejection_reason',
        'views_count',
        'downloads_count',
    ];

    protected $casts = [
        'keywords' => 'array',
        'uploaded_at' => 'datetime',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'thumbnail_url',
        'full_url',
    ];

    // Relationships
    public function contributor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'contributor_id', 'uId');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id', 'uId');
    }

    public function metadataHistory(): HasMany
    {
        return $this->hasMany(AssetMetadataHistory::class, 'asset_id');
    }

    public function assetKeywords(): HasMany
    {
        return $this->hasMany(AssetKeyword::class, 'asset_id');
    }

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopePendingReview($query)
    {
        return $query->where('status', 'pending_review');
    }

    public function scopeApproved($query)
    {
        return $query->whereIn('status', ['approved', 'live']);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeLive($query)
    {
        return $query->where('status', 'live');
    }

    public function scopeByContributor($query, $contributorId)
    {
        return $query->where('contributor_id', $contributorId);
    }

    // Helper methods
    public function canEdit(): bool
    {
        return in_array($this->status, ['draft', 'approved', 'live']);
    }

    public function canDelete(): bool
    {
        return $this->status === 'draft';
    }

    public function canSubmit(): bool
    {
        return $this->status === 'draft';
    }

    public function isLive(): bool
    {
        return in_array($this->status, ['approved', 'live']);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending_review';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    // Accessors
    public function getThumbnailUrlAttribute(): string
    {
        $baseUrl = config('app.url');
        return $baseUrl . '/' . $this->file_path;
    }

    public function getFullUrlAttribute(): string
    {
        $baseUrl = config('app.url');
        return $baseUrl . '/' . $this->file_path;
    }

    // Methods
    public function submit(): bool
    {
        if (!$this->canSubmit()) {
            return false;
        }

        $this->status = 'pending_review';
        $this->submitted_at = now();
        return $this->save();
    }

    public function approve($reviewerId): bool
    {
        $this->status = 'approved';
        $this->reviewed_at = now();
        $this->approved_at = now();
        $this->reviewer_id = $reviewerId;
        $this->rejection_reason = null;
        return $this->save();
    }

    public function reject($reviewerId, $reason): bool
    {
        $this->status = 'rejected';
        $this->reviewed_at = now();
        $this->reviewer_id = $reviewerId;
        $this->rejection_reason = $reason;
        return $this->save();
    }

    public function publish(): bool
    {
        if ($this->status !== 'approved') {
            return false;
        }

        $this->status = 'live';
        $this->published_at = now();
        return $this->save();
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementDownloads(): void
    {
        $this->increment('downloads_count');
    }
}
