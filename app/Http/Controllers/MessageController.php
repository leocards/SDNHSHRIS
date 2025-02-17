<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    use ResponseTrait;

    public function index(Request $request)
    {
        return response()->json(Message::where('sender', $request->user()->id)
            ->orWhere('receiver', $request->user()->id)
            ->get()
            ->filter(function ($message) {
                // Check if there is at least one record in the conversations table for this message
                return $message->conversations()->exists();
            })
            ->map(function ($message) use ($request) {
                // Get the latest conversation record
                $message['conversations'] = $message->conversations()->latest()->first();

                if ($message->sender == $request->user()->id) {
                    // Retrieve the receiver's details
                    $message['user'] = $message->receiver()->first()?->only(['id', 'full_name', 'avatar']);
                } else {
                    // Retrieve the sender's details
                    $message['user'] = $message->sender()->first()?->only(['id', 'full_name', 'avatar']);
                }

                return $message;
            })
            ->sortByDesc('conversations.created_at')
            ->values());
    }

    public function searchMessage(Request $request)
    {
        $search = $request->query('search');
        $auth = $request->user()->id;

        return response()->json(
            User::where(function ($query) use ($search) {
                    $query->where('firstname', 'LIKE', "%{$search}%")
                        ->orWhere('lastname', 'LIKE', "%{$search}%")
                        ->orWhere('middlename', 'LIKE', "%{$search}%");
                })
                ->get(['id', 'firstname', 'lastname', 'middlename', 'avatar'])
                ->filter(function ($data) use ($auth) {
                    $exists = Message::where(function ($query) use ($data, $auth) {
                        $query->where('sender', $data->id)
                            ->where('receiver', $auth)
                            ->orWhere('sender', $auth)
                            ->where('receiver', $data->id);
                    })
                        ->has('conversations')
                        ->exists();

                    return $exists;
                })
                ->values()
        );
    }

    public function searchNewMessage(Request $request): JsonResponse
    {
        $search = $request->query('search');

        $auth = $request->user()->id;

        $users = User::where(function ($query) use ($search) {
            $query->where('firstname', 'LIKE', "%{$search}%")
                ->orWhere('lastname', 'LIKE', "%{$search}%")
                ->orWhere('middlename', 'LIKE', "%{$search}%");
        })
            ->whereNot('id', $auth)
            ->get(['id', 'firstname', 'lastname', 'middlename', 'avatar'])
            ->filter(function ($data) use ($auth) {
                $exists = Message::where(function ($query) use ($auth, $data) {
                    $query->where(function ($query) use ($data, $auth) {
                        $query->where('sender', $data->id)
                            ->where('receiver', $auth)
                            ->orWhere('sender', $auth)
                            ->where('receiver', $data->id);
                    })
                        ->doesntHave('conversations');
                })->exists();

                $exists2 = Message::where('sender', $auth)
                    ->where('receiver', $data->id)
                    ->orWhere('receiver', $auth)
                    ->where('sender', $data->id)
                    ->exists();

                return $exists || !$exists2;
            })
            ->values();

        return response()->json($users);
    }

    public function storeMessageConversation(Request $request)
    {
        DB::beginTransaction();
        try {

            $authid = $request->user()->id;
            $textmessage = $request->message;

            $message = Message::where(function ($query) use ($authid, $request) {
                $query->where('sender', $authid)
                    ->where('receiver', $request->userid)
                    ->orWhere('receiver', $authid)
                    ->where('sender', $request->userid);
            })->first();

            if (!$message)
                $message = Message::create([
                    "sender" => $authid,
                    "receiver" => $request->userid
                ]);

            $newmessage = $message->conversations()->create([
                "sender" => $authid,
                "message" => $textmessage,
            ]);

            $newmessage['seen_at'] = Carbon::now();

            $mess = collect([
                "id" => $message->id,
                "sender",
                "receiver",
                "created_at",
                "updated_at",
                "conversations" => $newmessage,
                "user" => User::find($request->userid)->only(['id', 'full_name', 'avatar'])
            ]);

            DB::commit();

            return response()->json(['message' => $mess]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['message' => $th->getMessage()], 400);
        }
    }

    public function getUserConversations(Request $request, User $user)
    {
        $message = Message::where(function ($query) use ($user, $request) {
            $query->where('sender', $user->id)
                ->where('receiver', $request->user()->id)
                ->orWhere('sender', $request->user()->id)
                ->where('receiver', $user->id);
        })
            ->first();

        if (!$message) {
            $message = Message::create([
                'sender' => $request->user()->id,
                'receiver' => $user->id
            ]);
        }

        $message->load(['conversations']);

        return response()->json($message);
    }

    public function markAsSeen(Conversation $conversation)
    {
        $conversation->seen_at = Carbon::now();
        $conversation->save();

        return response()->json(true);
    }

    public function searchConversation(Request $request, $userid)
    {
        $search = $request->query('search');
        $authid = $request->user()->id;

        $message = Message::where(function ($query) use ($userid, $authid) {
            $query->where(function ($q) use ($userid, $authid) {
                $q->where('sender', $authid)
                  ->where('receiver', $userid);
            })->orWhere(function ($q) use ($userid, $authid) {
                $q->where('receiver', $authid)
                  ->where('sender', $userid);
            });
        })->first();

        return response()->json(
            $message
                ->conversations()
                ->when($search != '', function ($query) use ($search) {
                    $query->where('message', 'LIKE', "%{$search}%");
                })
                ->latest()
                ->with('sender')
                ->get()
            );
    }

    public function deleteConversation(Request $request, $userid)
    {
        $authid = $request->user()->id;

        $message = Message::where(function ($query) use ($userid, $authid) {
            $query->where(function ($q) use ($userid, $authid) {
                $q->where('sender', $authid)
                  ->where('receiver', $userid);
            })->orWhere(function ($q) use ($userid, $authid) {
                $q->where('receiver', $authid)
                  ->where('sender', $userid);
            });
        })->delete();

        if($message) {
            return $this->returnResponse('Message','Conversation deleted successfully.','success');
        } else {
            return $this->returnResponse('Message','Failed to delete conversation.','error');
        }
    }
}
