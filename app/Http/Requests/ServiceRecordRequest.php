<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceRecordRequest extends FormRequest
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
            'sr.*.name' => 'required|max:255',
            'sr.*.from' => 'required|date',
            'sr.*.to' => 'date|nullable',
            'sr.*.venue' => 'required|string',
            'sr.*.organizer' => 'required|string',
            'sr.*.fileid' => 'required',
        ];
    }

    public function attributes(): array
    {
        return [
            'sr.*.name' => 'certificate name',
            'sr.*.from' => 'from',
            'sr.*.to' => 'to',
            'sr.*.venue' => 'venue',
            'sr.*.organizer' => 'organizer',
            'sr.*.fileid' => 'file',
            'sr.*.session' => 'session',
        ];
    }
}
