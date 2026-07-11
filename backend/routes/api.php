<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Route publique : connexion de l'administrateur
Route::post('/login', [AuthController::class, 'login']);

Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

// Toutes les routes ci-dessous nécessitent un token Sanctum valide
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('vehicules', App\Http\Controllers\Api\VehiculeController::class)
        ->names('api.vehicules');

    Route::apiResource('techniciens', App\Http\Controllers\Api\TechnicienController::class)
        ->names('api.techniciens');

    Route::apiResource('reparations', App\Http\Controllers\Api\ReparationController::class)
        ->names('api.reparations');

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});