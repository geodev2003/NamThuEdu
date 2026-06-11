<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Base cho tất cả Form Request của admin user-management.
 *
 * Lý do tồn tại: trước đây mỗi action admin lặp lại 2 khối boilerplate:
 *   1. Kiểm tra role admin → trả 403 JSON {status:error, message:...}
 *   2. Validator::make(...) + $validator->fails() → trả 400 JSON
 *      {status:error, message:'Dữ liệu không hợp lệ.', errors:...}
 *
 * Gom vào FormRequest giúp:
 *   - Controller gọn (chỉ còn business logic), test dễ hơn.
 *   - Một chỗ duy nhất định nghĩa rule (tránh lệch rule giữa create/update).
 *
 * QUAN TRỌNG — backward compatibility:
 * Mặc định FormRequest trả 422 với shape {message, errors}. Nhưng frontend
 * hiện đọc shape {status:'error', message, errors} và HTTP 400 (validation) /
 * 403 (không phải admin). Vì vậy ta override failedValidation() và
 * failedAuthorization() để GIỮ NGUYÊN contract cũ, không phải sửa FE.
 */
abstract class AdminFormRequest extends FormRequest
{
    /**
     * Chỉ admin mới được qua. Route đã có middleware('admin') (Reminder #1),
     * đây là lớp defense-in-depth thứ hai và giữ đúng message cũ của từng
     * action qua unauthorizedMessage().
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->uRole === 'admin';
    }

    /**
     * Message 403 cho từng action. Override ở class con để giữ nguyên câu
     * thông báo cũ ("Chỉ quản trị viên mới có quyền ...").
     */
    protected function unauthorizedMessage(): string
    {
        return 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.';
    }

    /**
     * Giữ shape lỗi validation cũ: HTTP 400 + {status:error, message, errors}.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status'  => 'error',
            'message' => 'Dữ liệu không hợp lệ.',
            'errors'  => $validator->errors(),
        ], 400));
    }

    /**
     * Giữ shape lỗi phân quyền cũ: HTTP 403 + {status:error, message}.
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'status'  => 'error',
            'message' => $this->unauthorizedMessage(),
        ], 403));
    }
}
