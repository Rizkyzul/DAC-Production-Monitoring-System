<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::all();
        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'leader_name' => 'required|string',
        ]);

        $group = Group::create($request->all());
        return response()->json($group, 201);
    }

    public function show($id)
    {
        $group = Group::with('productions')->findOrFail($id);
        return response()->json($group);
    }

    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);
        $group->update($request->all());
        
        return response()->json($group);
    }

    public function destroy($id)
    {
        Group::destroy($id);
        return response()->json(null, 204);
    }
}
