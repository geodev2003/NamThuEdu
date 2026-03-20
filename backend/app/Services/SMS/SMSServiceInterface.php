<?php

namespace App\Services\SMS;

interface SMSServiceInterface
{
    /**
     * Send SMS message
     *
     * @param string $phone
     * @param string $message
     * @return bool
     */
    public function sendSMS(string $phone, string $message): bool;

    /**
     * Send OTP message
     *
     * @param string $phone
     * @param string $otp
     * @return bool
     */
    public function sendOTP(string $phone, string $otp): bool;

    /**
     * Get provider name
     *
     * @return string
     */
    public function getProviderName(): string;
}