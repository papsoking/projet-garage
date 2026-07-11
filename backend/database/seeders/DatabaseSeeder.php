<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Vehicule;
use App\Models\Technicien;
use App\Models\Reparation;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->seedAdmin();

        // Ne seed les données métier que si la base est vide, pour pouvoir être
        // appelé sans risque à chaque démarrage du conteneur (redéploiement,
        // réveil après mise en veille sur Render) sans dupliquer les données.
        if (Vehicule::count() > 0) {
            $this->command->info('Base déjà peuplée, seeding des véhicules ignoré.');
            return;
        }

        $vehicules = Vehicule::factory(10)->create();
        $techniciens = Technicien::factory(5)->create();
        $reparations = Reparation::factory(15)->create();

        foreach ($reparations as $rep) {
            $rep->techniciens()->attach($techniciens->random(rand(1, 3))->pluck('id'));
        }
    }

    /**
     * Crée/synchronise le compte administrateur à partir des variables
     * d'environnement ADMIN_EMAIL / ADMIN_PASSWORD (voir config/admin.php).
     * Toujours exécuté (pas seulement si la base est vide) afin qu'un
     * changement de mot de passe dans .env soit repris au prochain déploiement.
     */
    private function seedAdmin(): void
    {
        $email = config('admin.email');
        $password = config('admin.password');

        // Nettoyage : supprime d'anciens comptes admin (ex: les identifiants
        // par défaut utilisés avant la mise en place des variables d'environnement)
        // pour ne garder que le compte réellement configuré.
        User::where('email', '!=', $email)->delete();

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrateur',
                'password' => Hash::make($password),
            ]
        );

        $this->command->info("Compte administrateur synchronisé : {$email}");
    }
}