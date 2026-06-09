<?php

namespace App\Http\Controllers;

use App\Models\AdminActivityLog;
use Illuminate\Http\Request;

/**
 * AdminActivityLogController — đọc audit log admin (real audit, không phải report).
 *
 * GET  /api/admin/activity-logs            — list (filter + paginate)
 * GET  /api/admin/activity-logs/stats      — thống kê nhanh (theo action / theo admin)
 */
class AdminActivityLogController extends Controller
{
    /**
     * Danh sách audit log, hỗ trợ filter: action, entity_type, admin_id, search (detail/path),
     * from_date, to_date. Phân trang.
     */
    public function index(Request $request)
    {
        $perPage = min(100, max(1, (int) $request->input('per_page', 25)));

        $query = AdminActivityLog::with(['admin:uId,uName,uPhone'])
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->input('entity_type'));
        }
        if ($request->filled('admin_id')) {
            $query->where('admin_id', (int) $request->input('admin_id'));
        }
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function ($q) use ($s) {
                $q->where('detail', 'like', "%{$s}%")
                  ->orWhere('path', 'like', "%{$s}%")
                  ->orWhere('action', 'like', "%{$s}%");
            });
        }
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        $logs = $query->paginate($perPage);

        // Map gọn cho FE
        $logs->getCollection()->transform(function ($log) {
            return [
                'id'          => $log->id,
                'admin_id'    => $log->admin_id,
                'admin_name'  => $log->admin->uName ?? 'Admin #' . $log->admin_id,
                'action'      => $log->action,
                'entity_type' => $log->entity_type,
                'entity_id'   => $log->entity_id,
                'detail'      => $log->detail,
                'method'      => $log->method,
                'path'        => $log->path,
                'ip'          => $log->ip,
                'status_code' => $log->status_code,
                'meta'        => $log->meta,
                'created_at'  => $log->created_at,
            ];
        });

        return response()->json(['status' => 'success', 'data' => $logs]);
    }

    /**
     * Thống kê nhanh: tổng số, theo action (top 10), theo admin (top 10),
     * số lỗi (status >= 400), hoạt động 7 ngày gần nhất.
     */
    public function stats(Request $request)
    {
        $total = AdminActivityLog::count();

        $byAction = AdminActivityLog::selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->orderByDesc('count')
            ->take(10)
            ->get();

        $byAdmin = AdminActivityLog::selectRaw('admin_id, COUNT(*) as count')
            ->with('admin:uId,uName')
            ->groupBy('admin_id')
            ->orderByDesc('count')
            ->take(10)
            ->get()
            ->map(function ($row) {
                return [
                    'admin_id'   => $row->admin_id,
                    'admin_name' => $row->admin->uName ?? 'Admin #' . $row->admin_id,
                    'count'      => (int) $row->count,
                ];
            });

        $errors = AdminActivityLog::where('status_code', '>=', 400)->count();

        $last7Days = AdminActivityLog::where('created_at', '>=', now()->subDays(7))->count();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'total'       => $total,
                'errors'      => $errors,
                'last_7_days' => $last7Days,
                'by_action'   => $byAction,
                'by_admin'    => $byAdmin,
            ],
        ]);
    }
}
