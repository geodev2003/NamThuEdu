<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * AdminActivityLog — audit log cho hành động admin.
 */
class AdminActivityLog extends Model
{
    protected $table = 'admin_activity_logs';

    public $timestamps = false; // chỉ có created_at, useCurrent

    protected $fillable = [
        'admin_id',
        'action',
        'entity_type',
        'entity_id',
        'detail',
        'method',
        'path',
        'ip',
        'status_code',
        'meta',
        'created_at',
    ];

    protected $casts = [
        'meta'        => 'array',
        'status_code' => 'integer',
        'created_at'  => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'uId');
    }

    /**
     * Ghi nhanh một log audit. Best-effort: không throw để không chặn nghiệp vụ.
     *
     * @param  int    $adminId
     * @param  string $action
     * @param  array  $attrs  (entity_type, entity_id, detail, method, path, ip, status_code, meta)
     */
    public static function record(int $adminId, string $action, array $attrs = []): void
    {
        try {
            self::create(array_merge([
                'admin_id'   => $adminId,
                'action'     => $action,
                'created_at' => now(),
            ], $attrs));

            // Cleanup: giữ tối đa 1000 log gần nhất / admin
            $oldIds = self::where('admin_id', $adminId)
                ->orderByDesc('id')
                ->skip(1000)
                ->take(5000)
                ->pluck('id');
            if ($oldIds->isNotEmpty()) {
                self::whereIn('id', $oldIds)->delete();
            }
        } catch (\Throwable $e) {
            \Log::warning('AdminActivityLog record failed: ' . $e->getMessage());
        }
    }
}
