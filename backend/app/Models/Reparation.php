<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reparation extends Model
{
    use HasFactory;

    protected $table = 'reparations';

    protected $fillable = [
        'vehicule_id',
        'date',
        'duree_main_oeuvre',
        'objet_reparation',
        // 'timestamps' => true,
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function techniciens()
    {
        return $this->belongsToMany(Technicien::class, 'reparation_technicien');
    }
}
