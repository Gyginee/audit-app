<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    public function index()
    {
        return User::all();
    }

    // POST /api/users
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required',
            'active' => 'required',
            'full_name' => 'required',
            'username' => 'required|unique:users',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'type' => $request->type,
            'active' => $request->active,
            'full_name' => $request->full_name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user, 201);
    }

    // GET /api/users/{user}
    public function show(User $user)
    {
        return $user;
    }

    // PUT/PATCH /api/users/{user}
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required',
            'active' => 'sometimes|required|boolean',
            'full_name' => 'sometimes|required|string|max:255',
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $user->id,
            'password' => 'sometimes|required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user->update($request->only('type', 'active', 'full_name', 'username', 'password'));

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json($user, 200);
    }
    // DELETE /api/users/{user}
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
