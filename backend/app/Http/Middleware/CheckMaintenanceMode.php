<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AdminSetting;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $maintenance = AdminSetting::where('key', 'maintenanceMode')->value('value');
            
            if ($maintenance === 'true') {
                $user = $request->user();
                
                // Allow only admin role to bypass maintenance mode
                if (!$user || $user->uRole !== 'admin') {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Hệ thống đang bảo trì để nâng cấp. Vui lòng quay lại sau.'
                    ], 503);
                }
            }
        } catch (\Throwable $e) {
            // Bypass middleware if the settings table does not exist or has errors
        }

        return $next($request);
    }
}
