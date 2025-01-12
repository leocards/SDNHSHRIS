<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->filter;

        return response()->json(
            Notification::where("user_id", Auth::id())
                ->when($filter == "unread", function ($query) {
                    $query->whereNull('viewed');
                })
                ->latest()
                ->get()
        );
    }

    public function view(Notification $notification)
    {
        return redirect($notification->details->link);
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
