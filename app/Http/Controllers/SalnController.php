<?php

namespace App\Http\Controllers;

use App\DateParserTrait;
use App\Models\Notification;
use App\Models\PdsPersonalInformation;
use App\Models\Saln;
use App\Models\User;
use App\ResponseTrait;
use Carbon\Carbon;
use Exception;
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
        $search = $request->query('search');

        $saln = Saln::when($role == "hr", function ($query) use ($status) {
                $query->with(['user' => function ($query) use ($status) {
                    $query->when($status !== "pending", function ($query) {
                        $query->withoutGlobalScopes();
                    });
                }]);
            })->when($role != "hr", function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->where('status', $status)
            ->when($search, function ($query) use ($search, $status) {
                $query->whereHas('user', function ($query) use ($search, $status) {
                        $query->when($status !== "pending", function ($query) {
                                $query->withoutGlobalScopes();
                            })
                            ->where('lastname', 'LIKE', "{$search}%")
                            ->orWhere('firstname', 'LIKE', "{$search}%")
                            ->orWhere('middlename', 'LIKE', "{$search}%");
                    })
                    ->orWhere('spouse->familyname', 'LIKE', "{$search}%")
                    ->orWhere('spouse->firstname', 'LIKE', "{$search}%")
                    ->orWhere('spouse->middleinitial', 'LIKE', "{$search}%")
                    ->orWhere('spouse->position', 'LIKE', "{$search}%")
                    ->orWhere('spouse->office', 'LIKE', "{$search}%")
                    ->orWhere('spouse->officeaddress', 'LIKE', "{$search}%")
                    ->orWhere('spouse->governmentissuedid', 'LIKE', "{$search}%")
                    ->orWhere('spouse->idno', 'LIKE', "{$search}%")
                    ->orWhere('spouse->dateissued', 'LIKE', "{$search}%")
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(children, '$[*].name')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].description')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].kind')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].exactlocation')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].assessedvalue')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].currentfairmarketvalue')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].acquisition.year')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].acquisition.mode')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.real[*].acquisitioncost')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.personal[*].description')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.personal[*].yearacquired')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(assets, '$.personal[*].acquisitioncost')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(children, '$[*].name')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(liabilities, '$[*].nature')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(liabilities, '$[*].nameofcreditors')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(liabilities, '$[*].outstandingbalances')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(biandfc, '$.bifc[*].name')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(biandfc, '$.bifc[*].address')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(biandfc, '$.bifc[*].nature')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(relativesingovernment, '$.relatives[*].name')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(relativesingovernment, '$.relatives[*].relationship')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(relativesingovernment, '$.relatives[*].position')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(relativesingovernment, '$.relatives[*].agencyandaddress')) LIKE ?", ["%{$search}%"]);
            })
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

        $getAddress = PdsPersonalInformation::with('addresses')->where('user_id', $request->user()->id)->first('id');

        return Inertia::render('SALN/NewSALN', [
            'address' => $getAddress ? $this->getPermanentaddress($getAddress->addresses) : "",
            'saln' => $saln,
            'spouse' => $spouse['spousename'],
            'spousegoveid' => $spouse['govid']
        ]);
    }

    public function store(Request $request, Saln $saln = null)
    {
        $request->validate([
            'assets.real.*.acquisition.year' => ['required', 'regex:/^(n\/a|\d+)$/i'],
            'assets.personal.*.yearacquired' => 'nullable|numeric',
        ], [
            'assets.real.*.acquisition.year.regex' => 'Acquisition year must be a number representation of year.',
            'assets.personal.*.yearacquired.numeric' => 'Year acquired must be a number representation of year.',
        ]);

        DB::beginTransaction();
        try {
            if(!$saln && $request->user()->saln()->whereYear('asof', Carbon::parse($request->asof)->year)->exists())
                throw new Exception('You have already submitted a SALN as of year ' . Carbon::parse($request->asof)->year .'.');

            if($request->isjoint === 'joint' && !$saln) {
                $spouse = User::where('lastname', $request->spouse['familyname'])
                    ->where('firstname', $request->spouse['firstname'])
                    ->value('id');

                $user = $request->user();
                $goveid = $user->pdsC4()->where('type', 'governmentId')?->value('details');


                if($spouse)
                    Saln::create([
                        'user_id' => $spouse,
                        'asof' => $this->parseDate($request->asof),
                        'spouse' => [
                            'familyname' => $user->lastname,
                            'firstname' => $user->firstname,
                            'middleinitial' => $user->middlename?$user->middlename[0]:'',
                            'position' => $user->position,
                            'office' => $request->spouse['office'],
                            'officeaddress' => $request->spouse['officeaddress'],
                            'governmentissuedid' => $goveid?$goveid['governmentissuedid']:'',
                            'idno' => $goveid?$goveid['licensepassportid']:'',
                            'dateissued' => $goveid?$goveid['issued']:''
                        ],
                        'children' => $request->children,
                        'assets' => $request->assets,
                        'liabilities' => $request->liabilities,
                        'biandfc' => $request->biandfc,
                        'relativesingovernment' => $request->relativesingovernment,
                        'date' => Carbon::now()->format('Y-m-d'),
                        'isjoint' => $request->isjoint,
                        'status' => 'pending'
                    ]);
            }

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
            $message = $th->getMessage();

            return $this->returnResponse('SALN', $message, 'error');
        }
    }

    public function approveSaln(Request $request, Saln $saln)
    {
        $saln->status = $request->action;
        $saln->save();

        Notification::create([
            'user_id' => $saln->user_id,
            'type' => 'pdsupdate',
            'details' => collect([
                'link' => route('saln.create', [$saln->id]),
                'name' =>  'HR',
                'avatar' => $request->user()->avatar,
                'message' => $request->action.' your SALN.'
            ])->toArray()
        ]);

        return $this->returnResponse('SALN Approval', 'SALN has been approved', 'success');
    }

    public function view(Request $request, Saln $saln)
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
        // dd($saln->user->pdsC4->where('type', 'governmentId')->first()?->details);

        if($request->user()->role === "hr") {
            return Inertia::render('Myapproval/SALN/ViewSaln', [
                "saln" => $saln,
                "user" => $saln->user,
                "address" => $address->pdsPersonalInformation?$this->getPermanentaddress($address->pdsPersonalInformation['addresses']):null,
                "spouse" => $spouse,
                "declarant" => $saln->user->pdsC4->where('type', 'governmentId')->first()?->details,
                "pages" => $pages
            ]);
        }

        return Inertia::render('SALN/ViewSaln', [
            "saln" => $saln,
            "user" => $saln->user,
            "address" => $address->pdsPersonalInformation?$this->getPermanentaddress($address->pdsPersonalInformation['addresses']):null,
            "spouse" => $spouse,
            "declarant" => $saln->user->pdsC4->where('type', 'governmentId')->first()?->details,
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
        }
        if ($address->houselotblockno) {
            $completeAddress .= $address->houselotblockno . ' ';
        }
        if ($address->subdivision) {
            $completeAddress .= $address->subdivision . ' ';
        }
        if ($address->barangay) {
            $completeAddress .= $address->barangay . ' ';
        }
        if ($address->citymunicipality) {
            $completeAddress .= $address->citymunicipality . ' ';
        }
        if ($address->province) {
            $completeAddress .= $address->province . ' ';
        }

        return $completeAddress;
    }
}
