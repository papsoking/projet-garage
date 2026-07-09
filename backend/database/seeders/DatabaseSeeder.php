<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicule;
use App\Models\Technicien;
use App\Models\Reparation;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Ne seed que si la base est vide, pour pouvoir être appelé sans
        // risque à chaque démarrage du conteneur (redéploiement, réveil
        // après mise en veille sur Render) sans dupliquer les données.
        if (Vehicule::count() > 0) {
            $this->command->info('Base déjà peuplée, seeding ignoré.');
            return;
        }

        $vehicules = Vehicule::factory(10)->create();
        $techniciens = Technicien::factory(5)->create();
        $reparations = Reparation::factory(15)->create();

        foreach ($reparations as $rep) {
            $rep->techniciens()->attach($techniciens->random(rand(1, 3))->pluck('id'));
        }
    }
}