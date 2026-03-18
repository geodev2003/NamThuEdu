<?php

namespace App\Controllers;

use App\Core\Response;
use App\Models\CategoryModel;

class CategoryController
{
    public function getCategory()
    {
        $category = CategoryModel::getCategory();

        // Trả về trực tiếp $courses để Response::success đóng gói vào key 'data'
        Response::success($category);
    }
}
