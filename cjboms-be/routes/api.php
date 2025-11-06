<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test CORS endpoint
Route::get('/test-cors', function (Request $request) {
    $origin = $request->headers->get('Origin');
    return response()->json([
        'message' => 'CORS test',
        'origin_received' => $origin,
        'headers' => $request->headers->all()
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Admin routes
Route::prefix('admin')->group(function () {
    // Admin Profile Routes - Load from Profile/api.php (with web middleware for sessions)
    Route::prefix('profile')->middleware(['web'])->group(function () {
        require __DIR__ . '/../src/Admin/Profile/api.php';
    });
});