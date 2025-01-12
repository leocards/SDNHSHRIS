<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsCs4Controller extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->all();

            $this->convertNullToEmptyString($data, ['datefiled']);

            $request->user()->pdsC4()->create(['type' => "34", 'details' => $data['34']]);
            $request->user()->pdsC4()->create(['type' => "35", 'details' => $data['35']]);
            $request->user()->pdsC4()->create(['type' => "36", 'details' => $data['36']]);
            $request->user()->pdsC4()->create(['type' => "37", 'details' => $data['37']]);
            $request->user()->pdsC4()->create(['type' => "38", 'details' => $data['38']]);
            $request->user()->pdsC4()->create(['type' => "39", 'details' => $data['39']]);
            $request->user()->pdsC4()->create(['type' => "40", 'details' => $data['40']]);
            $request->user()->pdsC4()->create(['type' => "41", 'details' => $data['41']]);
            $request->user()->pdsC4()->create(['type' => "governmentId", 'details' => $data['governmentids']]);

            $request->user()->personalDataSheet()->updateOrCreate([
                'user_id' => $request->user()->id
            ],[
                'status' => 'pending'
            ]);

            DB::commit();

            $pronoun = $request->user()->gender === 'female' ? 'her' : 'his';
            $hr = User::where('role', 'hr')->first();

            Notification::create([
                'user_id' => $hr->id,
                'type' => 'pdsupdate',
                'details' => collect([
                    'link' => route('myapproval.pds'),
                    'name' =>  $request->user()->full_name,
                    'avatar' => $request->user()->avatar,
                    'message' => 'updated '.$pronoun.' PDS C4.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'C4', 'message' => 'C4 successfully saved!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with(['title' => 'C4', 'message' => 'Failed to save C4!', 'status' => 'error']);
        }

    }

    public function update(Request $request)
    {
        DB::beginTransaction();

        try {

            $data = $request->all();

            $this->convertNullToEmptyString($data, ['datefiled']);

            $request->user()->pdsC4()->where('type', '34')->update(['details' => $data['34']]);
            $request->user()->pdsC4()->where('type', '35')->update(['details' => $data['35']]);
            $request->user()->pdsC4()->where('type', '36')->update(['details' => $data['36']]);
            $request->user()->pdsC4()->where('type', '37')->update(['details' => $data['37']]);
            $request->user()->pdsC4()->where('type', '38')->update(['details' => $data['38']]);
            $request->user()->pdsC4()->where('type', '39')->update(['details' => $data['39']]);
            $request->user()->pdsC4()->where('type', '40')->update(['details' => $data['40']]);
            $request->user()->pdsC4()->where('type', '41')->update(['details' => $data['41']]);
            $request->user()->pdsC4()->where('type', 'governmentId')->update(['details' => $data['governmentids']]);

            $request->user()->personalDataSheet()->updateOrCreate([
                'user_id' => $request->user()->id
            ],[
                'status' => 'pending'
            ]);

            DB::commit();

            $pronoun = $request->user()->gender === 'female' ? 'her' : 'his';
            $hr = User::where('role', 'hr')->first();

            Notification::create([
                'user_id' => $hr->id,
                'type' => 'pdsupdate',
                'details' => collect([
                    'link' => route('myapproval.pds'),
                    'name' =>  $request->user()->full_name,
                    'avatar' => $request->user()->avatar,
                    'message' => 'updated '.$pronoun.' PDS C4.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'C4', 'message' => 'C4 successfully saved!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with(['title' => 'C4', 'message' => 'Failed to save C4!', 'status' => 'error']);
        }

    }

    function convertNullToEmptyString(&$array, $excludeKeys = [])
    {
        foreach ($array as $key => &$value) {
            if (is_array($value)) {
                $this->convertNullToEmptyString($value, $excludeKeys);
            } elseif (is_null($value) && !in_array($key, $excludeKeys)) {
                $value = '';
            }
        }
    }
}
