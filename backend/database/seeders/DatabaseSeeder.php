<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,    // 1. Isi Role dulu
            GroupSeeder::class,   // 2. Isi Group dulu
            TestUserSeeder::class // 3. Baru buat User (yang butuh role & group)
        ]);
    }
}