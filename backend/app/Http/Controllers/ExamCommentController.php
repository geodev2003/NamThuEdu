<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamComment;
use App\Models\Exam;

class ExamCommentController extends Controller
{
    /**
     * GET /api/student/exams/{examId}/comments
     * GET /api/teacher/exams/{examId}/comments
     */
    public function index(Request $request, int $examId)
    {
        // Lấy TẤT CẢ comments của exam (flat list, sort theo created_at asc
        // để parent luôn xuất hiện trước child khi build tree)
        $all = ExamComment::with('user')
            ->where('exam_id', $examId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Group theo parent_id để build tree O(n)
        $byParent = [];
        foreach ($all as $c) {
            $key = $c->parent_id === null ? 'null' : (string) $c->parent_id;
            if (!isset($byParent[$key])) {
                $byParent[$key] = [];
            }
            $byParent[$key][] = $c;
        }

        $tree = $this->buildBranch($byParent, 'null', 0);

        // Sort top-level: mới nhất lên đầu (replies bên trong giữ asc theo thời gian)
        usort($tree, function ($a, $b) {
            return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
        });

        return response()->json([
            'status' => 'success',
            'data'   => $tree,
        ]);
    }

    /**
     * POST /api/student/exams/{examId}/comments
     */
    public function store(Request $request, int $examId)
    {
        $request->validate([
            'content'   => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:exam_comments,id',
        ]);

        $user = $request->user();

        // Validate parent belongs to same exam
        if ($request->parent_id) {
            $parent = ExamComment::find($request->parent_id);
            if (!$parent || $parent->exam_id !== $examId) {
                return response()->json(['status' => 'error', 'message' => 'Invalid parent comment.'], 422);
            }
        }

        $comment = ExamComment::create([
            'exam_id'   => $examId,
            'user_id'   => $user->uId,
            'parent_id' => $request->parent_id,
            'content'   => trim($request->content),
        ]);

        $comment->load('user');

        return response()->json([
            'status' => 'success',
            'data'   => $this->formatComment($comment, false),
        ], 201);
    }

    /**
     * DELETE /api/student/exams/{examId}/comments/{commentId}
     */
    public function destroy(Request $request, int $examId, int $commentId)
    {
        $user    = $request->user();
        $comment = ExamComment::where('id', $commentId)
                              ->where('exam_id', $examId)
                              ->firstOrFail();

        // Only owner or teacher can delete
        if ($user->uId !== $comment->user_id && $user->uRole !== 'teacher') {
            return response()->json(['status' => 'error', 'message' => 'Không có quyền xóa.'], 403);
        }

        $comment->update(['is_deleted' => true, 'content' => '[Bình luận đã bị xóa]']);

        return response()->json(['status' => 'success']);
    }

    // ─── Private helpers ─────────────────────────────────────────────────

    /**
     * Đệ quy build branch của tree từ map [parent_id => Comment[]].
     * Giới hạn depth tránh OOM nếu dữ liệu vòng lặp.
     */
    private function buildBranch(array $byParent, string $parentKey, int $depth): array
    {
        if ($depth > 12) {
            return [];
        }
        if (!isset($byParent[$parentKey])) {
            return [];
        }

        $items = [];
        foreach ($byParent[$parentKey] as $c) {
            $node = $this->formatNode($c);
            $childKey = (string) $c->id;
            $node['replies'] = $this->buildBranch($byParent, $childKey, $depth + 1);
            $items[] = $node;
        }

        return $items;
    }

    /**
     * Format 1 comment thuần (không đụng tới replies — sẽ được lắp ở buildBranch).
     */
    private function formatNode(ExamComment $c): array
    {
        $createdAt = $c->created_at ? $c->created_at->toIso8601String() : null;
        $user      = $c->user;

        return [
            'id'         => $c->id,
            'content'    => $c->content,
            'is_deleted' => (bool) $c->is_deleted,
            'parent_id'  => $c->parent_id,
            'created_at' => $createdAt,
            'user'       => [
                'id'     => $user ? $user->uId : null,
                'name'   => $user ? $user->uName : 'Ẩn danh',
                'avatar' => $user ? $user->avatar_url : null,
                'role'   => $user ? $user->uRole : 'student',
            ],
            'replies'    => [],
        ];
    }

    /**
     * Format 1 comment đơn lẻ (sau khi store / reply) — chưa có children
     * vì bản thân nó vừa được tạo.
     */
    private function formatComment(ExamComment $c, bool $withReplies): array
    {
        return $this->formatNode($c);
    }
}
