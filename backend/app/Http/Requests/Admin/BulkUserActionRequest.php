<?php

namespace App\Http\Requests\Admin;

/**
 * Validation cho POST /api/admin/users/bulk-action
 * (UserController::bulkUserAction). Rule giữ nguyên so với inline cũ.
 */
class BulkUserActionRequest extends AdminFormRequest
{
    protected function unauthorizedMessage(): string
    {
        return 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'action'     => 'required|in:lock,unlock,activate,deactivate,delete,restore,change_role',
            'user_ids'   => 'required|array|min:1|max:500',
            'user_ids.*' => 'required|integer',
            'role'       => 'required_if:action,change_role|in:student,teacher,admin',
            'reason'     => 'nullable|string|max:255',
        ];
    }
}
