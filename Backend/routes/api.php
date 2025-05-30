<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ReservaController;

Route::put('/reservas/{id}/finalizar', [ReservaController::class, 'finalizar']);
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('vehiculos', VehiculoController::class);
Route::apiResource('reservas', ReservaController::class);
