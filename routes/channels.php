<?php

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('message.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('active', function ($user) {
    return ['id' => $user->id, 'name' => $user->name, 'active_at' => Carbon::now('Asia/Manila')->format('Y-m-d H:i:s')];
});

Broadcast::channel('notification.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
