<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_admin_peut_se_connecter_avec_des_identifiants_valides(): void
    {
        User::factory()->create([
            'email' => 'admin@minigarage.com',
            'password' => Hash::make('admin1234'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@minigarage.com',
            'password' => 'admin1234',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);
    }

    public function test_la_connexion_echoue_avec_un_mauvais_mot_de_passe(): void
    {
        User::factory()->create([
            'email' => 'admin@minigarage.com',
            'password' => Hash::make('admin1234'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@minigarage.com',
            'password' => 'mauvais-mot-de-passe',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_les_routes_vehicules_sont_protegees_sans_authentification(): void
    {
        $response = $this->getJson('/api/vehicules');

        $response->assertStatus(401);
    }

    public function test_un_utilisateur_connecte_peut_se_deconnecter(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout');

        $response->assertOk();
    }
}