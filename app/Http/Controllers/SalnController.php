<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Models\Notification;
use App\Models\Saln;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalnController extends Controller
{
    use ResponseTrait, DateParserTrait;

    public function index(Request $request)
    {
        $role = $request->user()->role;
        $status = $request->query('status') ?? "pending";

        $saln = Saln::when($role == "hr", function ($query) {
            $query->with('user');
        })->when($role != "hr", function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->where('status', $status)
            ->paginate($this->page);


        if ($request->expectsJson()) {
            return response()->json($saln);
        }

        if ($role === "hr") {

            return Inertia::render('Myapproval/SALN/SALN', [
                'saln' => Inertia::defer(fn() => $saln)
            ]);
        }

        return Inertia::render('SALN/SALN', [
            'saln' => Inertia::defer(fn() => $saln)
        ]);
    }

    public function create(Request $request, Saln $saln = null)
    {
        $spouse = collect([
            "spousename" => $request->user()->pdsFamilyBackground()->where('type', 'spouse')->value('details'),
            "govid" => null
        ]);

        if($spouse['spousename']) {
            $spouse['govid'] = User::where('lastname')->where('firstname')->first()?->pdsC4()->where('type', 'governmentId')?->value('details');
        }

        return Inertia::render('SALN/NewSALN', [
            'saln' => $saln,
            'spouse' => $spouse['spousename']
        ]);
    }

    public function store(Request $request, Saln $saln = null)
    {
        $request->validate([
            'assets.real.*.acquisition.year' => 'required|numeric',
            'assets.personal.*.yearacquired' => 'nullable|numeric',
        ], [
            'assets.real.*.acquisition.year.numeric' => 'Acquisition year must be a number representation of year.',
            'assets.personal.*.yearacquired.numeric' => 'Year acquired must be a number representation of year.',
        ]);

        DB::beginTransaction();
        try {

            Saln::updateOrCreate([
                'id' => $saln?->id
            ], [
                'user_id' => $request->user()->id,
                'asof' => $this->parseDate($request->asof),
                'spouse' => $request->spouse,
                'children' => $request->children,
                'assets' => $request->assets,
                'liabilities' => $request->liabilities,
                'biandfc' => $request->biandfc,
                'relativesingovernment' => $request->relativesingovernment,
                'date' => Carbon::now()->format('Y-m-d'),
                'isjoint' => $request->isjoint,
                'status' => 'pending'
            ]);

            DB::commit();

            return redirect()->route('saln')
                ->with(['title' => 'SALN', 'message' => 'You have successfully ' . ($saln ? 'updated' : 'submitted') . ' your SALN.', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            $message = $th->getMessage() . 'Failed to ' . ($saln ? 'update' : 'submit') . ' SALN.';

            return $this->returnResponse('SALN', $message, 'error');
        }
    }

    public function approveSaln(Request $request, Saln $saln)
    {
        $saln->status = 'approved';
        $saln->save();

        Notification::create([
            'user_id' => $saln->user_id,
            'type' => 'pdsupdate',
            'details' => collect([
                'link' => route('saln'),
                'name' =>  'HR',
                'avatar' => $request->user()->avatar,
                'message' => 'approved your SALN.'
            ])->toArray()
        ]);

        return $this->returnResponse('SALN Approval', 'SALN has been approved', 'success');
    }

    public function view(Saln $saln)
    {
        $saln->load(['user' => function ($query) {
            $query->withoutGlobalScopes();
        }]);

        $pages = collect([]);

        $real = collect($saln->assets['real'])->chunk(4);
        $personal = collect($saln->assets['personal'])->chunk(4);
        $children = collect($saln->children)->chunk(4);
        $liabilities = collect($saln->liabilities)->chunk(4);
        $bifc = collect($saln->biandfc['bifc'])->chunk(4);
        $relative = collect($saln->relativesingovernment['relatives'])->chunk(4);
        $spouse = collect($saln->spouse);

        $morePages = true;
        while ($morePages) {
            // get the data by chunks
            $assetReal = $this->getValue($real->splice(0, 1));
            $assetPersonal = $this->getValue($personal->splice(0, 1));
            $liability = $this->getValue($liabilities->splice(0, 1));

            $totalSaln = collect([
                "real" => !$assetReal ? 0 : $this->getTotalSaln($assetReal, 'acquisitioncost'),
                "personal" => !$assetPersonal ? 0 : $this->getTotalSaln($assetPersonal, 'acquisitioncost'),
                "liability" => !$liability ? 0 : $this->getTotalSaln($liability, 'outstandingbalances'),
                "networth" => ((!$personal ? 0 : $this->getTotalSaln($assetPersonal, 'acquisitioncost')) + (!$real ? 0 : $this->getTotalSaln($assetReal, 'acquisitioncost'))) - (!$liability ? 0 : $this->getTotalSaln($liability, 'outstandingbalances')),
            ]);

            $pages->push([
                "children" => $this->getValue($children->splice(0, 1)),
                "real" => $assetReal,
                "personal" => $assetPersonal,
                "liabilities" => $liability,
                "bifc" => collect([
                    "salnbifc" => $saln->biandfc['nobiandfc'],
                    "bifc" => $this->getValue($bifc->splice(0, 1))
                ]),
                "relatives" => collect([
                    "salnrelatives" => $saln->relativesingovernment['norelative'],
                    "relatives" => $this->getValue($relative->splice(0, 1))
                ]),
                "saln_totals" => $totalSaln
            ]);

            if (
                $real->count() === 0 &&
                $personal->count() === 0 &&
                $children->count() === 0 &&
                $liabilities->count() === 0 &&
                $bifc->count() === 0 &&
                $relative->count() === 0
            ) {
                $morePages = false;
            }
        }

        $address = $saln->user->load(['pdsPersonalInformation.addresses']);

        return Inertia::render('SALN/ViewSaln', [
            "saln" => $saln,
            "user" => $saln->user,
            "address" => $address->pdsPersonalInformation?$this->getPermanentaddress($address->pdsPersonalInformation['addresses']):null,
            "spouse" => $spouse,
            "declarannt" => $saln->user->pdsC4->where('type', 'governmentId')->first()?->details,
            "pages" => $pages
        ]);
    }

    function getValue($data)
    {
        return $data->count() > 0 ? $data[0] : null;
    }

    function getTotalSaln(Collection $data, string $attribute)
    {
        return $data->reduce(function ($carry, $item) use ($attribute) {
            if (is_numeric($item[$attribute])) {
                return $carry + $item[$attribute];
            } else {
                return $carry + 0;
            }
        }, 0);
    }

    function getPermanentaddress(Collection $data)
    {
        $address = $data->where('type', 'permanent')->first();
        $completeAddress = '';
        if ($address->street) {
            $completeAddress .= $address->street . ' ';
        } else if ($address->houselotblockno) {
            $completeAddress .= $address->houselotblockno . ' ';
        } else if ($address->subdivision) {
            $completeAddress .= $address->subdivision . ' ';
        } else if ($address->barangay) {
            $completeAddress .= $address->barangay . ' ';
        } else if ($address->citymunicipality) {
            $completeAddress .= $address->citymunicipality . ' ';
        } else if ($address->province) {
            $completeAddress .= $address->province . ' ';
        }

        return $completeAddress;
    }
}
