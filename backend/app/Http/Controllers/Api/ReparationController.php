<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return response()->json(Reparation::with(['vehicule', 'techniciens'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|integer|exists:vehicules,id',
            'date' => 'required|date_format:Y-m-d',
            'duree_main_oeuvre' => 'required|numeric|min:0',
            'objet_reparation' => 'required|string|max:255',
            'techniciens' => 'sometimes|array',
            'techniciens.*' => 'integer|exists:techniciens,id'
        ]);

        $techniciens = $validated['techniciens'] ?? null;
        unset($validated['techniciens']);

        $reparation = Reparation::create($validated);

        // Attacher les techniciens si fournis
        if ($techniciens !== null) {
            $reparation->techniciens()->sync($techniciens);
        }

        // Charger les relations pour la réponse
        $reparation->load(['vehicule', 'techniciens']);

        return response()->json($reparation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reparation $reparation)
    {
        $reparation->load(['vehicule', 'techniciens']);

        return response()->json($reparation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reparation $reparation)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|integer|exists:vehicules,id',
            'date' => 'required|date_format:Y-m-d',
            'duree_main_oeuvre' => 'required|numeric|min:0',
            'objet_reparation' => 'required|string|max:255',
            'techniciens' => 'sometimes|array',
            'techniciens.*' => 'integer|exists:techniciens,id'
        ]);

        $techniciens = $validated['techniciens'] ?? null;
        unset($validated['techniciens']);

        $reparation->update($validated);

        // Synchroniser les techniciens si fournis
        if ($techniciens !== null) {
            $reparation->techniciens()->sync($techniciens);
        }

        // Charger les relations pour la réponse
        $reparation->load(['vehicule', 'techniciens']);

        return response()->json($reparation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reparation $reparation)
    {
        // Détacher les techniciens avant de supprimer
        $reparation->techniciens()->detach();

        $reparation->delete();

        return response()->json(null, 204);
    }
}
