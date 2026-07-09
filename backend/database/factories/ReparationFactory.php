<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Vehicule;

class ReparationFactory extends Factory
{
    protected $model = \App\Models\Reparation::class;

    public function definition()
    {
        return [
            'vehicule_id'=>Vehicule::factory(),
            'date'=>$this->faker->date(),
            'duree_main_oeuvre' => fake()->numberBetween(1, 20),
            'objet_reparation'=>$this->faker->sentence,
        ];
    }
}