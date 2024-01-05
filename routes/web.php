<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Web\LoginController;
use App\Http\Controllers\Web\ReportController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ScheduleController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\StoreController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');
Route::get('logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('/report', [ReportController::class, 'index'])->name('report');
  Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule');
  Route::get('/user', [UserController::class, 'index'])->name('user');
  Route::get('/store', [StoreController::class, 'index'])->name('store');
});

// Main Page Route
