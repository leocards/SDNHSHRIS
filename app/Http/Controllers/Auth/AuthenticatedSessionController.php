<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): RedirectResponse // Response
    {
        return redirect('/');

        // return Inertia::render('Auth/Login', [
        //     'canResetPassword' => Route::has('password.request'),
        //     'status' => session('status'),
        // ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        sleep(1.2);

        $user = User::where('email', $request->email)->first();

        if($user) {
            if($user->status_updated_at) {
                $status = $user->status !== 'transferred' ? $user->status : 'transferred to another school';
                return redirect()->back()->with(["title" => "Restricted Account", "message" => "This account is no longer accessible, as the user with these credentials has ".$status.".", "status" => "error"]);
            }
        }

        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->back()->with(["title" => "Login", "message" => "Successfull login attempt", "status" => "success"]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        sleep(1.2);

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(["status" => "success"]);
    }
}
