<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiDocController extends Controller
{
    public function index()
    {
        return view('swagger.index');
    }

    public function json()
    {
        $swagger = \OpenApi\Generator::scan([app_path('Http/Controllers')]);
        return response()->json($swagger->toArray());
    }
}