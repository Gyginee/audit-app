<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProvinceController extends Controller
{
    // Display a listing of the provinces.
    public function index()
    {
        return Province::all();
    }

    // Store a newly created province in storage.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'province_name' => 'required|unique:provinces|max:255',
            // Add other fields and validation rules as needed
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $province = Province::create($request->all());
        return response()->json($province, 201);
    }

    // Display the specified province.
    public function show(Province $province)
    {
        return $province;
    }

    // Update the specified province in storage.
    public function update(Request $request, Province $province)
    {
        $validator = Validator::make($request->all(), [
            'province_name' => 'required|max:255',
            // Add other fields and validation rules as needed
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $province->update($request->all());
        return response()->json($province, 200);
    }

    // Remove the specified province from storage.
    public function destroy(Province $province)
    {
        $province->delete();
        return response()->json(null, 204);
    }
}
