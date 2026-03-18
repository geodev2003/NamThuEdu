<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Post;
use App\Models\User;

class BlogController extends Controller
{
    /**
     * GET /api/teacher/blogs
     * Lấy danh sách bài viết của teacher
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Note: Trong code cũ có comment check role, tôi sẽ giữ logic đó
        // if (!$user || $user->uRole !== 'teacher') {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Bạn không có quyền truy cập.'
        //     ], 401);
        // }

        $blogs = Post::with(['author', 'category'])
                    ->byAuthor($user->uId)
                    ->whereNull('pDeleted_at')
                    ->orderBy('pCreated_at', 'desc')
                    ->get();

        return response()->json([
            'status' => 'success',
            'data' => $blogs
        ]);
    }

    /**
     * POST /api/teacher/blogs
     * Tạo bài viết mới
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'blogName' => 'required|string|max:255',
            'blogContent' => 'required|string',
            'blogType' => 'required|in:grammar,tips,vocabulary',
            'blogCategory' => 'required|integer|exists:category,caId',
            'blogUrl' => 'nullable|string',
            'blogThumbnail' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không đầy đủ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $blog = Post::create([
            'pTitle' => $request->blogName,
            'pContent' => $request->blogContent,
            'pType' => $request->blogType,
            'pCategory' => $request->blogCategory,
            'pUrl' => $request->blogUrl ?? '',
            'pThumbnail' => $request->blogThumbnail ?? '',
            'pAuthor_id' => $user->uId,
            'pStatus' => 'draft', // Default status
            'pView' => 0,
            'pLike' => 0,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => ['blogId' => $blog->pId]
        ]);
    }

    /**
     * GET /api/teacher/blogs/{id}
     * Lấy chi tiết bài viết
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $blog = Post::with(['author', 'category'])
                   ->where('pId', $id)
                   ->where('pAuthor_id', $user->uId)
                   ->whereNull('pDeleted_at')
                   ->first();

        if (!$blog) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài viết.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $blog
        ]);
    }

    /**
     * PUT /api/teacher/blogs/{id}
     * Cập nhật bài viết
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền.'
            ], 401);
        }

        $blog = Post::where('pId', $id)
                   ->where('pAuthor_id', $user->uId)
                   ->whereNull('pDeleted_at')
                   ->first();

        if (!$blog) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài viết.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'blogName' => 'sometimes|required|string|max:255',
            'blogContent' => 'sometimes|required|string',
            'blogType' => 'sometimes|required|in:grammar,tips,vocabulary',
            'blogCategory' => 'sometimes|required|integer|exists:category,caId',
            'blogUrl' => 'nullable|string',
            'blogThumbnail' => 'nullable|string',
            'pStatus' => 'sometimes|required|in:active,inactive,draft',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = [];
        if ($request->has('blogName')) $updateData['pTitle'] = $request->blogName;
        if ($request->has('blogContent')) $updateData['pContent'] = $request->blogContent;
        if ($request->has('blogType')) $updateData['pType'] = $request->blogType;
        if ($request->has('blogCategory')) $updateData['pCategory'] = $request->blogCategory;
        if ($request->has('blogUrl')) $updateData['pUrl'] = $request->blogUrl;
        if ($request->has('blogThumbnail')) $updateData['pThumbnail'] = $request->blogThumbnail;
        if ($request->has('pStatus')) $updateData['pStatus'] = $request->pStatus;

        $blog->update($updateData);

        return response()->json([
            'status' => 'success',
            'data' => [
                'UPDATE_BLOG_SUCCESS',
                'Cập nhật bài viết thành công',
                null,
                200
            ]
        ]);
    }

    /**
     * DELETE /api/teacher/blogs/{id}
     * Xóa bài viết (soft delete)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền.'
            ], 401);
        }

        $blog = Post::where('pId', $id)
                   ->where('pAuthor_id', $user->uId)
                   ->whereNull('pDeleted_at')
                   ->first();

        if (!$blog) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài viết.'
            ], 404);
        }

        $blog->update(['pDeleted_at' => now()]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'DELETE_BLOG_SUCCESS',
                'Xóa bài viết thành công',
                null,
                200
            ]
        ]);
    }
}
