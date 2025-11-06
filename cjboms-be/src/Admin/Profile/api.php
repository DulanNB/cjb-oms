<?php

use Illuminate\Support\Facades\Route;
use Src\Admin\Profile\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Admin Profile API Routes - Cookie & CSRF Based
|--------------------------------------------------------------------------
|
| These routes use session/cookie authentication with CSRF protection.
| CSRF token is required for all state-changing operations.
| Note: 'web' middleware is applied from the parent route group
|
*/

// Get CSRF Token (Public)
Route::get('/csrf-token', [AuthController::class, 'getCsrfToken'])->name('admin.profile.csrf');

// Public Profile Routes
Route::post('/register', [AuthController::class, 'register'])->name('admin.profile.register');
Route::post('/login', [AuthController::class, 'login'])->name('admin.profile.login');

// Protected Profile Routes (Require Authentication via Session/Cookie)
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [AuthController::class, 'getProfile'])->name('admin.profile.get');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('admin.profile.update');
    Route::delete('/profile', [AuthController::class, 'deleteProfile'])->name('admin.profile.delete');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.profile.logout');
});
