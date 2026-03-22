<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->admin = User::factory()->create(['uRole' => 'admin']);
    }

    /** @test */
    public function anyone_can_view_public_categories()
    {
        Category::factory()->count(5)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_create_category()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/admin/categories', [
            'caName' => 'TOEFL',
            'caDescription' => 'TOEFL test preparation',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('category', [
            'caName' => 'TOEFL',
        ]);
    }

    /** @test */
    public function admin_can_update_category()
    {
        $category = Category::factory()->create();

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/admin/categories/{$category->caId}", [
            'caName' => 'Updated Category',
            'caDescription' => 'Updated description',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('category', [
            'caId' => $category->caId,
            'caName' => 'Updated Category',
        ]);
    }

    /** @test */
    public function admin_can_delete_category()
    {
        $category = Category::factory()->create();

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/admin/categories/{$category->caId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_view_all_categories()
    {
        Category::factory()->count(10)->create();

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/categories');

        $response->assertStatus(200);
    }
}
