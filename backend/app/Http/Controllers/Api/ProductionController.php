<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Production;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function index()
    {
        $productions = Production::with('group')->get();
        return response()->json($productions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'checklist_data' => 'nullable|array',
        ]);

        $production = Production::create($request->all());
        return response()->json($production->load('group'), 201);
    }

    public function show($id)
    {
        $production = Production::with('group')->findOrFail($id);
        return response()->json($production);
    }

    public function update(Request $request, $id)
    {
        $production = Production::findOrFail($id);
        $production->update($request->all());
        
        return response()->json($production->load('group'));
    }

    public function updateStage(Request $request, $id)
    {
        $production = Production::with('group')->findOrFail($id);
        $stage = $request->input('stage');
        
        // Update timestamp for specific stage
        $production->{"status_$stage"} = now();
        
        // Update checklist data if provided
        if ($request->has('checklist_data')) {
            $production->checklist_data = array_merge(
                $production->checklist_data ?? [],
                $request->checklist_data
            );
        }
        
        // Handle rejection
        if ($request->has('is_rejected')) {
            $production->is_rejected = $request->is_rejected;
            $production->reject_reason = $request->reject_reason;
        }
        
        $production->save();
        
        return response()->json($production);
    }

    public function destroy($id)
    {
        Production::destroy($id);
        return response()->json(null, 204);
    }

    // Get productions rejected at QC with group & leader info
    public function rejectedUnits()
    {
        $rejected = Production::with('group')
            ->where('is_rejected', true)
            ->get();
            
        return response()->json($rejected);
    }
}
