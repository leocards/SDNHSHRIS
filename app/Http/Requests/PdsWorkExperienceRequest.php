<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdsWorkExperienceRequest extends FormRequest
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
            "we.*.inclusivedates.from" => "required|date",
            "we.*.inclusivedates.to" => "required",
            "we.*.positiontitle" => "required",
            "we.*.department" => "required",
            "we.*.monthlysalary" => "required",
            "we.*.salarygrade" => "required",
            "we.*.statusofappointment" => "required",
            "we.*.isgovernment" => "required|in:y,n",
        ];
    }

    public function attributes(): array
    {
        return [
            "we.*.inclusivedates.from" => "'from'",
            "we.*.inclusivedates.to" => "'to'",
            "we.*.positiontitle" => "Position Title",
            "we.*.department" => "Department/Agency/Office/Company",
            "we.*.monthlysalary" => "Salary/Job/Pay Grade",
            "we.*.salarygrade" => "Monthly salary",
            "we.*.statusofappointment" => "Status of Appointment",
            "we.*.isgovernment" => "Gov't service",
        ];
    }
}
