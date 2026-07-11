<?php

namespace Tests\Feature;

use App\Models\Reparation;
use App\Models\Technicien;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TechnicienApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Sanctum::actingAs(User::factory()->create());
    }

    public function test_peut_lister_les_techniciens(): void
    {
        Technicien::factory()->count(4)->create();

        $response = $this->getJson('/api/techniciens');

        $response->assertOk()->assertJsonCount(4);
    }

    public function test_peut_creer_un_technicien_avec_donnees_valides(): void
    {
        $payload = [
            'nom' => 'Diop',
            'prenom' => 'Awa',
            'specialite' => 'Moteur',
        ];

        $response = $this->postJson('/api/techniciens', $payload);

        $response->assertCreated()->assertJsonFragment(['nom' => 'Diop']);
        $this->assertDatabaseHas('techniciens', ['nom' => 'Diop', 'prenom' => 'Awa']);
    }

    public function test_la_creation_echoue_si_champs_obligatoires_manquants(): void
    {
        $response = $this->postJson('/api/techniciens', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nom', 'prenom', 'specialite']);
    }

    public function test_peut_afficher_un_technicien_avec_ses_reparations(): void
    {
        $technicien = Technicien::factory()->create();
        $reparation = Reparation::factory()->create();
        $reparation->techniciens()->attach($technicien->id);

        $response = $this->getJson("/api/techniciens/{$technicien->id}");

        $response->assertOk()->assertJsonCount(1, 'reparations');
    }

    public function test_peut_modifier_un_technicien(): void
    {
        $technicien = Technicien::factory()->create(['specialite' => 'Carrosserie']);

        $response = $this->putJson("/api/techniciens/{$technicien->id}", [
            'nom' => $technicien->nom,
            'prenom' => $technicien->prenom,
            'specialite' => 'Électricité',
        ]);

        $response->assertOk()->assertJsonFragment(['specialite' => 'Électricité']);
    }

    public function test_peut_supprimer_un_technicien(): void
    {
        $technicien = Technicien::factory()->create();

        $response = $this->deleteJson("/api/techniciens/{$technicien->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('techniciens', ['id' => $technicien->id]);
    }

    public function test_supprimer_un_technicien_ne_supprime_pas_ses_reparations(): void
    {
        // Vérifie que la table pivot ne bloque pas la suppression et que la réparation reste
        $technicien = Technicien::factory()->create();
        $reparation = Reparation::factory()->create();
        $reparation->techniciens()->attach($technicien->id);

        $response = $this->deleteJson("/api/techniciens/{$technicien->id}");

        $response->assertNoContent();
        $this->assertDatabaseHas('reparations', ['id' => $reparation->id]);
    }
}