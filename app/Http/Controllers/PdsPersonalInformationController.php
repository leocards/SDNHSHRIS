<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PdsAddress;
use App\Models\PersonalDataSheet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PdsPersonalInformationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'placeofbirth' => 'required|string|max:1000',
            'civilstatus' => 'required',
            'height' => 'required|numeric',
            'weight' => 'required|numeric',
            'bloodtype' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'gsis' => 'required|string',
            'pagibig' => 'required|string',
            'philhealth' => 'required|string',
            'sss' => 'required|string',
            'tin' => 'required|string',
            'agencyemployee' => 'required|string',
            'telephone' => 'required|string',
            'mobile' => 'required|numeric|digits:10',
            'email' => 'required|email',
            'citizenship' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $user = $request->user();
            $user->firstname = $request->firstname;
            $user->middlename = $request->middlename;
            $user->lastname = $request->lastname;
            $user->extensionname = $request->extensionname;
            $user->save();

            $pdspi = $user->pdsPersonalInformation()->create($request->all());

            $pdspi->addresses()->create([
                'type' => 'residential',
                'same' => false,
                'houselotblockno' => $request->residentialaddress['houselotblockno'],
                'street' => $request->residentialaddress['street'],
                'subdivision' => $request->residentialaddress['subdivision'],
                'barangay' => $request->residentialaddress['barangay'],
                'citymunicipality' => $request->residentialaddress['citymunicipality'],
                'province' => $request->residentialaddress['province'],
                'zipcode' => $request->residentialaddress['zipcode'],
            ]);

            $pdspi->addresses()->create([
                'type' => 'permanent',
                'same' => $request->permanentaddress['isSameResidential'],
                'houselotblockno' => $request->permanentaddress['houselotblockno'],
                'street' => $request->permanentaddress['street'],
                'subdivision' => $request->permanentaddress['subdivision'],
                'barangay' => $request->permanentaddress['barangay'],
                'citymunicipality' => $request->permanentaddress['citymunicipality'],
                'province' => $request->permanentaddress['province'],
                'zipcode' => $request->permanentaddress['zipcode'],
            ]);

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
                    'message' => 'updated '.$pronoun.' PDS personal information.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Personal Information', 'message' => 'Personal Information Added!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with(['title' => 'Personal Information', 'message' => 'Failed to add Personal Information!', 'status' => 'error']);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'placeofbirth' => 'required|string|max:1000',
            'civilstatus' => 'required',
            'height' => 'required|numeric',
            'weight' => 'required|numeric',
            'bloodtype' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'gsis' => 'required|string',
            'pagibig' => 'required|string',
            'philhealth' => 'required|string',
            'sss' => 'required|string',
            'tin' => 'required|string',
            'agencyemployee' => 'required|string',
            'telephone' => 'required|string',
            'mobile' => 'required|numeric|digits:10',
            'email' => 'required|email',
            'citizenship' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $user = $request->user();
            $user->firstname = $request->firstname;
            $user->middlename = $request->middlename;
            $user->lastname = $request->lastname;
            $user->extensionname = $request->extensionname;
            $user->save();

            $user->pdsPersonalInformation()->update($request->except([
                'firstname', 'middlename', 'lastname', 'extensionname', 'residentialaddress', 'permanentaddress', 'dateofbirth', 'gender'
            ]));

            PdsAddress::where('pdspi_id', $request->residentialaddress['pdspi_id'])->where('type', 'residential')->update([
                'type' => 'residential',
                'same' => false,
                'houselotblockno' => $request->residentialaddress['houselotblockno'],
                'street' => $request->residentialaddress['street'],
                'subdivision' => $request->residentialaddress['subdivision'],
                'barangay' => $request->residentialaddress['barangay'],
                'citymunicipality' => $request->residentialaddress['citymunicipality'],
                'province' => $request->residentialaddress['province'],
                'zipcode' => $request->residentialaddress['zipcode'],
            ]);

            PdsAddress::where('pdspi_id', $request->permanentaddress['pdspi_id'])->where('type', 'permanent')->update([
                'type' => 'permanent',
                'same' => $request->permanentaddress['isSameResidential'],
                'houselotblockno' => $request->permanentaddress['houselotblockno'],
                'street' => $request->permanentaddress['street'],
                'subdivision' => $request->permanentaddress['subdivision'],
                'barangay' => $request->permanentaddress['barangay'],
                'citymunicipality' => $request->permanentaddress['citymunicipality'],
                'province' => $request->permanentaddress['province'],
                'zipcode' => $request->permanentaddress['zipcode'],
            ]);

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
                    'message' => 'updated '.$pronoun.' PDS personal information.'
                ])->toArray()
            ]);

            return redirect()->back()->with(['title' => 'Personal Information', 'message' => 'Personal Information Updated!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with(['title' => 'Personal Information', 'message' => 'Failed to update Personal Information!', 'status' => 'error']);
        }
    }
}
