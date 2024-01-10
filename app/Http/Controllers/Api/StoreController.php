<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    // Display a listing of the stores.
    public function index()
    {
        return Store::all();
    }

    // Store a newly created store in storage.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'store_code' => 'required|unique:stores|max:255',
            'store_name' => 'required|max:255',
            'address' => 'required', // Assuming text field, no max limit
            'province_id' => 'required|integer|exists:provinces,province_id', // Ensure province exists
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $store = Store::create($request->all());
        return response()->json($store, 201);
    }

    // Display the specified store.
    public function show(Store $store)
    {
        return $store;
    }

    // Update the specified store in storage.
    public function update(Request $request, Store $store)
    {
        $validator = Validator::make($request->all(), [
            'store_code' => 'required|max:255', // Assuming store_code is immutable
            'store_name' => 'required|max:255',
            'address' => 'required', // Assuming text field, no max limit
            'province_id' => 'required|integer|exists:provinces,id', // Ensure province exists
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $store->update($request->all());
        return response()->json($store, 200);
    }

    // Remove the specified store from storage.
    public function destroy(Store $store)
    {
        $store->delete();
        return response()->json(null, 204);
    }
}
