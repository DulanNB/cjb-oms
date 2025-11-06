<?php

namespace Src\Admin\Profile\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Src\Admin\Profile\Requests\LoginRequest;
use Src\Admin\Profile\Requests\RegisterRequest;

class AuthController extends Controller
{
    /**
     * Admin Profile Login - Cookie Based
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Optional: Check if user has admin role
        // if (!$user->is_admin) {
        //     throw ValidationException::withMessages([
        //         'email' => ['You do not have admin access.'],
        //     ]);
        // }

        // Login using session/cookie
        Auth::login($user, $request->boolean('remember'));

        // Regenerate session to prevent fixation attacks
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Admin login successful',
            'user' => $user,
        ]);
    }

    /**
     * Admin Profile Registration - Cookie Based
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // 'is_admin' => true, // Uncomment if needed
            // 'role' => 'admin',  // Uncomment if needed
        ]);

        // Login using session/cookie
        Auth::login($user);

        // Regenerate session
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Admin registration successful',
            'user' => $user,
        ], 201);
    }

    /**
     * Admin Profile Logout - Cookie Based
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Admin logged out successfully',
        ]);
    }

    /**
     * Get Authenticated Admin User Profile
     */
    public function getProfile(Request $request)
    {
        return response()->json([
            'data' => Auth::user(),
        ]);
    }

    /**
     * Update Admin Profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Delete Admin Profile (Soft delete or actual delete)
     */
    public function deleteProfile(Request $request)
    {
        $user = Auth::user();
        
        // Logout first
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Delete user account
        $user->delete();

        return response()->json([
            'message' => 'Profile deleted successfully',
        ]);
    }

    /**
     * Get CSRF Token
     */
    public function getCsrfToken(Request $request)
    {
        return response()->json([
            'csrf_token' => csrf_token(),
        ]);
    }
}
