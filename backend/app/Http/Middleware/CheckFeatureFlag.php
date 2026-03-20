<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\FeatureFlagService;

class CheckFeatureFlag
{
    protected $featureFlags;

    public function __construct(FeatureFlagService $featureFlags)
    {
        $this->featureFlags = $featureFlags;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string  $feature
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, string $feature)
    {
        if (!$this->featureFlags->isEnabled($feature)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Feature not available',
                'feature' => $feature
            ], 503); // Service Unavailable
        }

        return $next($request);
    }
}