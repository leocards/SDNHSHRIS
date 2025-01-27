<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role1, string $role2 = null, string $role3 = null): Response
    {
        if($request->user()->hasRole($role1) || $request->user()->hasRole($role2) || $request->user()->hasRole($role3))
            return $next($request);

        return redirect()->back()->with(['title' => 'Unauthorized access', 'message' => 'You are not authorized to access this page', 'status' => 'warning']);
    }
}
