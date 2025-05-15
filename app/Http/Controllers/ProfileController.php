<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Mail\EmailNotification;
use App\Models\Notification;
use App\Models\PdsPersonalInformation;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $address = PdsPersonalInformation::where('user_id', $request->user()->id)->first()?->addresses()->get();
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'tab' => $request->query('t'),
            'address' => collect([
                "permanent" => $address?->where('type', 'permanent')?->first(),
                "residential" => $address?->where('type', 'residential')?->first(),
            ])
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'firstname' => $request->personal['firstname'],
            'lastname' => $request->personal['lastname'],
            'middlename' => $request->personal['middlename'],
            'extensionname' => $request->personal['extensionname'],
            'birthday' => $request->personal['birthday'],
            'gender' => $request->personal['gender'],
            'email' => $request->contact['email'],
            'mobilenumber' => $request->contact['mobilenumber'],
        ]);

        $request->user()->save();

        $pronoun = $request->user()->gender === 'female' ? 'her' : 'his';
        $hr = User::where('role', 'hr')->first();

        Notification::create([
            'user_id' => $hr->id,
            'from_user_id' => $request->user()->id,
            'type' => 'pdsupdate',
            'details' => collect([
                'link' => route('myapproval.pds'),
                'message' => 'updated ' . $pronoun . ' profile.'
            ])->toArray()
        ]);

        $data = [
            'name' => $request->user()->name,
            'pronoun' => $request->user()->gender == 'male' ? 'his' : 'her'
        ];

        Mail::to($hr->email)
            ->send(new EmailNotification(
                'Profile Update',
                'updateprofile',
                $data,
                [
                    'email' => $request->user()->email,
                    'name' => $request->user()->name
                ]
            ));

        return Redirect::route('profile.edit')->with(['message' => 'Your acount profile has been updated.', 'title' => 'Account update successfull', 'status' => 'success']);
    }

    public function profilePhotoUpload(Request $request)
    {
        $request->validate([
            'image' => 'required|mimes:png,jpg,jpeg|max:10240', // 10MB max size
        ]);

        $path = null;

        DB::beginTransaction();
        try {

            $path = $request->file('image')->store('public/avatar');

            $user = User::find(Auth::id());

            $user->avatar = str_replace('public', '/storage', $path);

            $user->save();

            DB::commit();

            return back()->with(['title' => 'Profile photo', 'message' => 'Successfull upload of profile photo', 'status' => 'success']);

        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors(['title' => 'Profile photo', 'message' => $th->getMessage(), 'status' => 'success']);
        }
    }

    public function settings(Request $request): JsonResponse
    {
        $request->validate([
            'enabled' => 'boolean',
        ]);

        try {
            if($request->type === 'notification')
                $request->user()->update([
                    'enable_email_notification' => $request->enabled,
                ]);
            else if($request->type === 'message')
                $request->user()->update([
                    'enable_email_message_notification' => $request->enabled,
                ]);
            else if($request->type === 'announcement')
                $request->user()->update([
                    'enable_email_announcement_reminder' => $request->enabled,
                ]);

            $request->user()->save();

            return response()->json(['title' => 'Changes saved!', 'message' => 'Changes in settings has been saved.', 'status' => 'success']);
        } catch (\Throwable $th) {
            return response()->json(['title' => 'Update failed!', 'message' => $th->getMessage(), 'status' => 'error']);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
