<?php

namespace App\Http\Requests\Admin;

/**
 * Validation cho POST /api/admin/users/{id}/change-role
 * (UserController::changeUserRole). Rule giữ nguyên so với inline cũ.
 */
class ChangeUserRoleRequest extends AdminFormRequest
{
    protected function unauthorizedMessage(): string
    {
        return 'Chỉ quản trị viên mới có quyền phân quyền.';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role'   => 'required|in:student,teacher,admin',
            'reason' => 'nullable|string|max:255',
        ];
    }
}
