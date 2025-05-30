<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        return Vehiculo::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'anio' => 'required|integer',
            'categoria' => 'required|string|max:255',
            'estado' => 'required|in:disponible,alquilado,mantenimiento',
        ]);

        $vehiculo = Vehiculo::create($request->all());

        return response()->json([
            'mensaje' => 'Vehículo registrado exitosamente.',
            'vehiculo' => $vehiculo
        ], 201);
    }

    public function show($id)
    {
        return Vehiculo::findOrFail($id);
    }

   public function update(Request $request, $id)
    {
        $request->validate([
            'marca' => 'required|string|max:100',
            'modelo' => 'required|string|max:100',
            'anio' => 'required|integer',
            'categoria' => 'nullable|string|max:50',
            'estado' => 'in:disponible,alquilado,mantenimiento'
        ]);

        $vehiculo = Vehiculo::findOrFail($id);
        $vehiculo->update($request->all());

        return response()->json([
            'mensaje' => 'Vehículo actualizado exitosamente.',
            'vehiculo' => $vehiculo
        ]);
    }

   public function destroy($id)
    {
        $vehiculo = Vehiculo::findOrFail($id);
        $vehiculo->delete();

        return response()->json([
            'mensaje' => 'Vehículo eliminado correctamente.'
        ], 204);
    }
}
