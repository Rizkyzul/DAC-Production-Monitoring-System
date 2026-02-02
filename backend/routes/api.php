<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\ProductionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Groups
    Route::apiResource('groups', GroupController::class);
    
    // Productions
    Route::apiResource('productions', ProductionController::class);
    Route::post('/productions/{id}/update-stage', [ProductionController::class, 'updateStage']);
    Route::get('/productions-rejected', [ProductionController::class, 'rejectedUnits']);
});
