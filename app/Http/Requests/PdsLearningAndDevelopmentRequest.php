<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdsLearningAndDevelopmentRequest extends FormRequest
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
            'ld.*.title' => "required",
            'ld.*.inclusivedates.from' => "required|date",
            'ld.*.inclusivedates.to' => "required|date",
            'ld.*.numberofhours' => "required|numeric",
            'ld.*.typeofld' => "required",
            'ld.*.conductedsponsoredby' => "required",
        ];
    }

    public function attributes(): array
    {
        return [
            'ld.*.title' => "title",
            'ld.*.inclusivedates.from' => "'from'",
            'ld.*.inclusivedates.to' => "'to'",
            'ld.*.numberofhours' => "number of hours",
            'ld.*.typeofld' => "type of LD",
            'ld.*.conductedsponsoredby' => "conducted/sponsored by",
        ];
    }
}
