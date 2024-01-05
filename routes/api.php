<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\AuditRoundOneController;
use App\Http\Controllers\Api\AuditRoundTwoController;
use App\Http\Controllers\Api\ImagePathController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('users', UserController::class);
Route::apiResource('stores', StoreController::class);
Route::apiResource('provinces', ProvinceController::class);
Route::apiResource('auditroundones', AuditRoundOneController::class);
Route::apiResource('auditroundtwos', AuditRoundTwoController::class);
Route::apiResource('imagepaths', ImagePathController::class);
Route::apiResource('schedules', ScheduleController::class);
Route::apiResource('reports', ReportController::class);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});
