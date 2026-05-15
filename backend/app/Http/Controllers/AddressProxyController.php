<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AddressProxyController extends Controller
{
    private const BASE = 'https://production.cas.so/address-kit/latest';

    private function client()
    {
        return Http::timeout(10)->withoutVerifying();
    }

    public function provinces()
    {
        $response = $this->client()->get(self::BASE . '/provinces');
        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/json');
    }

    public function communes(string $code)
    {
        $response = $this->client()->get(self::BASE . "/provinces/{$code}/communes");
        return response($response->body(), $response->status())
            ->header('Content-Type', 'application/json');
    }
}
