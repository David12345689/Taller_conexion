<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return Cliente::with('reservas')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'telefono' => 'required|string|max:50',
            'correo' => 'required|email|max:100',
            'numero_licencia' => 'required|string|max:50'
        ]);

        $cliente = Cliente::create($request->all());

        return response()->json([
            'mensaje' => 'Cliente registrado exitosamente.',
            'cliente' => $cliente
        ], 201);
    }

    public function show($id)
    {
        return Cliente::with('reservas')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($request->all());

        return response()->json(['mensaje' => 'Cliente actualizado correctamente.']);
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();

        return response()->json(['mensaje' => 'Cliente eliminado correctamente.']);
    }
}