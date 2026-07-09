<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Technicien;
use Illuminate\Http\Request;

class TechnicienController extends Controller
{
    public function index()
    {
        return response()->json(Technicien::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'specialite' => 'required|string|max:100',
        ]);

        $technicien = Technicien::create($validated);
        return response()->json($technicien, 201);
    }

    public function show(Technicien $technicien)
    {
        return response()->json($technicien->load('reparations'));
    }

    public function update(Request $request, Technicien $technicien)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'specialite' => 'required|string|max:100',
        ]);

        $technicien->update($validated);
        return response()->json($technicien);
    }

    public function destroy(Technicien $technicien)
    {
        $technicien->delete();
        return response()->json(null, 204);
    }
}
