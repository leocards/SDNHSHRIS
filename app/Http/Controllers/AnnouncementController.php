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
        $announcement = Announcement::whereDate('details->date', '>=', now('Asia/Manila')->format('Y-m-d'))
            ->orWhereDate('created_at', '=', now('Asia/Manila')->format('Y-m-d'))
            ->get();

        return response()->json($announcement);
    }

    public function store(Request $request, $id = null)
    {

        $request->validate([
            'title' => 'required|max:255',
            'venue' => 'required',
            'description' => 'required',
            'date' => 'nullable|date',
            'time' => 'nullable|string',
        ], [
            'description.required' => 'The subject field is required.'
        ]);

        DB::beginTransaction();
        try {

            Announcement::updateOrCreate([
                'id' => $id
            ], [
                'title' => $request->title,
                'details' => collect([
                    'venue' => $request->venue,
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

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return $this->returnResponse('Delete Announcement', $announcement->title.' has been deleted.', 'success');
    }
}
