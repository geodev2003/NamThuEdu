<?php

namespace App\Http\Controllers;

use App\Models\TeacherActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherActivityLogController extends Controller
{
    /**
     * POST /api/teacher/activity-log
     * Body: { action, entity_type?, entity_id?, detail?, meta? }
     *
     * Cho phép FE log nhanh hành động vừa làm. Backend chỉ validate nhẹ rồi
     * lưu — KHÔNG dùng để đảm bảo nghiệp vụ, chỉ là audit/UX feed.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'teacher') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'action'      => 'required|string|max:64',
            'entity_type' => 'nullable|string|max:32',
            'entity_id'   => 'nullable|integer',
            'detail'      => 'nullable|string|max:255',
            'meta'        => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $log = TeacherActivityLog::create([
            'teacher_id'  => $user->uId,
            'action'      => $request->input('action'),
            'entity_type' => $request->input('entity_type'),
            'entity_id'   => $request->input('entity_id'),
            'detail'      => $request->input('detail'),
            'meta'        => $request->input('meta'),
            'created_at'  => now(),
        ]);

        // Best-effort cleanup: chỉ giữ tối đa 200 log gần nhất / teacher
        $oldIds = TeacherActivityLog::where('teacher_id', $user->uId)
            ->orderByDesc('id')
            ->skip(200)
            ->take(1000)
            ->pluck('id');
        if ($oldIds->isNotEmpty()) {
            TeacherActivityLog::whereIn('id', $oldIds)->delete();
        }

        return response()->json(['status' => 'success', 'data' => $log]);
    }

    /**
     * GET /api/teacher/activity-log
     * Trả 20 log gần nhất của teacher hiện tại.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'teacher') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $limit = min(50, max(1, (int) $request->input('limit', 20)));

        $logs = TeacherActivityLog::where('teacher_id', $user->uId)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->take($limit)
            ->get();

        return response()->json(['status' => 'success', 'data' => $logs]);
    }
}
