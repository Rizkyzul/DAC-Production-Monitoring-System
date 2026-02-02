<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        \Illuminate\Support\Facades\Log::info('Login Attempt', [
            'email' => $request->email,
            'password_received' => $request->password,
            'user_exists' => $user ? 'yes' : 'no',
            'hash_check' => $user && Hash::check($request->password, $user->password) ? 'pass' : 'fail',
            'db_password_hash' => $user ? $user->password : 'null'
        ]);

        if (! $user || ! Hash::check($request->password, $user->password)) {
             // Fallback to Auth::attempt just in case, but usually manual check is enough for API
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.',
                ], 401);
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('role'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('role'));
    }
}
