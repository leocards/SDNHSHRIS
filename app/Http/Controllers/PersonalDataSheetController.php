<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Imports\PDSImport;
use App\Models\Notification;
use App\Models\PdsCivilService;
use App\Models\PdsCs4;
use App\Models\PdsEducationalBackground;
use App\Models\PdsFamilyBackground;
use App\Models\PdsLearningDevelopment;
use App\Models\PdsOtherInformation;
use App\Models\PdsPersonalInformation;
use App\Models\PdsVoluntaryWork;
use App\Models\PdsWorkExperience;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PersonalDataSheetController extends Controller
{
    public function index(Request $request)
    {
        $role = Auth::user()->role;

        if ($role === "hr") {
            $status = $request->query('status') ?? "pending";

            $pds = PersonalDataSheet::with('user')
                ->where('status', $status)
                ->latest()
                ->paginate($this->page);

            if ($request->expectsJson()) {
                return response()->json($pds);
            }

            return Inertia::render('Myapproval/PersonalDataSheet/PersonalDataSheet', [
                'pds' => Inertia::defer(fn() => $pds)
            ]);
        }

        return Inertia::render('PDS/PersonalDataSheet', [
            'status' => PersonalDataSheet::where('user_id', Auth::id())->first()?->status,
            'personalInformation' => PdsPersonalInformation::with('addresses')->where('user_id', Auth::id())->first(),
            'familyBackground' => PdsFamilyBackground::where('user_id', Auth::id())->get(),
            'educationalBackground' => PdsEducationalBackground::where('user_id', Auth::id())->get(),
            'civilService' => PdsCivilService::where('user_id', Auth::id())->get(),
            'workExperience' => PdsWorkExperience::where('user_id', Auth::id())->get(),
            'voluntaryWork' => PdsVoluntaryWork::where('user_id', Auth::id())->get(),
            'learningAndDevelopment' => PdsLearningDevelopment::where('user_id', Auth::id())->get(),
            'otherInformation' => PdsOtherInformation::where('user_id', Auth::id())->get(),
            'c4' => PdsCs4::where('user_id', Auth::id())->get(),
        ]);
    }

    public function pds(User $user)
    {
        $pi = PdsPersonalInformation::where('user_id', $user->id)->first();

        if(!$pi)
            return response()->json('empty', 400);

        $pi->residential = $pi?->addresses->where('type', 'residential')->first();
        $pi->permanent = $pi?->addresses->where('type', 'permanent')->first();

        $education = PdsEducationalBackground::where('user_id', $user->id)
            ->get()->mapWithKeys(function ($item) {
                return [$item->type => $item->details];
            });

        $family = PdsFamilyBackground::where('user_id', $user->id)
            ->get()->mapWithKeys(function ($item) {
                if ($item->type === "child") {
                    // If `details` is empty or not set
                    if (empty($item->details)) {
                        return [
                            $item->type => array_fill(0, 12, (object) [
                                'name' => 'N/A',
                                'dateofbirth' => 'N/A'
                            ])
                        ];
                    }

                    // If the number of children is less than 12
                    if (count($item->details) < 12) {
                        $remaining = 12 - count($item->details);
                        $defaultChildren = array_fill(0, $remaining, (object) [
                            'name' => 'N/A',
                            'dateofbirth' => 'N/A'
                        ]);

                        return [
                            $item->type => array_merge($item->details, $defaultChildren)
                        ];
                    }

                    // If the number of children exceeds 12, truncate to 12
                    return [
                        $item->type => array_slice($item->details, 0, 12)
                    ];
                }

                return [$item->type => $item->details];
            });

        $civil = PdsCivilService::where('user_id', $user->id)->get();
        $work = PdsWorkExperience::where('user_id', $user->id)->get();
        $voluntary = PdsVoluntaryWork::where('user_id', $user->id)->get();
        $landd = PdsLearningDevelopment::where('user_id', $user->id)->get();
        $other = PdsOtherInformation::where('user_id', $user->id)->get()
            ->mapToGroups(function ($item) {
                // Group details by type
                return [$item->type => collect($item->details)->pluck('detail')];
            })
            ->map(function ($details) {
                // Ensure the details are flattened into arrays
                return $details->collapse()->toArray();
            });

        $result = collect(range(0, 8 - 1))->map(function ($index) use ($other) {
            return $other->mapWithKeys(function ($details, $type) use ($index) {
                return [$type => $details[$index] ?? 'N/A'];
            });
        })->take(8);

        while ($result->count() < 8) {
            $result->push($other->keys()->mapWithKeys(fn($type) => [$type => 'N/A']));
        }

        return response()->json([
            'status' => PersonalDataSheet::where('user_id', $user->id)->first()?->status,
            'user' => $user->only([
                "firstname",
                "lastname",
                "extensionname",
                "middlename",
                "birthday",
                "gender",
                "birthplace",
            ]),
            'personalInformation' => $pi,
            'familyBackground' => $family,
            'educationalBackground' => $education,
            'civilService' => $civil,
            'workExperience' => $work,
            'voluntaryWork' => $voluntary,
            'learningAndDevelopment' => $landd,
            'otherInformation' => $result->toArray(),
            'c4' => PdsCs4::where('user_id', $user->id)->get(),
        ]);
    }

    public function response(Request $request, User $user)
    {
        try {
            $pds = $user->personalDataSheet;
            $pds->status = $request->reponse;
            $pds->save();

            Notification::create([
                'user_id' => $user->id,
                'type' => 'pdsresponse',
                'details' => collect([
                    'link' => route('pds'),
                    'name' =>  'HR',
                    'avatar' => $request->user()->avatar,
                    'message' => 'has ' . $request->reponse . ' your Personal Data sheet.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Personal Data Sheet', 'message' => 'PDS of ' . $user->name . ' has been ' . $request->reponse . '!', "status" => "success"]);
        } catch (\Throwable $th) {
            return redirect()->back()->with(['title' => 'Personal Data Sheet', 'message' => 'Failed to process response!', "status" => "error"]);
        }
    }

    public function import(Request $request, User $user)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        $data = Excel::toCollection(new PDSImport, $request->file('file'));

        $path = null;

        DB::beginTransaction();
        try {

            $path = $request->file('file')->store('public/PDSfiles');

            $user->personalDataSheet()->updateOrCreate([
                "user_id" => $user->id
            ],[
                'status' => 'pending',
                "file" => $path,
                "original" => $request->file('file')->getClientOriginalName(),
            ]);

            $this->getC1Data($data["C1"], $user);
            $this->getC2Data($data["C2"], $user);
            $this->getC3Data($data["C3"], $user);
            $this->getC4Data($data["C4"], $user);

            Notification::create([
                "user_id" => $user->id,
                "type" => "pds",
                "details" => collect([
                    'link' => route('pds'),
                    'name' => "HR",
                    'avatar' => $request->user()->avatar,
                    'message' => 'has uploaded your Personal Data Sheet.',
                ])->toArray()
            ]);

            DB::commit();

            return redirect()->back()->with(['title' => 'PDS Import', 'message' => 'Successful PDS import!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return redirect()->back()->with(['title' => 'PDS Import', 'message' => $th->getMessage() . 'Failed to import PDS!', 'status' => 'error']);
        }
    }

    function getC1Data($data, User $user)
    {
        $c1 = collect([
            'personalInfo' => collect([
                'placeofbirth' => $data[0][3],
                'height' => $data[6][3],
                'weight' => $data[8][3],
                'bloodtype' => $data[9][3],
                'gsis' => $data[11][3],
                'pagibig' => $data[13][3],
                'philhealth' => $data[15][3],
                'sss' => $data[16][3],
                'tin' => $data[17][3],
                'agencyemployee' => $data[18][3],
                'residential' => collect([
                    'houselotblockno' => $this->validateAddress($data[2][8], "houselotblockno"),
                    'street' => $this->validateAddress($data[2][11], "street"),
                    'subdivision' => $this->validateAddress($data[4][8], "subdivision"),
                    'barangay' => $this->validateAddress($data[4][11], "barangay"),
                    'citymunicipality' => $this->validateAddress($data[6][8], "citymunicipality"),
                    'province' => $this->validateAddress($data[6][11], "province"),
                    'zipcode' => $data[8][8]
                ]),
                'permanent' => collect([
                    'houselotblockno' => $this->validateAddress($data[9][8], "houselotblockno"),
                    'street' => $this->validateAddress($data[9][11], "street"),
                    'subdivision' => $this->validateAddress($data[11][8], "subdivision"),
                    'barangay' => $this->validateAddress($data[11][11], "barangay"),
                    'citymunicipality' => $this->validateAddress($data[13]->only([7, 8, 9])->filter()->implode(''), "citymunicipality"),
                    'province' => $this->validateAddress($data[13]->only([10, 11, 12])->filter()->implode(''), "province"),
                    'zipcode' => $data[15][8]
                ]),
                'telephone' => $data[16][8],
                'mobile' => Str::length($data[17][8])  >= 11 ? Str::substr($data[17][8], -10) : $data[17][8],
                'email' => $data[18][8],
            ]),
            'family' => collect([
                'spouse' => collect([
                    'familyname' => $data[20][3],
                    'firstname' => $data[21][3],
                    'middlename' => $data[22][3],
                    'occupation' => $data[23][3],
                    'employerbusiness' => $data[24][3],
                    'businessaddress' => $data[25][3],
                    'telephone' => $data[26][3],
                ]),
                'father' => collect([
                    'familyname' => $data[27][3],
                    'firstname' => $data[28][3],
                    'middlename' => $data[29][3]
                ]),
                'mother' => collect([
                    'familyname' => $data[31][3],
                    'firstname' => $data[32][3],
                    'middlename' => $data[33][3]
                ]),
                'children' => $this->getChildren(($data->slice(21))->take(12))
            ]),
            'education' => $this->getEducation(collect($data->slice(37)))
        ]);

        if (!$user->pdsPersonalInformation()->exists()) {
            $pi = PdsPersonalInformation::create([
                'user_id' => $user->id,
                'placeofbirth' => $c1['personalInfo']['placeofbirth'],
                'civilstatus' => collect(["status" => null, "others" => ""])->toArray(),
                'height' => $c1['personalInfo']['height'],
                'weight' => $c1['personalInfo']['weight'],
                'bloodtype' => $c1['personalInfo']['bloodtype'],
                'gsis' => $c1['personalInfo']['gsis'],
                'pagibig' => $c1['personalInfo']['pagibig'],
                'philhealth' => $c1['personalInfo']['philhealth'],
                'sss' => $c1['personalInfo']['sss'],
                'tin' => $c1['personalInfo']['tin'],
                'agencyemployee' => $c1['personalInfo']['agencyemployee'],
                'telephone' => $c1['personalInfo']['telephone'],
                'mobile' => $c1['personalInfo']['mobile'],
                'email' => $c1['personalInfo']['email'],
                'citizenship' => collect(["citizen" => null, "dual" => collect(["by" => null, "country" => ""])->toArray()])->toArray(),
            ]);

            $pi->addresses()->create([
                'type' => "residential",
                'houselotblockno' => $c1['personalInfo']['residential']['houselotblockno'],
                'street' => $c1['personalInfo']['residential']['street'],
                'subdivision' => $c1['personalInfo']['residential']['subdivision'],
                'barangay' => $c1['personalInfo']['residential']['barangay'],
                'citymunicipality' => $c1['personalInfo']['residential']['citymunicipality'],
                'province' => $c1['personalInfo']['residential']['province'],
                'zipcode' => $c1['personalInfo']['residential']['zipcode'],
            ]);

            $pi->addresses()->create([
                'type' => 'permanent',
                'houselotblockno' => $c1['personalInfo']['permanent']['houselotblockno'],
                'street' => $c1['personalInfo']['permanent']['street'],
                'subdivision' => $c1['personalInfo']['permanent']['subdivision'],
                'barangay' => $c1['personalInfo']['permanent']['barangay'],
                'citymunicipality' => $c1['personalInfo']['permanent']['citymunicipality'],
                'province' => $c1['personalInfo']['permanent']['province'],
                'zipcode' => $c1['personalInfo']['permanent']['zipcode'],
            ]);
        }

        if (!$user->pdsFamilyBackground()->exists()) {
            PdsFamilyBackground::create([
                'user_id' => $user->id,
                'type' => 'spouse',
                'details' => collect([
                    'familyname' => $c1['family']['spouse']['familyname'] ?? '',
                    'firstname' => $c1['family']['spouse']['firstname'] ?? '',
                    'middlename' => $c1['family']['spouse']['middlename'] ?? '',
                    'extensionname' => '',
                    'occupation' => $c1['family']['spouse']['occupation'] ?? '',
                    'employerbusiness' => $c1['family']['spouse']['employerbusiness'] ?? '',
                    'businessaddress' => $c1['family']['spouse']['businessaddress'] ?? '',
                    'telephone' => $c1['family']['spouse']['telephone'] ?? ''
                ])->toArray(),
            ]);

            PdsFamilyBackground::create([
                'user_id' => $user->id,
                'type' => 'father',
                'details' => collect([
                    'familyname' => $c1['family']['father']['familyname'] ?? '',
                    'firstname' => $c1['family']['father']['firstname'] ?? '',
                    'middlename' => $c1['family']['father']['middlename'] ?? '',
                    'extensionname' => '',
                ])->toArray()
            ]);

            PdsFamilyBackground::create([
                'user_id' => $user->id,
                'type' => 'mother',
                'details' => collect([
                    'familyname' => $c1['family']['mother']['familyname'],
                    'firstname' => $c1['family']['mother']['firstname'],
                    'middlename' => $c1['family']['mother']['middlename']
                ])->toArray(),
            ]);

            PdsFamilyBackground::create([
                'user_id' => $user->id,
                'type' => 'child',
                'details' => $c1['family']['children']
            ]);
        }

        if (!$user->pdsEducationalBackground()->exists()) {
            $education = $c1['education'];
            $user->pdsEducationalBackground()->create([
                "type" => "elementary",
                "details" => $education['elementary']->toArray()
            ]);
            $user->pdsEducationalBackground()->create([
                "type" => "secondary",
                "details" => $education['secondary']->toArray()
            ]);
            $user->pdsEducationalBackground()->create([
                "type" => "senior",
                "details" => $education['senior']->toArray()
            ]);
            $user->pdsEducationalBackground()->create([
                "type" => "vocational",
                "details" => $education['vocational']->toArray()
            ]);
            $user->pdsEducationalBackground()->create([
                "type" => "college",
                "details" => $education['college']->toArray()
            ]);
            $user->pdsEducationalBackground()->create([
                "type" => "graduate",
                "details" => $education['graduate']->toArray()
            ]);
        }
    }

    function validateAddress($value, $field)
    {
        $fields = collect([
            "houselotblockno" => "House/Block/Lot No.",
            "street" => "Street",
            "subdivision" => "Subdivision/Village",
            "barangay" => "Barangay",
            "citymunicipality" => "City/Municipality",
            "province" => "Province"
        ]);

        if ($fields[$field] == $value) return null;

        return $value;
    }

    function getChildren($data): Collection
    {
        return $data->map(function ($value) {
            if ((!$value[8] && !$value[12])) return null;
            if ($value[8] == "(Continue on separate sheet if necessary)") return null;

            return collect([
                'name' => $value[8],
                'dateofbirth' => $value[12],
            ]);
        })->filter(fn($filter) => $filter);
    }

    function getEducation($data): Collection
    {
        try {
            $educationType = ['elementary' => 'elementary', 'secondary' => 'secondary', 'senior high' => 'senior', 'vocational / trade course' => 'vocational', 'college' => 'college', 'graduate studies' => 'graduate'];

            $result = collect([
                'elementary' => collect([]),
                'secondary' => collect([]),
                'senior' => collect([]),
                'vocational' => collect([]),
                'college' => collect([]),
                'graduate' => collect([]),
            ]);
            $previousLevel = null;

            foreach ($data as $value) {
                if ($value[0] == "(Continue on separate sheet if necessary)") {
                    break; // Exit the loop if the condition is true
                }

                $educlevel = ($value->only([0, 1, 2]))->filter()->implode('');
                $schoolName = ($value->only([3, 4, 5]))->filter()->implode('');

                if ($educlevel || ($schoolName && !$educlevel)) {
                    $edType = $educlevel ? $educationType[Str::lower(Str::squish($value[1]))] : $previousLevel;
                    $previousLevel = $edType;

                    $periodfrom = !is_string($value[9]) ? (!preg_match('/^\d{4}$/', $value[9]) ? Date::excelToDateTimeObject($value[9])->format('Y-m-d') : $value[9]) : $value[9];
                    $periodto = !is_string($value[10]) ? (!preg_match('/^\d{4}$/', $value[10]) ? Date::excelToDateTimeObject($value[10])->format('Y-m-d') : $value[10]) : $value[10];

                    $result[$edType]->push([
                        'nameofschool' => $schoolName,
                        'basiceddegreecourse' => ($value->only([6, 7, 8]))->filter()->implode(''),
                        'period' => [
                            'from' => $periodfrom,
                            'to' => $periodto,
                        ],
                        'highestlvl' => $value[11],
                        'yeargraduated' => $value[12] != "N/A" ? $value[12] : null,
                        'scholarshiphonor' => $value[13],
                    ]);
                }
            }

            return $result;
        } catch (\Throwable $th) {
            throw new Exception($th->getMessage());
        }
    }

    function getC2Data($data, User $user)
    {
        $cs = $this->getCS($data, $user->id);
        $we = $this->getWE(collect(($data->slice($cs['index']))->values()), $user->id);
        // dd($we);
        if (!$user->pdsCivilService()->exists())
            PdsCivilService::insert($cs['data']->toArray());

        if (!$user->pdsWorkExperience()->exists())
            PdsWorkExperience::insert($we->toArray());
    }

    function getCS($data, $userId)
    {
        $result = collect();
        $lastIndex = 0;
        foreach ($data as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                $lastIndex = $key;
                break;
            }

            if ($value->only([0, 5, 6, 8, 11, 12])->filter()->implode('') !== " ") {
                $result->push(collect([
                    'user_id' => $userId,
                    'careerservice' => $value[0],
                    'rating' => $value[5],
                    'examination' => !is_string($value[6]) ? (!preg_match('/^\d{4}$/', $value[6]) ? Date::excelToDateTimeObject($value[6])->format('Y-m-d') : $value[6]) : null,
                    'placeexamination' => $value[8],
                    'licensenumber' => $value[11],
                    'validity' => $value[12],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));
            }
        }

        return collect([
            'data' => $result,
            'index' => ($lastIndex + 1)
        ]);
    }

    function getWE($data, $userId)
    {
        $result = collect();
        foreach ($data as $key => $value) {
            if ($key >= 4) {
                if ($value[0] == "(Continue on separate sheet if necessary)") break;

                $dateFrom = !is_string($value[0]) ? (!preg_match('/^\d{4}$/', $value[0]) ? Date::excelToDateTimeObject($value[0])->format('Y-m-d') : $value[0]) : $value[0];
                $dateTo = !is_string($value[2]) ? (!preg_match('/^\d{4}$/', $value[2]) ? Date::excelToDateTimeObject($value[2])->format('Y-m-d') : $value[2]) : $value[2];

                $result->push(collect([
                    'user_id' => $userId,
                    'inlcusivedates' => collect([
                        'from' => $dateFrom,
                        'to' => $dateTo,
                    ])->toJson(),
                    'positiontitle' => $value[3],
                    'department' => $value[6],
                    'monthlysalary' => !Str::contains(Str::squish($value[9]), ',') ? number_format((int) Str::replace(' ', '', Str::squish($value[9]))) : Str::replace(' ', '', Str::squish($value[9])),
                    'salarygrade' => $value[10],
                    'statusofappointment' => $value[11],
                    'isgovernment' => $value[12] == "Y" ? 'y' : 'n',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));
            }
        }

        return $result;
    }

    function getC3Data($data, User $user)
    {
        $c3Data = $data;
        $result = collect([
            'voluntary' => collect(),
            'landd' => collect(),
        ]);
        $lastIndex = 0;

        foreach ($c3Data as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                if ($c3Data[$key + 2][0] == "(Start from the most recent L&D/training program and include only the relevant L&D/training taken for the last five (5) years for Division Chief/Executive/Managerial positions)") {
                    $lastIndex = $key + 1;
                } else {
                    $lastIndex = $key;
                }
                break;
            }

            $result['voluntary']->push(collect([
                'user_id' => $user->id,
                'organization' => $value[0],
                'inclusivedates' => collect([
                    'from' => !is_string($value[4]) ? ((!preg_match('/^\d{4}$/', $value[4]) && !empty($value[4])) ? Date::excelToDateTimeObject($value[4])->format('Y-m-d') : $value[4]) : $value[4],
                    'to' => !is_string($value[5]) ? ((!preg_match('/^\d{4}$/', $value[5]) && !empty($value[5])) ? Date::excelToDateTimeObject($value[5])->format('Y-m-d') : $value[5]) : $value[5],
                ])->toJson(),
                'numberofhours' => $value[6],
                'position' => $value[7],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        foreach ($c3Data->slice($lastIndex + 4) as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                $lastIndex = $key;
                break;
            }

            $result['landd']->push(collect([
                'user_id' => $user->id,
                'title' => $value->only([0, 1, 2, 3])->filter()->implode('') == 'N/A' ? null : ($value->only([0, 1, 2, 3]))->filter()->implode(''),
                'inclusivedates' => collect([
                    'from' => !is_string($value[4]) ? ((!preg_match('/^\d{4}$/', $value[4]) && !empty($value[4])) ? Date::excelToDateTimeObject($value[4])->format('Y-m-d') : $value[4]) : $value[4],
                    'to' => !is_string($value[5]) ? ((!preg_match('/^\d{4}$/', $value[5]) && !empty($value[5])) ? Date::excelToDateTimeObject($value[5])->format('Y-m-d') : $value[5]) : $value[5],
                ])->toJson(),
                'numofhours' => $value[6],
                'type' => $value[7],
                'conductedby' => $value->only([8, 9, 10])->filter()->implode(''),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        $oi = collect([
            "skills" => collect(["user_id" => $user->id, "type" => "skills",  "details" => collect([])]),
            "recognition" => collect(["user_id" => $user->id, "type" => "recognition",  "details" => collect([])]),
            "association" => collect(["user_id" => $user->id, "type" => "association",  "details" => collect([])])
        ]);

        foreach ((($c3Data->slice($lastIndex + 3))->values()) as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)")
                break;

            if ($value[0] && $value[0] != 'N/A')
                $oi['skills']['details']->push(collect(['detail' => $value[0]]));

            if ($value[2] && $value[2] != 'N/A')
                $oi['recognition']['details']->push(collect(['detail' => $value[2]]));

            if ($value[8] && $value[8] != 'N/A')
                $oi['association']['details']->push(collect(['detail' => $value[8]]));
        }

        PdsVoluntaryWork::insert($result['voluntary']->toArray());
        PdsLearningDevelopment::insert($result['landd']->toArray());
        PdsOtherInformation::create([
            'user_id' => $oi['skills']['user_id'],
            'type' => $oi['skills']['type'],
            'details' => $oi['skills']['details']->toArray(),
        ]);

        PdsOtherInformation::create([
            'user_id' => $oi['recognition']['user_id'],
            'type' => $oi['recognition']['type'],
            'details' => $oi['recognition']['details']->toArray(),
        ]);

        PdsOtherInformation::create([
            'user_id' => $oi['association']['user_id'],
            'type' => $oi['association']['type'],
            'details' => $oi['association']['details']->toArray(),
        ]);
    }

    function getC4Data($data, User $user)
    {
        $c4 = collect([
            "34b" => $data[0]->only([6, 7, 8])->filter()->implode(''),
            "35a" => $data[4]->only([6, 7, 8])->filter()->implode(''),
            "35b" => collect([
                'date' => $data[9]->only([10, 11])->filter()->implode(''),
                'status' => $data[10]->only([10, 11])->filter()->implode(' '),
            ]),
            "36" => $data[14]->only([6, 7, 8])->filter()->implode(''),
            "37" => $data[18]->only([6, 7, 8])->filter()->implode(''),
            "38a" => $data[21][10],
            "38b" => $data[24][10],
            "39" => $data[28]->only([6, 7, 8])->filter()->implode(''),
            "40a" => $data[33]->only([10, 11])->filter()->implode(''),
            "40b" => $data[35][11],
            "40c" => $data[37][11],
            "41" => collect([
                collect([
                    "name" => $data[41]->only([0, 1, 2, 3, 4])->filter()->implode(''),
                    "address" => $data[41][5],
                    "telno" => $data[41]->only([6, 7, 8])->filter()->implode(''),
                ])->toArray(),
                collect([
                    "name" => $data[42]->only([0, 1, 2, 3, 4])->filter()->implode(''),
                    "address" => $data[42][5],
                    "telno" => $data[42]->only([6, 7, 8])->filter()->implode(''),
                ])->toArray(),
                collect([
                    "name" => $data[43]->only([0, 1, 2, 3, 4])->filter()->implode(''),
                    "address" => $data[43][5],
                    "telno" => $data[43]->only([6, 7, 8])->filter()->implode(''),
                ])->toArray()
            ]),
            "governmentId" => $data[50][3],
            "idNo" => $data[51][3],
            "issuance" => $data[53][3],
        ]);

        $user->pdsC4()->create([
            'type' => '34',
            'details' => collect([
                "choicea" => collect([
                    "choices" => null
                ])->toArray(),
                "choiceb" => collect([
                    "choices" => $c4['34b'] ? 'y' : 'n',
                    "details" => $c4['34b'] == " " ? "" : $c4['34b'],
                ])->toArray(),
            ])->toArray()
        ]);
        $user->pdsC4()->create([
            'type' => '35',
            'details' => collect([
                "choicea" => collect([
                    "choices" => $c4['35a'] ? 'y' : 'n',
                    "details" => $c4['35a'] == " " ? "" : $c4['35a'],
                ])->toArray(),
                "choiceb" => collect([
                    "choices" => $c4['35b']['date'] ? 'y' : 'n',
                    "datefiled" => $c4['35b']['date'] ? Carbon::parse($c4['35b']['date'])->format('Y-m-d') : null,
                    "statusofcase" => $c4['35b']['status'],
                ])->toArray(),
            ])->toArray()
        ]);
        $user->pdsC4()->create([
            'type' => '36',
            'details' => collect([
                "choices" => $c4['36'] ? 'y' : 'n',
                "details" => $c4['36'] == " " ? "" : $c4['36']
            ])->toArray()
        ]);
        $user->pdsC4()->create([
            'type' => '37',
            'details' => collect([
                "choices" => $c4['37'] ? 'y' : 'n',
                "details" => $c4['37'] == " " ? "" : $c4['37']
            ])->toArray()
        ]);
        $user->pdsC4()->create([
            'type' => '38',
            'details' => collect([
                "choicea" => collect([
                    "choices" => $c4['38a'] ? 'y' : 'n',
                    "details" => $c4['38a'] == " " ? "" : $c4['38a']
                ])->toArray(),
                "choiceb" => collect([
                    "choices" => $c4['38b'] ? 'y' : 'n',
                    "details" => $c4['38b'] == " " ? "" : $c4['38b'],
                ])->toArray(),
            ])->toArray()
        ]);
        $user->pdsC4()->create([
            'type' => '39',
            'details' => collect([
                "choices" => $c4['39'] ? 'y' : 'n',
                "details" => $c4['39'] == " " ? "" : $c4['39']
            ])->toArray()
        ]);
        $user->pdsC4()->create([
            'type' => '40',
            'details' => collect([
                "choicea" => collect([
                    "choices" => $c4['40a'] ? 'y' : 'n',
                    "details" => $c4['40a'] == " " ? "" : $c4['40a']
                ])->toArray(),
                "choiceb" => collect([
                    "choices" => $c4['40b'] ? 'y' : 'n',
                    "details" => $c4['40b'] == " " ? "" : $c4['40b'],
                ])->toArray(),
                "choicec" => collect([
                    "choices" => $c4['40c'] ? 'y' : 'n',
                    "details" => $c4['40c'] == " " ? "" : $c4['40c'],
                ])->toArray(),
            ])->toArray()
        ]);

        $user->pdsC4()->create([
            'type' => '41',
            'details' => $c4['41']->toArray()
        ]);

        $user->pdsC4()->create([
            'type' => 'governmentId',
            'details' => collect([
                'governmentissuedid' => $c4['governmentId'],
                'licensepassportid' => $c4['idNo'],
                'issued' => $c4['issuance'],
            ])->toArray()
        ]);
    }
}
