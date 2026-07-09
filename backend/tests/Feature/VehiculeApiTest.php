<?php

namespace Tests\Feature;

use App\Models\Reparation;
use App\Models\Vehicule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehiculeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_peut_lister_les_vehicules(): void
    {
        Vehicule::factory()->count(3)->create();

        $response = $this->getJson('/api/vehicules');

        $response->assertOk()
            ->assertJsonCount(3);
    }

    public function test_la_recherche_filtre_par_marque(): void
    {
        Vehicule::factory()->create(['marque' => 'Renault', 'immatriculation' => 'AA-111-AA']);
        Vehicule::factory()->create(['marque' => 'Peugeot', 'immatriculation' => 'BB-222-BB']);

        $response = $this->getJson('/api/vehicules?search=Renault');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['marque' => 'Renault']);
    }

    public function test_la_recherche_filtre_par_immatriculation(): void
    {
        Vehicule::factory()->create(['marque' => 'Renault', 'immatriculation' => 'AA-111-AA']);
        Vehicule::factory()->create(['marque' => 'Peugeot', 'immatriculation' => 'BB-222-BB']);

        $response = $this->getJson('/api/vehicules?search=BB-222');

        $response->assertOk()->assertJsonCount(1);
    }

    public function test_peut_creer_un_vehicule_avec_donnees_valides(): void
    {
        $payload = [
            'immatriculation' => 'AB-123-CD',
            'marque' => 'Renault',
            'modele' => 'Clio',
            'couleur' => 'Bleu',
            'annee' => 2020,
            'kilometrage' => 45000,
            'carrosserie' => 'Citadine',
            'energie' => 'Essence',
            'boite' => 'Manuelle',
        ];

        $response = $this->postJson('/api/vehicules', $payload);

        $response->assertCreated()
            ->assertJsonFragment(['immatriculation' => 'AB-123-CD']);

        $this->assertDatabaseHas('vehicules', ['immatriculation' => 'AB-123-CD']);
    }

    public function test_la_creation_echoue_si_champs_obligatoires_manquants(): void
    {
        $response = $this->postJson('/api/vehicules', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'immatriculation', 'marque', 'modele', 'couleur',
                'annee', 'kilometrage', 'carrosserie', 'energie', 'boite',
            ]);
    }

    public function test_la_creation_echoue_si_immatriculation_deja_utilisee(): void
    {
        Vehicule::factory()->create(['immatriculation' => 'AB-123-CD']);

        $payload = Vehicule::factory()->make(['immatriculation' => 'AB-123-CD'])->toArray();

        $response = $this->postJson('/api/vehicules', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors(['immatriculation']);
    }

    public function test_la_creation_echoue_si_annee_invalide(): void
    {
        $payload = Vehicule::factory()->make(['annee' => 1800])->toArray();

        $response = $this->postJson('/api/vehicules', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors(['annee']);
    }

    public function test_peut_afficher_le_detail_d_un_vehicule_avec_ses_reparations(): void
    {
        $vehicule = Vehicule::factory()->create();
        Reparation::factory()->count(2)->create(['vehicule_id' => $vehicule->id]);

        $response = $this->getJson("/api/vehicules/{$vehicule->id}");

        $response->assertOk()
            ->assertJsonCount(2, 'reparations');
    }

    public function test_afficher_un_vehicule_inexistant_renvoie_404(): void
    {
        $response = $this->getJson('/api/vehicules/9999');

        $response->assertNotFound();
    }

    public function test_peut_modifier_un_vehicule(): void
    {
        $vehicule = Vehicule::factory()->create(['kilometrage' => 10000]);

        $payload = array_merge($vehicule->toArray(), ['kilometrage' => 25000]);

        $response = $this->putJson("/api/vehicules/{$vehicule->id}", $payload);

        $response->assertOk()->assertJsonFragment(['kilometrage' => 25000]);
        $this->assertDatabaseHas('vehicules', ['id' => $vehicule->id, 'kilometrage' => 25000]);
    }

    public function test_modifier_un_vehicule_peut_garder_sa_propre_immatriculation(): void
    {
        $vehicule = Vehicule::factory()->create(['immatriculation' => 'AB-123-CD']);

        $payload = array_merge($vehicule->toArray(), ['couleur' => 'Rouge']);

        $response = $this->putJson("/api/vehicules/{$vehicule->id}", $payload);

        $response->assertOk();
    }

    public function test_peut_supprimer_un_vehicule_et_ses_reparations_en_cascade(): void
    {
        $vehicule = Vehicule::factory()->create();
        $reparation = Reparation::factory()->create(['vehicule_id' => $vehicule->id]);

        $response = $this->deleteJson("/api/vehicules/{$vehicule->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('vehicules', ['id' => $vehicule->id]);
        $this->assertDatabaseMissing('reparations', ['id' => $reparation->id]);
    }
}