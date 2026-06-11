<?php

namespace App\Http\Requests\Admin;

/**
 * Validation cho PUT /api/admin/users/{id} (UserController::adminUpdateUser).
 *
 * Rule giữ nguyên so với inline Validator cũ. Lưu ý unique cho `phone` phải
 * loại trừ chính user đang sửa — lấy id từ route param `{id}`.
 */
class AdminUpdateUserRequest extends AdminFormRequest
{
    protected function unauthorizedMessage(): string
    {
        return 'Chỉ quản trị viên mới có quyền sửa tài khoản.';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name'     => 'sometimes|required|string|max:150',
            'phone'    => 'sometimes|required|string|unique:users,uPhone,' . $id . ',uId',
            'role'     => 'sometimes|required|in:student,teacher,admin',
            'status'   => 'sometimes|required|in:active,inactive',
            'dob'      => 'sometimes|nullable|date',
            'address'  => 'sometimes|nullable|string',
            'gender'   => 'sometimes|nullable|boolean',
            'class'    => 'sometimes|nullable|integer',
            'password' => 'sometimes|nullable|string|min:6',
        ];
    }
}
