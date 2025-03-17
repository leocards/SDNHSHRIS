<?php

namespace App;

trait ResponseTrait
{
    public function returnResponse(string $title, string $message, string $status, ?string $route = null)
    {
        return ($route ? redirect($route) : redirect())->back()->with(['title' => $title, 'message' => $message, 'status' => $status]);
    }
}
