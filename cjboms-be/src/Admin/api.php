<?php

use Illuminate\Support\Facades\Route;
use Src\Admin\Profile\Controllers\AuthController;
use Src\Admin\Item\Controllers\ItemController;
use Src\Admin\Order\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| Admin API Routes - Cookie & CSRF Based
|--------------------------------------------------------------------------
|
| These routes use session/cookie authentication with CSRF protection.
| CSRF token is required for all state-changing operations.
| Note: 'web' middleware is applied from the parent route group
|
*/

// =============================================================================
// PROFILE MODULE ROUTES
// =============================================================================

Route::prefix('profile')->group(function () {
    // Get CSRF Token (Public)
    Route::get('/csrf-token', [AuthController::class, 'getCsrfToken'])->name('admin.profile.csrf');

    // Public Profile Routes
    Route::post('/register', [AuthController::class, 'register'])->name('admin.profile.register');
    Route::post('/login', [AuthController::class, 'login'])->name('admin.profile.login');

    // Protected Profile Routes (Require Authentication via Session/Cookie)
    Route::middleware(['auth'])->group(function () {
        Route::get('/', [AuthController::class, 'getProfile'])->name('admin.profile.get');
        Route::put('/', [AuthController::class, 'updateProfile'])->name('admin.profile.update');
        Route::delete('/', [AuthController::class, 'deleteProfile'])->name('admin.profile.delete');
        Route::post('/logout', [AuthController::class, 'logout'])->name('admin.profile.logout');
    });
});

// =============================================================================
// ITEM MODULE ROUTES  
// =============================================================================

Route::prefix('items')->group(function () {
    // Public Item Routes (for viewing available items)
    Route::get('/available', [ItemController::class, 'available'])->name('admin.items.available');

    // Protected Item Routes (Require Authentication via Session/Cookie)
    Route::middleware(['auth'])->group(function () {
        // CRUD Operations
        Route::get('/', [ItemController::class, 'index'])->name('admin.items.index');
        Route::post('/', [ItemController::class, 'store'])->name('admin.items.store');
        Route::get('/{item}', [ItemController::class, 'show'])->name('admin.items.show');
        Route::put('/{item}', [ItemController::class, 'update'])->name('admin.items.update');
        Route::delete('/{item}', [ItemController::class, 'destroy'])->name('admin.items.destroy');
        
        // Additional Item Management Routes
        Route::post('/{item}/toggle-active', [ItemController::class, 'toggleActive'])->name('admin.items.toggle-active');
        Route::put('/{item}/stock', [ItemController::class, 'updateStock'])->name('admin.items.update-stock');
    });
});

// =============================================================================
// ORDER MODULE ROUTES  
// =============================================================================

Route::prefix('orders')->group(function () {
    // Protected Order Routes (Require Authentication via Session/Cookie)
    Route::middleware(['auth'])->group(function () {
        // CRUD Operations
        Route::get('/', [OrderController::class, 'index'])->name('admin.orders.index');
        Route::post('/', [OrderController::class, 'store'])->name('admin.orders.store');
        Route::get('/statistics', [OrderController::class, 'statistics'])->name('admin.orders.statistics');
        Route::get('/status/{status}', [OrderController::class, 'byStatus'])->name('admin.orders.by-status');
        Route::get('/{order}', [OrderController::class, 'show'])->name('admin.orders.show');
        Route::put('/{order}', [OrderController::class, 'update'])->name('admin.orders.update');
        Route::delete('/{order}', [OrderController::class, 'destroy'])->name('admin.orders.destroy');
        
        // Additional Order Management Routes
        Route::patch('/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
    });
});