<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNamthueduPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id('pId');
            $table->string('pTitle');
            $table->longText('pContent');
            $table->unsignedBigInteger('pAuthor_id');
            $table->enum('pType', ['grammar', 'tips', 'vocabulary']);
            $table->unsignedBigInteger('pCategory')->nullable();
            $table->text('pUrl')->nullable();
            $table->text('pThumbnail')->nullable();
            $table->integer('pView')->default(0);
            $table->integer('pLike')->default(0);
            $table->enum('pStatus', ['active', 'inactive', 'draft'])->default('draft');
            $table->timestamp('pCreated_at')->useCurrent();
            $table->timestamp('pDeleted_at')->nullable();
            $table->timestamp('pUpdated_at')->nullable();
            
            $table->foreign('pAuthor_id')->references('uId')->on('users')->onDelete('cascade');
            $table->foreign('pCategory')->references('caId')->on('category')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
