<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
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
        // Get origin from request
        $origin = $request->headers->get('Origin') ?? '*';
        
        // For static file requests (storage/*), always allow all origins
        if (str_starts_with($request->path(), 'storage/')) {
            $origin = '*';
        }
        
        // Handle preflight OPTIONS request
        if ($request->getMethod() === "OPTIONS") {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Range')
                ->header('Access-Control-Allow-Credentials', $origin !== '*' ? 'true' : 'false')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);

        // Add CORS headers to response
        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Range');
        $response->headers->set('Access-Control-Allow-Credentials', $origin !== '*' ? 'true' : 'false');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization, Content-Type, X-Requested-With, Content-Range, Accept-Ranges');

        return $response;
    }
}