<?php

namespace App\Controllers;

use App\Core\Response;
use App\Models\BlogModel;
use App\Models\UserModel;

class BlogController
{
    public function show()
    {
        $user = UserModel::getAuthenticatedUser();

        // if (!$user || $user['uRole'] !== 'teacher') {
        //     Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
        //     return;
        // }

        $blogs = BlogModel::getAllBlogs($user['uId']);

        // Trả về trực tiếp $blogs để Response::success đóng gói vào key 'data'
        Response::success($blogs);
    }

    public function store()
    {
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        // Lấy dữ liệu từ request body
        $input = json_decode(file_get_contents('php://input'), true);

        // Bổ sung validate cho numberOfStudent
        if (empty($input['blogName']) || empty($input['blogContent']) || empty($input['blogType']) || empty($input['blogCategory'])) {
            Response::error('BLOG_INVALID_DATA', 'Dữ liệu không đầy đủ.', null, 400);
            return;
        }

        // Gọi Model với đầy đủ tham số
        $newBlogId = BlogModel::createBlog(
            $user['uId'],
            $input['blogName'],
            $input['blogContent'],
            $input['blogType'],
            $input['blogCategory'],
            $input['blogUrl'] || '',
            $input['blogThumbnail'] || '',
        );

        Response::success(['blogId' => $newBlogId]);
    }


    public function destroy($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
            return;
        }

        // Gọi Model để xóa
        $result = BlogModel::deleteBlog($id, $user['uId']);

        if ($result) {
            Response::success([
                'DELETE_BLOG_SUCCESS',
                'Xóa bài viết thành công',
                null,
                200
            ]);
        } else {
            Response::error('DELETE_BLOG_FAILED', 'Không thể xóa bài viết', null, 500);
        }
    }

    public function getBlogById($id)
{
    $user = UserModel::getAuthenticatedUser();

    if (!$user || $user['uRole'] !== 'teacher') {
        Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
        return;
    }

    // Bạn cần viết hàm getCourseById trong CourseModel
    $blog = BlogModel::getBlogById($id, $user['uId']);

    if ($blog) {
        Response::success($blog);
    } else {
        Response::error('BLOG_NOT_FOUND', 'Không tìm thấy bài viết.', null, 404);
    }
}

public function update($id)
{
    $user = UserModel::getAuthenticatedUser();
    if (!$user || $user['uRole'] !== 'teacher') {
        Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $result = BlogModel::updateBlog($id, $user['uId'], $input);

    if ($result) {
        Response::success([
            'UPDATE_BLOG_SUCCESS',
            'Cập nhật bài viết thành công',
            null,
            200
            ]);
    } else {
        Response::error('UPDATE_BLOG_FAILED', 'Không thể cập nhật bài viết', null, 500);
    }
}
}
