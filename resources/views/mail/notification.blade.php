@if($type === "leave")
<x-mail::message>
@if ($data['status'] === "disapproved")
Dear {{ $data['name'] }},

We regret to inform you that your application for leave has been disapproved.

{{ $data['message'] }}

Thank you for your understanding and cooperation.

<br>
Best regards,
<br>
@else
Your application for leave has been approved
@endif

<br>
{{ $data['sender']['name'] }}<br>
{{ $data['sender']['position'] }}<br>

<hr>
Via SDNHS HRIS
</x-mail::message>
@endif

@if ($type === "newaccount")
<x-mail::message>
Welcome, {{ $data['name'] }}!

Your email is now registered on our platform. We're excited to have you!
If you have any questions, feel free to reach out.

Account credentials: <br>
Email: {{$data['email']}} <br>
Password: 12345678

{{$data['login']}}

Best regards,
The SDNHS-HRIS Team
</x-mail::message>
@endif

@if ($type === "medical")
<x-mail::message>

medical

</x-mail::message>
@endif

@if ($type === "updateprofile")
<x-mail::message>

new account

{{ config('app.name') }}
</x-mail::message>
@endif

@if ($type === "message")
<x-mail::message>

{{ $data['user'] }}
{{ $data['time'] }}

{{ $data['message'] }}

{{ config('app.name') }}
</x-mail::message>
@endif

@if ($type === "announcement")
<x-mail::message>

new account

{{ config('app.name') }}
</x-mail::message>
@endif
