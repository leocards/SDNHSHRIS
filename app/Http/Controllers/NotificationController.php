<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->filter;

        return response()->json(
            Notification::with(['fromUser' => function ($query) {
                $query->withoutGlobalScopes()
                    ->select(['id', 'firstname', 'middlename', 'lastname', 'role', 'avatar']);
            }])->where("user_id", Auth::id())
                ->when($filter == "unread", function ($query) {
                    $query->whereNull('viewed');
                })
                ->latest()
                ->get()
        );
    }

    public function view(Notification $notification)
    {
        if(!$notification->viewed) {
            $notification->viewed = true;
            $notification->save();
        }

        return redirect($notification->details['link']);
    }

    public function setNotificationAsRead(Notification $notification)
    {
        try {
            if(!$notification->viewed) {
                $notification->viewed = true;
                $notification->save();
            }

            return response()->json(true);
        } catch (\Throwable $th) {
            return response()->json($th, 400);
        }
    }

    public function markAllAsRead()
    {
        try {
            Notification::where('user_id', Auth::id())->update(['viewed' => true]);

            return response()->json(true);
        } catch (\Throwable $th) {
            return response()->json($th, 400);
        }
    }
}
