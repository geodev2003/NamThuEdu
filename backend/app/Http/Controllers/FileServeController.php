<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class FileServeController extends Controller
{
    /**
     * Serve audio files with CORS headers
     */
    public function serveAudio($filename)
    {
        \Log::info('FileServeController::serveAudio called', ['filename' => $filename]);
        
        $path = storage_path('app/public/exam_audio/' . $filename);
        
        if (!file_exists($path)) {
            \Log::error('Audio file not found', ['path' => $path]);
            return response()->json(['error' => 'File not found'], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }
        
        $file = file_get_contents($path);
        $mimeType = mime_content_type($path);
        $fileSize = filesize($path);
        
        \Log::info('Serving audio file', [
            'path' => $path,
            'size' => $fileSize,
            'mime' => $mimeType
        ]);
        
        // Return response with explicit headers
        $response = response($file, 200);
        $response->header('Content-Type', $mimeType);
        $response->header('Content-Length', $fileSize);
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Range');
        $response->header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
        $response->header('Accept-Ranges', 'bytes');
        $response->header('Cache-Control', 'public, max-age=31536000');
        
        \Log::info('Response headers set', [
            'headers' => $response->headers->all()
        ]);
        
        return $response;
    }
    
    /**
     * Serve image files with CORS headers
     */
    public function serveImage($filename)
    {
        $path = storage_path('app/public/exam_images/' . $filename);
        
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }
        
        $file = file_get_contents($path);
        $mimeType = mime_content_type($path);
        $fileSize = filesize($path);
        
        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Content-Length', $fileSize)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
            ->header('Cache-Control', 'public, max-age=31536000');
    }
    
    /**
     * Handle OPTIONS preflight request
     */
    public function handleOptions()
    {
        return response('', 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Range')
            ->header('Access-Control-Max-Age', '86400');
    }
}
