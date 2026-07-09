<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TechnicienFactory extends Factory
{
    protected $model = \App\Models\Technicien::class;

    public function definition()
    {
        return [
            'nom'=>$this->faker->lastName,
            'prenom'=>$this->faker->firstName,
            'specialite'=>$this->faker->word,
        ];
    }
}