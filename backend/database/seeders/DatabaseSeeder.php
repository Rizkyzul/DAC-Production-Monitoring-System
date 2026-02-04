<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Production; // Import modelnya

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,     // 1. Isi Role (Admin, QC, dll)
            GroupSeeder::class,    // 2. Isi Group (Line 1, Line 2, dll)
            TestUserSeeder::class  // 3. Isi User
        ]);

        // 4. TERAKHIR: Isi data produksi dalam jumlah banyak
        // Kita buat 1000 data dummy berdasarkan ProductionFactory yang tadi
        Production::factory()->count(1000)->create();
    }
}