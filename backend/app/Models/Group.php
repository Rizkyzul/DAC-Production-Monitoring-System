<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['name', 'leader_name'];

    public function productions()
    {
        return $this->hasMany(Production::class);
    }
}
