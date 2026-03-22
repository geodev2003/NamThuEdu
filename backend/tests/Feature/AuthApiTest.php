<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;

class AuthApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');
    }

    /** @test */
    public function user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'uPhone' => '0123456789',
            'uPassword' => Hash::make('password123'),
            'uRole' => 'student',
        ]);

        $response = $this->postJson('/api/login', [
            'phone' => '0123456789',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'uPhone' => '0123456789',
            'uPassword' => Hash::make('password123'),
            'uRole' => 'student',
        ]);

        $response = $this->postJson('/api/login', [
            'phone' => '0123456789',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create([
            'uRole' => 'student',
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_refresh_token()
    {
        // Skip this test if refresh endpoint doesn't exist yet
        $this->markTestSkipped('Refresh token endpoint needs to be implemented');
    }
}
