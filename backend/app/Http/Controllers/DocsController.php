<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DocsController extends Controller
{
    public function index()
    {
        $swaggerJsonUrl = url('/') . '/docs/api-docs.json';
        
        return view('l5-swagger::index', [
            'documentation' => 'default',
            'urlToDocs' => $swaggerJsonUrl,
            'operationsSorter' => config('l5-swagger.defaults.ui.display.operation_sorter', null),
            'configUrl' => config('l5-swagger.defaults.routes.docs') . '/config',
            'validatorUrl' => config('l5-swagger.defaults.validator_url', null),
        ]);
    }
}