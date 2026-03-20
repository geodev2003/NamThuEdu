<?php

namespace App\Services;

class FeatureFlagService
{
    /**
     * Check if a feature is enabled
     *
     * @param string $feature
     * @return bool
     */
    public function isEnabled(string $feature): bool
    {
        return config("namthuedu.features.{$feature}", false);
    }

    /**
     * Check if registration is enabled
     *
     * @return bool
     */
    public function isRegistrationEnabled(): bool
    {
        return $this->isEnabled('registration_enabled');
    }

    /**
     * Check if OTP is enabled
     *
     * @return bool
     */
    public function isOtpEnabled(): bool
    {
        return $this->isEnabled('otp_enabled');
    }

    /**
     * Check if AI grading is enabled
     *
     * @return bool
     */
    public function isAiGradingEnabled(): bool
    {
        return $this->isEnabled('ai_grading_enabled');
    }

    /**
     * Check if exam templates are enabled
     *
     * @return bool
     */
    public function isExamTemplatesEnabled(): bool
    {
        return $this->isEnabled('exam_templates_enabled');
    }

    /**
     * Get all feature flags
     *
     * @return array
     */
    public function getAllFeatures(): array
    {
        return config('namthuedu.features', []);
    }

    /**
     * Check multiple features at once
     *
     * @param array $features
     * @return array
     */
    public function checkFeatures(array $features): array
    {
        $result = [];
        foreach ($features as $feature) {
            $result[$feature] = $this->isEnabled($feature);
        }
        return $result;
    }
}