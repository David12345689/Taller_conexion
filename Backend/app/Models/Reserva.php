<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    public $timestamps = true;

     protected $fillable = [
        'cliente_id',
        'vehiculo_id',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    public function cliente() {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function vehiculo() {
        return $this->belongsTo(Vehiculo::class);
    }      
}