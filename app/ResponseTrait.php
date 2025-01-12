<?php

namespace App;

trait ResponseTrait
{
    public function returnResponse(string $title, string $message, string $status)
    {
        return redirect()->back()->with(['title' => $title, 'message' => $message, 'status' => $status]);
    }
}
