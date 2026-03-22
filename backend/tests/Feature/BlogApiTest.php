<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class BlogApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $admin;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->admin = User::factory()->create(['uRole' => 'admin']);

        $this->category = Category::create([
            'caName' => 'IELTS',
        ]);
    }

    /** @test */
    public function teacher_can_create_blog_post()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/blogs', [
            'blogName' => 'IELTS Writing Tips',
            'blogContent' => 'Here are some useful tips for IELTS writing...',
            'blogType' => 'tips',
            'blogCategory' => $this->category->caId,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('posts', [
            'pTitle' => 'IELTS Writing Tips',
            'pAuthor_id' => $this->teacher->uId,
        ]);
    }

    /** @test */
    public function teacher_can_view_their_blog_posts()
    {
        Post::factory()->count(5)->create([
            'pAuthor_id' => $this->teacher->uId,
            'pCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/blogs');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_update_blog_post()
    {
        $post = Post::factory()->create([
            'pAuthor_id' => $this->teacher->uId,
            'pCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/teacher/blogs/{$post->pId}", [
            'blogName' => 'Updated Title',
            'blogContent' => 'Updated content',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('posts', [
            'pId' => $post->pId,
            'pTitle' => 'Updated Title',
        ]);
    }

    /** @test */
    public function teacher_can_delete_blog_post()
    {
        $post = Post::factory()->create([
            'pAuthor_id' => $this->teacher->uId,
            'pCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teacher/blogs/{$post->pId}");

        $response->assertStatus(200);
    }
}
