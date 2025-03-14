<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class GeneralSearchController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $result = User::when($search, function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('firstname', 'LIKE', "{$search}%")
                    ->orWhere('email', 'LIKE', "{$search}%")
                    ->orWhere('lastname', 'LIKE', "{$search}%")
                    ->orWhere('extensionname', 'LIKE', "{$search}%")
                    ->orWhere('middlename', 'LIKE', "{$search}%")
                    ->orWhere('mobilenumber', 'LIKE', "{$search}%");
            })->orWhereHas('serviceRecord', function ($query) use ($search) {
                $query->where('details->name', 'LIKE', "{$search}%");
            })->orWhereHas('pdsPersonalInformation', function ($query) use ($search) {
                $query->where('email', 'LIKE', "{$search}%")
                    ->orWhere('bloodtype', 'LIKE', "{$search}%")
                    ->orWhere('gsis', 'LIKE', "{$search}%")
                    ->orWhere('pagibig', 'LIKE', "{$search}%")
                    ->orWhere('philhealth', 'LIKE', "{$search}%")
                    ->orWhere('sss', 'LIKE', "{$search}%")
                    ->orWhere('tin', 'LIKE', "{$search}%")
                    ->orWhere('agencyemployee', 'LIKE', "{$search}%")
                    ->orWhere('telephone', 'LIKE', "{$search}%")
                    ->orWhere('mobile', 'LIKE', "{$search}%");
            })->orWhereHas('pdsFamilyBackground', function ($query) use ($search) {
                $query->where('details->familyname', 'LIKE', "{$search}%")
                    ->orWhere('details->firstname', 'LIKE', "{$search}%")
                    ->orWhere('details->extensinname', 'LIKE', "{$search}%")
                    ->orWhere('details->occupation', 'LIKE', "{$search}%")
                    ->orWhere('details->employerbusiness', 'LIKE', "{$search}%")
                    ->orWhere('details->businessaddress', 'LIKE', "{$search}%")
                    ->orWhere('details->telephone', 'LIKE', "{$search}%")
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(details, '$[*].name')) LIKE ?", ["%{$search}%"]);
            })
            ->orWhereHas('pdsPersonalInformation.addresses', function ($query) use ($search) {
                $query->where('houselotblockno', 'LIKE', "{$search}%")
                    ->orWhere('street', 'LIKE', "{$search}%")
                    ->orWhere('subdivision', 'LIKE', "{$search}%")
                    ->orWhere('barangay', 'LIKE', "{$search}%")
                    ->orWhere('citymunicipality', 'LIKE', "{$search}%")
                    ->orWhere('province', 'LIKE', "{$search}%")
                    ->orWhere('zipcode', 'LIKE', "{$search}%");
            })
            ->orWhereHas('pdsEducationalBackground', function ($query) use ($search) {
                $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(details, '$[*].nameofschool')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(details, '$[*].basiceddegreecourse')) LIKE ?", ["%{$search}%"]);
            })->orWhereHas('pdsCivilService', function ($query) use ($search) {
                $query->where('careerservice', 'LIKE', "{$search}%")
                    ->orWhere('licensenumber', 'LIKE', "{$search}%")
                    ->orWhere('placeexamination', 'LIKE', "{$search}%");
            })
                ->orWhereHas('pdsWorkExperience', function ($query) use ($search) {
                    $query->where('positiontitle', 'LIKE', "{$search}%")
                        ->orWhere('department', 'LIKE', "{$search}%")
                        ->orWhere('statusofappointment', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsVoluntaryWork', function ($query) use ($search) {
                    $query->where('organization', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsLearningAndDevelopment', function ($query) use ($search) {
                    $query->where('title', 'LIKE', "{$search}%")
                        ->orWhere('type', 'LIKE', "{$search}%")
                        ->orWhere('conductedby', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsOtherInformation', function ($query) use ($search) {
                    $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(details, '$[*].detail')) LIKE ?", ["%{$search}%"]);
                })->orWhereHas('pdsC4', function ($query) use ($search) {
                    $query->where('details->governmentissuedid', 'LIKE', "{$search}%")
                        ->orWhere('details->licensepassportid', 'LIKE', "{$search}%")
                        ->orWhere('details->issued', 'LIKE', "{$search}%");
                });
        })
        ->select(['id', 'firstname', 'middlename', 'lastname', 'position', 'department', 'credits', 'role'])
        ->withSum(['serviceRecord as sr' => function ($query) {
            $query->where('status', 'approved')->where('details->creditstatus', 'pending');
        }], 'details->remainingcredits')
        ->excludeHr()
        ->orderBy("lastname", "asc")
        ->paginate($this->page);

        if($request->expectsJson())
            return response()->json($result);

        return Inertia::render('GeneralSearch/GeneralSearch', [
            "user" => Inertia::defer(fn() => $result)
        ]);
    }

    public function view(User $user)
    {
        $user->load(['pdsPersonalInformation.addresses']);
        $user['mailingaddress'] = $user->pdsPersonalInformation ? $this->getPermanentaddress($user->pdsPersonalInformation->addresses) : null;

        return Inertia::render('GeneralSearch/ViewSearched', [
            "user" => $user,
            "attendances" => $user->tardiness()->with('schoolyear')->get(),
            "certificates" => $user->serviceRecord()->where('status', 'approved')->get(),
            "leavecount" => $user->leave()->where('hrstatus', 'approved')->where('principalstatus', 'approved')->count()
        ]);
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
