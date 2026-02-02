<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'admin' => ['name' => 'Admin User', 'email' => 'admin@dac.com'],
            'pra-assembly' => ['name' => 'Pra Assembly Staff', 'email' => 'pra@dac.com'],
            'assembly' => ['name' => 'Assembly Worker', 'email' => 'assembly@dac.com'],
            'qc' => ['name' => 'QC Officer', 'email' => 'qc@dac.com'],
            'packing' => ['name' => 'Packing Staff', 'email' => 'packing@dac.com'],
            'logistics' => ['name' => 'Logistics Manager', 'email' => 'logistics@dac.com'],
        ];

        foreach ($roles as $roleName => $userData) {
            // FIX 1: Buat Role-nya dulu jika tidak ada
            $role = Role::firstOrCreate(['name' => $roleName]);

            // FIX 2: Gunakan updateOrCreate agar tidak duplikat jika dijalankan berkali-kali
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'email_verified_at' => now(),
                    'password' => 'password', // Pastikan di model User ada casts 'password' => 'hashed'
                    'role_id' => $role->id,
                    'remember_token' => Str::random(10),
                ]
            );
        }
        
        $this->command->info('Test users created successfully!');
    }
}