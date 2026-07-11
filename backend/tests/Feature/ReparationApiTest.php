<?php

namespace Tests\Feature;

use App\Models\Reparation;
use App\Models\Technicien;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReparationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Sanctum::actingAs(User::factory()->create());
    }

    public function test_peut_lister_les_reparations_avec_vehicule_et_techniciens(): void
    {
        $reparation = Reparation::factory()->create();
        $technicien = Technicien::factory()->create();
        $reparation->techniciens()->attach($technicien->id);

        $response = $this->getJson('/api/reparations');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonStructure([
                ['id', 'vehicule', 'techniciens'],
            ]);
    }

    public function test_peut_creer_une_reparation_avec_techniciens_assignes(): void
    {
        $vehicule = Vehicule::factory()->create();
        $techniciens = Technicien::factory()->count(2)->create();

        $payload = [
            'vehicule_id' => $vehicule->id,
            'date' => '2026-07-01',
            'duree_main_oeuvre' => 3,
            'objet_reparation' => 'Changement de plaquettes de frein',
            'techniciens' => $techniciens->pluck('id')->toArray(),
        ];

        $response = $this->postJson('/api/reparations', $payload);

        $response->assertCreated()
            ->assertJsonCount(2, 'techniciens');

        $this->assertDatabaseHas('reparations', [
            'vehicule_id' => $vehicule->id,
            'objet_reparation' => 'Changement de plaquettes de frein',
        ]);
        $this->assertDatabaseCount('reparation_technicien', 2);
    }

    public function test_peut_creer_une_reparation_sans_technicien(): void
    {
        $vehicule = Vehicule::factory()->create();

        $payload = [
            'vehicule_id' => $vehicule->id,
            'date' => '2026-07-01',
            'duree_main_oeuvre' => 1,
            'objet_reparation' => 'Vidange',
        ];

        $response = $this->postJson('/api/reparations', $payload);

        $response->assertCreated();
    }

    public function test_la_creation_echoue_si_vehicule_inexistant(): void
    {
        $payload = [
            'vehicule_id' => 9999,
            'date' => '2026-07-01',
            'duree_main_oeuvre' => 1,
            'objet_reparation' => 'Test',
        ];

        $response = $this->postJson('/api/reparations', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors(['vehicule_id']);
    }

    public function test_la_creation_echoue_si_technicien_inexistant(): void
    {
        $vehicule = Vehicule::factory()->create();

        $payload = [
            'vehicule_id' => $vehicule->id,
            'date' => '2026-07-01',
            'duree_main_oeuvre' => 1,
            'objet_reparation' => 'Test',
            'techniciens' => [9999],
        ];

        $response = $this->postJson('/api/reparations', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors(['techniciens.0']);
    }

    public function test_la_creation_echoue_si_format_de_date_invalide(): void
    {
        $vehicule = Vehicule::factory()->create();

        $payload = [
            'vehicule_id' => $vehicule->id,
            'date' => '01/07/2026',
            'duree_main_oeuvre' => 1,
            'objet_reparation' => 'Test',
        ];

        $response = $this->postJson('/api/reparations', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors(['date']);
    }

    public function test_peut_modifier_une_reparation_et_resynchroniser_les_techniciens(): void
    {
        $reparation = Reparation::factory()->create();
        $ancienTechnicien = Technicien::factory()->create();
        $nouveauTechnicien = Technicien::factory()->create();
        $reparation->techniciens()->attach($ancienTechnicien->id);

        $payload = [
            'vehicule_id' => $reparation->vehicule_id,
            'date' => $reparation->date->format('Y-m-d'),
            'duree_main_oeuvre' => $reparation->duree_main_oeuvre,
            'objet_reparation' => 'Objet mis à jour',
            'techniciens' => [$nouveauTechnicien->id],
        ];

        $response = $this->putJson("/api/reparations/{$reparation->id}", $payload);

        $response->assertOk()->assertJsonFragment(['objet_reparation' => 'Objet mis à jour']);

        $this->assertDatabaseHas('reparation_technicien', [
            'reparation_id' => $reparation->id,
            'technicien_id' => $nouveauTechnicien->id,
        ]);
        $this->assertDatabaseMissing('reparation_technicien', [
            'reparation_id' => $reparation->id,
            'technicien_id' => $ancienTechnicien->id,
        ]);
    }

    public function test_peut_supprimer_une_reparation(): void
    {
        $reparation = Reparation::factory()->create();
        $technicien = Technicien::factory()->create();
        $reparation->techniciens()->attach($technicien->id);

        $response = $this->deleteJson("/api/reparations/{$reparation->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('reparations', ['id' => $reparation->id]);
        $this->assertDatabaseMissing('reparation_technicien', ['reparation_id' => $reparation->id]);
    }
}