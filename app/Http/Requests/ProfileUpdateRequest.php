<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'personal.firstname' => ['required'],
            'personal.lastname' => ['required'],
            'personal.middlename' => ['max:255'],
            'personal.extensionname' => ['nullable'],
            'personal.gender' => ['required', 'in:male,female'],
            'personal.birthday' => ['required', 'date'],
            'contact.email' => ['required', 'email', 'string', 'lowercase', 'max:255', Rule::unique(User::class, "email")->ignore($this->user()->id)],
            'contact.mobilenumber' => ['required', 'string', 'size:10'],
        ];
    }
}
