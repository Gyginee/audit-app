<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagePath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ImagePathController extends Controller
{
    public function index()
    {
        return ImagePath::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'type' => 'required|max:255',
            'round_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $imagePath = ImagePath::create($request->all());
        return response()->json($imagePath, 201);
    }

    public function show(ImagePath $imagePath)
    {
        return $imagePath;
    }

    public function update(Request $request, ImagePath $imagePath)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'type' => 'required|max:255',
            'round_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $imagePath->update($request->all());
        return response()->json($imagePath, 200);
    }

    public function destroy(ImagePath $imagePath)
    {
        $imagePath->delete();
        return response()->json(null, 204);
    }
}
