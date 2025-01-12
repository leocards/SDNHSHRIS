<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'filingfrom' => ['required', 'date'],
            'filingto' => ['required', 'nullable', 'date'],
            'salary' => ['required', 'numeric'],
            'type' => ['required', 'in:vacation,mandatory,sick,maternity,paternity,spl,solo,study,vowc,rehabilitation,slbw,emergency,adoption,others'],
            'others' => ['required_if:type,others'],
            'details' => ['required'],
            'detailsinput' => [
                function ($attribute, $value, $fail) {
                    $detailsConditions = ['vphilippines', 'vabroad', 'shospital', 'spatient'];
                    $typeConditions = ['slbw'];

                    if (
                        (in_array(request('details'), $detailsConditions) || in_array(request('type'), $typeConditions)) &&
                        empty($value)
                    ) {
                        $fail("The $attribute field is required.");
                    }
                }
            ],
            'from' => ['required', 'date'],
            'to' => ['required', 'nullable', 'date'],
            'commutation' => ['required'],
            'medical' => ['required_if:type,maternity']
        ];
    }

    public function attributes(): array
    {
        return [
            'filingfrom' => 'date of filing from',
            'filingto' => 'date of filing to',
            'type' => 'type of leave',
            'details' => 'details of leave',
            'detailsinput' => 'details',
        ];
    }
}
