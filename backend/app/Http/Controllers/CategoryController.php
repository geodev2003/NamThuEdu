<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
