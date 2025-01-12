<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnnouncementController extends Controller
{
    use ResponseTrait;

    public function index(Request $request)
    {
        return response()->json(Announcement::all());
    }

    public function store(Request $request, $id = null)
    {

        $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'date' => 'nullable|date',
            'time' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {

            Announcement::updateOrCreate([
                'id' => $id
            ], [
                'title' => $request->title,
                'details' => collect([
                    'description' => $request->description,
                    'date' => $request->date,
                    'time' => $request->time
                ])->toArray()
            ]);

            DB::commit();

            return $this->returnResponse('New Announcement', 'Announcement has been '.(!$id?'created':'updated').' successfully', 'success');
        } catch (\Throwable $th) {
            DB::rollBack();

            return $this->returnResponse('New Announcement','Announcement failed to '.(!$id?'create':'update').'', 'error');
        }
    }
}
