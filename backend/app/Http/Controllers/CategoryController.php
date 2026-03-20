<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/categories",
     *     tags={"Teachers"},
     *     summary="Get categories",
     *     description="Get list of available categories",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Categories retrieved successfully")
     * )
     * 
     * GET /api/teacher/categories
     * Lấy danh sách danh mục
     */
    public function index()
    {
        $categories = Category::all();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    /* ========================================
     * ADMIN METHODS - Category Management
     * ======================================== */

    /**
     * GET /api/admin/categories
     * Quản lý danh mục (Admin only)
     */
    public function adminCategories(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $categories = Category::withCount(['courses', 'posts'])
                             ->orderBy('caName')
                             ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    /**
     * POST /api/admin/categories
     * Tạo danh mục mới
     */
    public function adminCreateCategory(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền tạo danh mục.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'caName' => 'required|string|max:255|unique:category,caName',
            'caDescription' => 'nullable|string',
            'caType' => 'nullable|in:VSTEP,IELTS,GENERAL',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $category = Category::create([
            'caName' => $request->caName,
            'caDescription' => $request->caDescription,
            'caType' => $request->caType ?? 'GENERAL',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo danh mục thành công.',
            'data' => $category
        ], 201);
    }

    /**
     * PUT /api/admin/categories/{id}
     * Cập nhật danh mục
     */
    public function adminUpdateCategory(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền cập nhật danh mục.'
            ], 403);
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy danh mục.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'caName' => 'sometimes|required|string|max:255|unique:category,caName,' . $id . ',caId',
            'caDescription' => 'nullable|string',
            'caType' => 'nullable|in:VSTEP,IELTS,GENERAL',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $category->update($request->only(['caName', 'caDescription', 'caType']));

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật danh mục thành công.',
            'data' => $category
        ]);
    }

    /**
     * DELETE /api/admin/categories/{id}
     * Xóa danh mục
     */
    public function adminDeleteCategory(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền xóa danh mục.'
            ], 403);
        }

        $category = Category::withCount(['courses', 'posts'])->find($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy danh mục.'
            ], 404);
        }

        // Check if category is being used
        if ($category->courses_count > 0 || $category->posts_count > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa danh mục đang được sử dụng.',
                'data' => [
                    'courses_count' => $category->courses_count,
                    'posts_count' => $category->posts_count
                ]
            ], 400);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa danh mục thành công.'
        ]);
    }
}
