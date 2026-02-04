<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Production extends Model
{
    use HasFactory;
    protected $fillable = [
        'serial_number', 'group_id', 'status_pra_assembly', 'status_assembly',
        'status_qc', 'status_packing', 'status_logistics', 'is_rejected',
        'reject_reason', 'checklist_data'
    ];

    protected $casts = [
        'checklist_data' => 'array',
        'is_rejected' => 'boolean',
        'status_pra_assembly' => 'datetime',
        'status_assembly' => 'datetime',
        'status_qc' => 'datetime',
        'status_packing' => 'datetime',
        'status_logistics' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
