<?php

    namespace App\Validators;

    use App\Core\Response;

    class LoginValidator {

        public static function validate(array $input) : array {
            
            if(empty($input['phone'])) {
                Response::error(
                    'VALIDATION_PHONE_REQUIRED',
                    'Số điện thoại là bắt buộc',
                    ['field' => 'phone']
                );
            }

            if(!preg_match('/^[0-9]{9,11}$/', $input['phone'])) {
                Response::error(
                   'VALIDATION_PHONE_INVALID',
                   'Số điện thoại không hợp lệ',
                   ['field' => 'phone']     
                );
            }

            if(empty($input['password'])) {
                Response::error(
                    'VALIDATION_PASSWORD_REQUIRED',
                    'Mật khẩu là bắt buộc',
                    ['field' => 'password']
                );
            }

            if(strlen($input['password']) < 6) {
                Response::error(
                    'VALIDATION_PASSWORD_TOO_SHORT',
                    'Mật khẩu tối thiểu 6 ký tự',
                    ['field' => 'password']
                );
            }

            return [
                'phone' => trim($input['phone']),
                'password' => $input['password']
            ];
        }

    }

?>