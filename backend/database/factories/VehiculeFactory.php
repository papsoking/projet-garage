<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VehiculeFactory extends Factory
{
    protected $model = \App\Models\Vehicule::class;

    public function definition()
    {
        return [
            'immatriculation' => $this->faker->unique()->bothify('??-####-??'),
            'marque' => $this->faker->company,
            'modele' => $this->faker->word,
            'couleur' => $this->faker->colorName,
            'annee' => $this->faker->year,
            'kilometrage' => $this->faker->numberBetween(1000, 200000),
            'carrosserie' => $this->faker->word,
            'energie' => $this->faker->randomElement(['Essence', 'Diesel', 'Electrique']),
            'boite' => $this->faker->randomElement(['Manuelle', 'Automatique']),
        ];
    }
}
