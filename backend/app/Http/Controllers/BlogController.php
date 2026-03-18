<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Post;
use App\Models\User;

class BlogController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/blogs",
     *     tags={"Blog Management"},
     *     summary="Get teacher blogs",
     *     description="Get list of blogs created by authenticated teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Blogs retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
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
     * @OA\Post(
     *     path="/teacher/blogs",
     *     tags={"Blog Management"},
     *     summary="Create new blog",
     *     description="Create a new blog post (teacher only)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"blogName", "blogContent", "blogType", "blogCategory"},
     *             @OA\Property(property="blogName", type="string", example="Grammar Tips for VSTEP"),
     *             @OA\Property(property="blogContent", type="string", example="Detailed content about grammar..."),
     *             @OA\Property(property="blogType", type="string", enum={"grammar", "tips", "vocabulary"}, example="grammar"),
     *             @OA\Property(property="blogCategory", type="integer", example=1),
     *             @OA\Property(property="blogUrl", type="string", example="grammar-tips-vstep"),
     *             @OA\Property(property="blogThumbnail", type="string", example="thumbnail.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Blog created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
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
     * @OA\Get(
     *     path="/teacher/blogs/{id}",
     *     tags={"Blog Management"},
     *     summary="Get blog details",
     *     description="Get detailed information about a specific blog",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Blog details retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Blog not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
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
     * @OA\Put(
     *     path="/teacher/blogs/{id}",
     *     tags={"Blog Management"},
     *     summary="Update blog",
     *     description="Update blog information",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="blogName", type="string"),
     *             @OA\Property(property="blogContent", type="string"),
     *             @OA\Property(property="blogType", type="string", enum={"grammar", "tips", "vocabulary"}),
     *             @OA\Property(property="blogCategory", type="integer"),
     *             @OA\Property(property="blogUrl", type="string"),
     *             @OA\Property(property="blogThumbnail", type="string"),
     *             @OA\Property(property="pStatus", type="string", enum={"active", "inactive", "draft"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Blog updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Blog not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
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
     * @OA\Delete(
     *     path="/teacher/blogs/{id}",
     *     tags={"Blog Management"},
     *     summary="Delete blog",
     *     description="Delete a blog (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Blog deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Blog not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
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
