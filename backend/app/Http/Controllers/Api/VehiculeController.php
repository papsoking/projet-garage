<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class VehiculeController extends Controller
{
    public function index()
    {
        $search = request('search');

        $vehicules = Vehicule::query()
            ->when($search, function ($query, $search) {
                $like = '%'.strtolower($search).'%';
                $query->whereRaw('LOWER(marque) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(immatriculation) LIKE ?', [$like]);
            })
            ->get();

        return response()->json($vehicules);
    }

    public function store(Request $request)
    {
        $currentYear = (int) date('Y') + 1;

        $validated = $request->validate([
            'immatriculation' => 'required|string|unique:vehicules|max:20',
            'marque' => 'required|string|max:50',
            'modele' => 'required|string|max:50',
            'couleur' => 'required|string|max:30',
            'annee' => "required|integer|min:1900|max:{$currentYear}",
            'kilometrage' => 'required|integer|min:0',
            'carrosserie' => 'required|string|max:50',
            'energie' => 'required|string|max:20',
            'boite' => 'required|string|max:20',
        ]);

        $vehicule = Vehicule::create($validated);

        return response()->json($vehicule, 201);
    }

    public function show(Vehicule $vehicule)
    {
        $vehicule->load('reparations.techniciens');

        return response()->json($vehicule);
    }

    public function update(Request $request, Vehicule $vehicule)
    {
        $currentYear = (int) date('Y') + 1;

        $validated = $request->validate([
            'immatriculation' => "required|string|max:20|unique:vehicules,immatriculation,$vehicule->id",
            'marque' => 'required|string|max:50',
            'modele' => 'required|string|max:50',
            'couleur' => 'required|string|max:30',
            'annee' => "required|integer|min:1900|max:{$currentYear}",
            'kilometrage' => 'required|integer|min:0',
            'carrosserie' => 'required|string|max:50',
            'energie' => 'required|string|max:20',
            'boite' => 'required|string|max:20',
        ]);

        $vehicule->update($validated);

        return response()->json($vehicule);
    }

    public function destroy(Vehicule $vehicule)
    {
        $vehicule->delete();

        return response()->json(null, 204);
    }
}