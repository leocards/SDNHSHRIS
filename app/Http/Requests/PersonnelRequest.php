<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class PersonnelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role === 'hr';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'personal.firstname' => ['required', 'max:255'],
            'personal.lastname' => ['required', 'max:255'],
            'personal.middlename' => ['max:255'],
            'personal.extensionname' => ['nullable'],
            'personal.gender' => ['required', 'in:male,female'],
            'personal.birthday' => ['required', 'date'],
            'contact.email' => ['required', 'email', 'string', 'lowercase', 'max:255', 'ends_with:@deped.gov.ph', Rule::unique(User::class, "email")->ignore($this->route('personnelid'))],
            'contact.mobilenumber' => ['required', 'string', 'size:10'],
            'personnel.personnelid' => ['required', 'string', Rule::unique(User::class, 'personnelid')->ignore($this->route('personnelid'))],
            'personnel.datehired' => ['required', 'date'],
            'personnel.role' => ['required', 'in:hr,principal,teaching,non-teaching'],
            'personnel.department' => ['required', 'in:junior,senior,accounting,N/A,deped'],
            'personnel.position' => ['required', 'string', Rule::in([
                "Teacher I",
                "Teacher II",
                "Teacher III",
                "Teacher IV",
                "Master Teacher I",
                "Master Teacher II",
                "Master Teacher III",
                "ADAS I",
                "ADAS II",
                "ADAS III",
                "Principal I",
                "Principal II",
                "Principal III",
                "Principal IV",
                "Principal V",
                "HR",
                "N/A"
            ])],
        ];
    }

    public function messages(): array
    {
        return [
            'contact.email.ends_with' => 'The email must be from deped.gov.ph',
        ];
    }

    public function attributes(): array
    {
        return [
            'personal.firstname' => 'first name',
            'personal.lastname' => 'last name',
            'personal.middlename' => 'middle name',
            'personal.extensionname' => 'extension name',
            'personal.gender' => 'gender',
            'personal.birthday' => 'birthday',
            'contact.email' => 'email',
            'contact.mobilenumber' => 'mobilenumber',
            'personnel.personnelid' => 'DepEd Employee No.',
            'personnel.datehired' => 'date hired',
            'personnel.role' => 'role',
            'personnel.department' => 'department',
            'personnel.position' => 'position',
        ];
    }

    protected function failedAuthorization()
    {
        throw new \Illuminate\Auth\Access\AuthorizationException('You are not authorized to perform this action.');
    }
}
