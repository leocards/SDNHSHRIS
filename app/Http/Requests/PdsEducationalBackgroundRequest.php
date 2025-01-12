<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdsEducationalBackgroundRequest extends FormRequest
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
            "elementary.*.nameofschool" => "required",
            "elementary.*.basiceddegreecourse" => "required",
            "elementary.*.period.from" => "required",
            "elementary.*.period.to" => "required",
            "elementary.*.highestlvl" => "required",
            "elementary.*.yeargraduated" => ["required", "regex:/^(N\/A|\d+)$/"],
            "elementary.*.scholarshiphonor" => "required",
            "secondary.*.nameofschool" => "required",
            "secondary.*.basiceddegreecourse" => "required",
            "secondary.*.period.from" => "required",
            "secondary.*.period.to" => "required",
            "secondary.*.highestlvl" => "required",
            "secondary.*.yeargraduated" => ["required", "regex:/^(N\/A|\d+)$/"],
            "secondary.*.scholarshiphonor" => "required",
            "senior.*.nameofschool" => "required",
            "senior.*.basiceddegreecourse" => "required",
            "senior.*.period.from" => "required",
            "senior.*.period.to" => "required",
            "senior.*.highestlvl" => "required",
            "senior.*.yeargraduated" => ["required", "regex:/^(N\/A|\d+)$/"],
            "senior.*.scholarshiphonor" => "required",
            "vocational.*.nameofschool" => "required",
            "vocational.*.basiceddegreecourse" => "required",
            "vocational.*.period.from" => "required",
            "vocational.*.period.to" => "required",
            "vocational.*.highestlvl" => "required",
            "vocational.*.yeargraduated" => ["required", "regex:/^(N\/A|\d+)$/"],
            "vocational.*.scholarshiphonor" => "required",
            "college.*.nameofschool" => "required",
            "college.*.basiceddegreecourse" => "required",
            "college.*.period.from" => "required",
            "college.*.period.to" => "required",
            "college.*.highestlvl" => "required",
            "college.*.yeargraduated" => ["required", "regex:/^(N\/A|\d+)$/"],
            "college.*.scholarshiphonor" => "required",
            "graduatestudies.*.nameofschool" => "required",
            "graduatestudies.*.basiceddegreecourse" => "required",
            "graduatestudies.*.period.from" => "required",
            "graduatestudies.*.period.to" => "required",
            "graduatestudies.*.highestlvl" => "required",
            "graduatestudies.*.yeargraduated" => ["required", "regex:/^(N\/A|\d+)$/"],
            "graduatestudies.*.scholarshiphonor" => "required",
        ];
    }

    public function attributes(): array
    {
        return [
            "elementary.*.nameofschool" => "name of school",
            "elementary.*.basiceddegreecourse" => "basic education/degree/course",
            "elementary.*.period.from" => "'from'",
            "elementary.*.period.to" => "'to'",
            "elementary.*.highestlvl" => "highest level/units earned",
            "elementary.*.yeargraduated" => "year graduated",
            "elementary.*.scholarshiphonor" => "scholarship/academic honor received",
            "secondary.*.nameofschool" => "name of school",
            "secondary.*.basiceddegreecourse" => "basic education/degree/course",
            "secondary.*.period.from" => "'from'",
            "secondary.*.period.to" => "'to'",
            "secondary.*.highestlvl" => "highest level/units earned",
            "secondary.*.yeargraduated" => "year graduated",
            "secondary.*.scholarshiphonor" => "scholarship/academic honor received",
            "senior.*.nameofschool" => "name of school",
            "senior.*.basiceddegreecourse" => "basic education/degree/course",
            "senior.*.period.from" => "'from'",
            "senior.*.period.to" => "'to'",
            "senior.*.highestlvl" => "highest level/units earned",
            "senior.*.yeargraduated" => "year graduated",
            "senior.*.scholarshiphonor" => "scholarship/academic honor received",
            "vocational.*.nameofschool" => "name of school",
            "vocational.*.basiceddegreecourse" => "basic education/degree/course",
            "vocational.*.period.from" => "'from'",
            "vocational.*.period.to" => "'to'",
            "vocational.*.highestlvl" => "highest level/units earned",
            "vocational.*.yeargraduated" => "year graduated",
            "vocational.*.scholarshiphonor" => "scholarship/academic honor received",
            "college.*.nameofschool" => "name of school",
            "college.*.basiceddegreecourse" => "basic education/degree/course",
            "college.*.period.from" => "'from'",
            "college.*.period.to" => "'to'",
            "college.*.highestlvl" => "highest level/units earned",
            "college.*.yeargraduated" => "year graduated",
            "college.*.scholarshiphonor" => "scholarship/academic honor received",
            "graduatestudies.*.nameofschool" => "name of school",
            "graduatestudies.*.basiceddegreecourse" => "basic education/degree/course",
            "graduatestudies.*.period.from" => "'from'",
            "graduatestudies.*.period.to" => "'to'",
            "graduatestudies.*.highestlvl" => "highest level/units earned",
            "graduatestudies.*.yeargraduated" => "year graduated",
            "graduatestudies.*.scholarshiphonor" => "scholarship/academic honor received",
        ];
    }

    public function messages()
    {
        return [
            "elementary.*.yeargraduated.regex" => "The year graduated must be a number or an 'N/A'.",
            "secondary.*.yeargraduated.regex" => "The year graduated must be a number or an 'N/A'.",
            "senior.*.yeargraduated.regex" => "The year graduated must be a number or an 'N/A'.",
            "vocational.*.yeargraduated.regex" => "The year graduated must be a number or an 'N/A'.",
            "college.*.yeargraduated.regex" => "The year graduated must be a number or an 'N/A'.",
            "graduatestudies.*.yeargraduated.regex" => "The year graduated must be a number or an 'N/A'.",
        ];
    }
}
