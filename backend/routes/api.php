<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('vehicules',   App\Http\Controllers\Api\VehiculeController::class)
    ->names('api.vehicules');

Route::apiResource('techniciens', App\Http\Controllers\Api\TechnicienController::class)
    ->names('api.techniciens');

Route::apiResource('reparations', App\Http\Controllers\Api\ReparationController::class)
    ->names('api.reparations');
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});