<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation', 20)->unique();
            $table->string('marque', 100);
            $table->string('modele', 100);
            $table->string('couleur', 50);
            $table->integer('annee');
            $table->integer('kilometrage');
            $table->string('carrosserie', 100);
            $table->string('energie', 50);
            $table->string('boite', 50);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
