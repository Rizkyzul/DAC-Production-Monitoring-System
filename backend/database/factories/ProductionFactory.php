<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Production;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductionFactory extends Factory
{
    protected $model = Production::class;

    public function definition(): array
    {
        // 1. Logika sederhana untuk simulasi reject
        $isRejected = $this->faker->boolean(15); // 15% kemungkinan barang reject

        // 2. Membuat alur waktu yang masuk akal (berurutan)
        $pra = $this->faker->dateTimeBetween('-1 month', '-25 days');
        $assembly = $this->faker->dateTimeBetween($pra, '-20 days');
        $qc = $this->faker->dateTimeBetween($assembly, '-15 days');
        
        return [
            // Kolom: serial_number
            'serial_number' => 'SN-' . strtoupper($this->faker->bothify('??#-####-####')),
            
            // Kolom: group_id (mengambil ID grup yang sudah ada secara acak)
            'group_id' => Group::inRandomOrder()->first()?->id ?? Group::factory(),
            
            // Kolom-kolom status (Timestamp)
            'status_pra_assembly' => $pra,
            'status_assembly'     => $this->faker->optional(0.9)->dateTimeBetween($pra, 'now'),
            'status_qc'           => $this->faker->optional(0.8)->dateTimeBetween($assembly, 'now'),
            'status_packing'      => $this->faker->optional(0.7)->dateTimeBetween($qc, 'now'),
            'status_logistics'    => $this->faker->optional(0.5)->dateTimeBetween($qc, 'now'),
            
            // Kolom: is_rejected (TinyInt/Boolean)
            'is_rejected' => $isRejected,
            
            // Kolom: reject_reason (Text)
            'reject_reason' => $isRejected ? $this->faker->randomElement([
                'Goresan pada casing',
                'Komponen tidak lengkap',
                'Gagal uji voltase',
                'Kesalahan dimensi',
                'Serial number tidak terbaca'
            ]) : null,
            
            // Kolom: checklist_data (JSON)
            'checklist_data' => [
                'pemeriksaan_fisik' => 'OK',
                'kelengkapan_baut'  => 'Lengkap',
                'tes_fungsi'        => $isRejected ? 'Gagal' : 'Berhasil',
                'petugas'           => $this->faker->name(),
            ],
        ];
    }
}