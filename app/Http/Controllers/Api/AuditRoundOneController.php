<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditRoundOne;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuditRoundOneController extends Controller
{
    public function index()
    {
        return AuditRoundOne::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'store_code' => 'required|exists:stores,store_code',
            'confirm' => 'required|boolean',
            'position' => 'required|max:255',
            'name' => 'required|max:255',
            'phone' => 'required|max:255',
            'user_id' => 'required|integer|exists:users,id',
            'report_id' => 'required|integer'
        ]);


        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $auditRoundOne = AuditRoundOne::create($request->all());
        return response()->json($auditRoundOne, 201);
    }

    public function show(AuditRoundOne $auditRoundOne)
    {
        return $auditRoundOne;
    }

    public function update(Request $request, AuditRoundOne $auditRoundOne)
    {
        $validator = Validator::make($request->all(), [
            'store_code' => 'required|exists:stores,store_code',
            'confirm' => 'required|boolean',
            'position' => 'required|max:255',
            'name' => 'required|max:255',
            'phone' => 'required|max:255',
            'user_id' => 'required|integer|exists:users,id',
            'report_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $auditRoundOne->update($request->all());
        return response()->json($auditRoundOne, 200);
    }

    public function destroy(AuditRoundOne $auditRoundOne)
    {
        $auditRoundOne->delete();
        return response()->json(null, 204);
    }
}
