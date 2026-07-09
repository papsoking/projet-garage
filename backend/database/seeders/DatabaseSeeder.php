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
        $vehicules = Vehicule::factory(10)->create();
        $techniciens = Technicien::factory(5)->create();
        $reparations = Reparation::factory(15)->create();

        foreach($reparations as $rep){
            $rep->techniciens()->attach($techniciens->random(rand(1,3))->pluck('id'));
        }
    }
}