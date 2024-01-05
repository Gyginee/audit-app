<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditRoundTwo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuditRoundTwoController extends Controller
{
    public function index()
    {
        return AuditRoundTwo::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'store_code' => 'required|exists:stores,store_code',
            'user_id' => 'required|integer|exists:users,id',
            'report_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $auditRoundTwo = AuditRoundTwo::create($request->all());
        return response()->json($auditRoundTwo, 201);
    }

    public function show(AuditRoundTwo $auditRoundTwo)
    {
        return $auditRoundTwo;
    }

    public function update(Request $request, AuditRoundTwo $auditRoundTwo)
    {
        $validator = Validator::make($request->all(), [
            'store_code' => 'required|exists:stores,store_code',
            'user_id' => 'required|integer|exists:users,id',
            'report_id' => 'required|integer'
        ]);


        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $auditRoundTwo->update($request->all());
        return response()->json($auditRoundTwo, 200);
    }

    public function destroy(AuditRoundTwo $auditRoundTwo)
    {
        $auditRoundTwo->delete();
        return response()->json(null, 204);
    }
}
