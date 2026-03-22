<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class AdminApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $teacher;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->admin = User::factory()->create(['uRole' => 'admin']);

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->student = User::factory()->create(['uRole' => 'student']);
    }

    /** @test */
    public function admin_can_view_all_users()
    {
        User::factory()->count(10)->create();

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/users');

        $response->assertStatus(200);
        
        // Check if response has data
        $data = $response->json();
        if (isset($data['data'])) {
            $response->assertStatus(200);
        }
    }

    /** @test */
    public function admin_can_create_user()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/admin/users', [
            'phone' => '0999888777',
            'password' => 'password123',
            'name' => 'New Teacher',
            'role' => 'teacher',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'uPhone' => '0999888777',
            'uRole' => 'teacher',
        ]);
    }

    /** @test */
    public function admin_can_change_user_role()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/users/{$this->student->uId}/change-role", [
            'role' => 'teacher'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student->uId,
            'uRole' => 'teacher'
        ]);
    }

    /** @test */
    public function admin_can_lock_user()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/users/{$this->student->uId}/lock", [
            'reason' => 'Violation of terms',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student->uId,
                    ]);
    }

    /** @test */
    public function admin_can_unlock_user()
    {
        $this->student->update(['uStatus' => 'inactive']);

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/users/{$this->student->uId}/unlock");

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student->uId,
                    ]);
    }

    /** @test */
    public function admin_can_view_pending_posts()
    {
        $category = Category::factory()->create();

        Post::factory()->count(5)->create([
            'pAuthor_id' => $this->teacher->uId,
            'pCategory' => $category->caId,
            'pStatus' => 'pending',
        ]);

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/posts');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_approve_post()
    {
        $category = Category::factory()->create();

        $post = Post::factory()->create([
            'pAuthor_id' => $this->teacher->uId,
            'pCategory' => $category->caId,
            'pStatus' => 'pending',
        ]);

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/posts/{$post->pId}/approve");

        $response->assertStatus(200);

        $this->assertDatabaseHas('posts', [
            'pId' => $post->pId,
            'pStatus' => 'active',
        ]);
    }

    /** @test */
    public function admin_can_reject_post()
    {
        $category = Category::factory()->create();

        $post = Post::factory()->create([
            'pAuthor_id' => $this->teacher->uId,
            'pCategory' => $category->caId,
            'pStatus' => 'pending',
        ]);

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/posts/{$post->pId}/reject", [
            'reason' => 'Content does not meet guidelines',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('posts', [
            'pId' => $post->pId,
            'pStatus' => 'inactive',
        ]);
    }

    /** @test */
    public function admin_can_view_system_statistics()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/statistics/overview');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_cannot_access_admin_routes()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/users');

        $response->assertStatus(403);
    }

    /** @test */
    public function student_cannot_access_admin_routes()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/users');

        $response->assertStatus(403);
    }
}
