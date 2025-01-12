<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdsCivilServiceRequest extends FormRequest
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
            "cs.*.eligibility" => "required",
            "cs.*.dateofexaminationconferment" => "required|date",
            "cs.*.placeofexaminationconferment" => "required",
            "cs.*.license.dateofvalidity" => "nullable|date",
        ];
    }

    public function attributes(): array
    {
        return [
            "cs.*.eligibility" => "Career Service",
            "cs.*.dateofexaminationconferment" => "Date of Examination",
            "cs.*.placeofexaminationconferment" => "Place of Examination",
            "cs.*.license.dateofvalidity" => "Date of Validity",
        ];
    }
}
