<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdsVoluntaryWorkRequest extends FormRequest
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
            "we.*.nameandaddress" => "required|string",
            "we.*.inlcusivedates.from" => "required|date",
            "we.*.inlcusivedates.to" => "required|date",
            "we.*.numberofhours" => "required|numeric",
            "we.*.positionornatureofwork" => "required|string",
        ];
    }

    public function attributes(): array
    {
        return [
            "we.*.nameandaddress" => "name and address",
            "we.*.inlcusivedates.from" => "'from'",
            "we.*.inlcusivedates.to" => "'to'",
            "we.*.numberofhours" => "number of hours",
            "we.*.positionornatureofwork" => "position or nature of work",
        ];
    }
}
