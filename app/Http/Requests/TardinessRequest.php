<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class TardinessRequest extends FormRequest
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
            'attendances.*.user.name' => ['required', 'string'],
            'attendances.*.present' => ['required', 'numeric', 'regex:/^(0|[1-9]\d*)(\.\d+)?$/'],
            'attendances.*.absent' => ['required', 'numeric', 'regex:/^(0|[1-9]\d*)(\.\d+)?$/'],
            'attendances.*.timetardy' => ['required', 'numeric', 'regex:/^(0|[1-9]\d*)(\.\d+)?$/'],
            'attendances.*.undertime' => ['required', 'numeric', 'regex:/^(0|[1-9]\d*)(\.\d+)?$/'],
            'sy' => ['required'],
            'month' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'attendances.*.user.name.required' => "Personnel field is required.",
            'attendances.*.present.required' => "No. of days present field is required.",
            'attendances.*.present.numeric' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.present.regex' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.absent.required' => "No. of days absent field is required.",
            'attendances.*.absent.numeric' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.absent.regex' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.absent.required' => "No. of time tardy field is required.",
            'attendances.*.timetardy.numeric' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.timetardy.regex' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.absent.required' => "No. of undertime field is required.",
            'attendances.*.undertime.numeric' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",
            'attendances.*.undertime.regex' => "Please provide a valid value. Ex. 20, 18.5, or 0 etc.",

            'sy.required' => "School Year field is required.",
            'month.required' => "Month field is required.",
        ];
    }
}
