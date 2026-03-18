<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Swagger Documentation với minimal CSS
Route::get('/docs', function () {
    return view('docs');
});

Route::get('/docs/api-docs.json', function () {
    return response()->file(storage_path('api-docs/api-docs.json'));
});

Route::get('/swagger', function () {
    return redirect('/docs');
});
