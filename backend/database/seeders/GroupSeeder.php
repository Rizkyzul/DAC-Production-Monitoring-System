<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['name' => 'Alpha Team', 'leader_name' => 'John Doe'],
            ['name' => 'Beta Squad', 'leader_name' => 'Jane Smith'],
            ['name' => 'Gamma Unit', 'leader_name' => 'Robert Johnson'],
            ['name' => 'Delta Force', 'leader_name' => 'Emily Davis'],
            ['name' => 'Omega Squad', 'leader_name' => 'Michael Brown'],
            ['name' => 'Xenon Group', 'leader_name' => 'Sarah Wilson'],
            ['name' => 'Alpha Team', 'leader_name' => 'John Doe'],
            ['name' => 'Beta Squad', 'leader_name' => 'Jane Smith'],
            
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
