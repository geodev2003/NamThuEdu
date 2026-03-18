<?php

namespace App\Controllers;

use App\Core\Response;
use App\Models\CourseModel;
use App\Models\UserModel;

class CourseController
{
    public function teacherCourses()
    {
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        $courses = CourseModel::getCoursesByTeacherId($user['uId']);

        // Trả về trực tiếp $courses để Response::success đóng gói vào key 'data'
        Response::success($courses);
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
        if (empty($input['courseName']) || empty($input['numberOfStudent']) || empty($input['time']) || empty($input['category']) || empty($input['schedule']) || empty($input['startDate']) || empty($input['endDate'])) {
            Response::error('COURSE_INVALID_DATA', 'Dữ liệu không đầy đủ.', null, 400);
            return;
        }

        // Gọi Model với đầy đủ tham số
        $newCourseId = CourseModel::createCourse(
            $user['uId'],
            $input['courseName'],
            $input['time'],
            $input['category'],
            $input['schedule'],
            $input['startDate'],
            $input['endDate'],
            (int)$input['numberOfStudent'],
            $input['description'] ?? ''
        );

        Response::success(['courseId' => $newCourseId]);
    }


    public function destroy($id)
    {
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Không có quyền.', null, 401);
            return;
        }

        // Gọi Model để xóa
        $result = CourseModel::deleteCourse($id, $user['uId']);

        if ($result) {
            Response::success([
                'DELETE_COURSE_SUCCESS',
                'Xóa khóa học thành công',
                null,
                200
            ]);
        } else {
            Response::error('DELETE_COURSE_FAILED', 'Không thể xóa khóa học', null, 500);
        }
    }

    public function show($id)
{
    $user = UserModel::getAuthenticatedUser();

    if (!$user || $user['uRole'] !== 'teacher') {
        Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
        return;
    }

    // Bạn cần viết hàm getCourseById trong CourseModel
    $course = CourseModel::getCourseById($id, $user['uId']);

    if ($course) {
        Response::success($course);
    } else {
        Response::error('COURSE_NOT_FOUND', 'Không tìm thấy khóa học.', null, 404);
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
    $result = CourseModel::updateCourse($id, $user['uId'], $input);

    if ($result) {
        Response::success(['message' => 'Cập nhật khóa học thành công']);
    } else {
        Response::error('UPDATE_FAILED', 'Không thể cập nhật khóa học', null, 500);
    }
}
}
