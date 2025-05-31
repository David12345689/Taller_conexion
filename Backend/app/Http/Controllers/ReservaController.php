<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Vehiculo;

class ReservaController extends Controller
{
    public function index()
    {
        return Reserva::all();
    }
    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'estado' => 'required|in:activa,finalizada',
        ]);

        
        $reserva = Reserva::create($validated);

        
        $vehiculo = Vehiculo::find($validated['vehiculo_id']);
        if ($vehiculo) {
            $vehiculo->estado = 'alquilado';
            $vehiculo->save();
        }

        return response()->json([
            'mensaje' => 'Reserva creada correctamente.',
            'reserva' => $reserva
        ], 201);
    }

    public function finalizar($id)
    {
        $reserva = Reserva::findOrFail($id);

        if ($reserva->estado !== 'activa') {
            return response()->json(['mensaje' => 'La reserva no está activa.'], 400);
        }

        $reserva->estado = 'completada';
        $reserva->save();

        $vehiculo = Vehiculo::find($reserva->vehiculo_id);
        if ($vehiculo) {
            $vehiculo->estado = 'mantenimiento'; // nuevo estado
            $vehiculo->save();
        }

        return response()->json(['mensaje' => 'Reserva finalizada. Vehículo en mantenimiento.']);
    }
}