<?php

namespace App\Services\SMS;

use Illuminate\Support\Facades\Log;

class MockSMSService implements SMSServiceInterface
{
    /**
     * Send SMS (Mock implementation for development)
     *
     * @param string $phone
     * @param string $message
     * @return bool
     */
    public function sendSMS(string $phone, string $message): bool
    {
        // Log the SMS for development purposes
        Log::info('Mock SMS Sent', [
            'phone' => $phone,
            'message' => $message,
            'timestamp' => now()->toDateTimeString()
        ]);

        // Always return true for mock
        return true;
    }

    /**
     * Send OTP (Mock implementation)
     *
     * @param string $phone
     * @param string $otp
     * @return bool
     */
    public function sendOTP(string $phone, string $otp): bool
    {
        $message = "Ma xac thuc cua ban la: {$otp}. Ma co hieu luc trong 5 phut.";
        
        Log::info('Mock OTP Sent', [
            'phone' => $phone,
            'otp' => $otp,
            'message' => $message,
            'timestamp' => now()->toDateTimeString()
        ]);

        return true;
    }

    /**
     * Get provider name
     *
     * @return string
     */
    public function getProviderName(): string
    {
        return 'Mock SMS Service';
    }
}