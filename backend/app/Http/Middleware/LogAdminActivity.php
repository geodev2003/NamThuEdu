<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AdminActivityLog;

/**
 * LogAdminActivity — tự động ghi audit log cho các request admin GÂY THAY ĐỔI
 * (POST/PUT/PATCH/DELETE). GET không ghi để tránh nhiễu.
 *
 * Action key được suy ra từ method + path; entity_type/entity_id parse từ path.
 * Best-effort: lỗi ghi log không làm hỏng response.
 */
class LogAdminActivity
{
    private const MUTATING = ['POST', 'PUT', 'PATCH', 'DELETE'];

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        try {
            $user = $request->user();
            if ($user && $user->uRole === 'admin' && in_array($request->method(), self::MUTATING, true)) {
                [$action, $entityType, $entityId] = $this->deriveAction($request);

                AdminActivityLog::record($user->uId, $action, [
                    'entity_type' => $entityType,
                    'entity_id'   => $entityId,
                    'detail'      => $this->deriveDetail($request, $action),
                    'method'      => $request->method(),
                    'path'        => '/' . ltrim($request->path(), '/'),
                    'ip'          => $request->ip(),
                    'status_code' => method_exists($response, 'getStatusCode') ? $response->getStatusCode() : null,
                ]);
            }
        } catch (\Throwable $e) {
            \Log::warning('LogAdminActivity failed: ' . $e->getMessage());
        }

        return $response;
    }

    /**
     * Suy ra [action, entityType, entityId] từ path admin.
     * Ví dụ: POST admin/users/5/lock -> ['user.lock','user',5]
     *        PUT  admin/categories/3 -> ['category.update','category',3]
     *        DELETE admin/posts/9     -> ['post.delete','post',9]
     */
    private function deriveAction(Request $request): array
    {
        $segments = array_values(array_filter(explode('/', $request->path())));
        // bỏ tiền tố api/admin
        $idx = array_search('admin', $segments, true);
        $parts = $idx !== false ? array_slice($segments, $idx + 1) : $segments;

        $entityMap = [
            'users'          => 'user',
            'exams'          => 'exam',
            'posts'          => 'post',
            'categories'     => 'category',
            'exam-templates' => 'template',
            'courses'        => 'course',
            'classes'        => 'class',
            'system'         => 'setting',
            'profile'        => 'session',
            'students'       => 'student',
        ];

        $resource   = $parts[0] ?? 'unknown';
        $entityType = $entityMap[$resource] ?? $resource;

        // Tìm id số trong path
        $entityId = null;
        $verb     = null;
        foreach ($parts as $seg) {
            if (is_numeric($seg)) {
                $entityId = (int) $seg;
            } elseif (in_array($seg, ['lock', 'unlock', 'approve', 'reject', 'activate', 'deactivate', 'resolve', 'assign-teacher', 'bulk-action', 'settings', 'sessions'], true)) {
                $verb = $seg;
            }
        }

        // action = entity.verb (verb suy từ path hoặc method)
        if ($verb) {
            $verb = str_replace('-', '_', $verb);
        } else {
            switch ($request->method()) {
                case 'POST':
                    $verb = 'create';
                    break;
                case 'PUT':
                case 'PATCH':
                    $verb = 'update';
                    break;
                case 'DELETE':
                    $verb = 'delete';
                    break;
                default:
                    $verb = 'action';
            }
        }

        return ["{$entityType}.{$verb}", $entityType, $entityId];
    }

    private function deriveDetail(Request $request, string $action): string
    {
        $reason = $request->input('reason');
        if (is_string($reason) && $reason !== '') {
            return mb_substr("[$action] $reason", 0, 255);
        }
        return mb_substr($action, 0, 255);
    }
}
