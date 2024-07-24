<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->longText('content');
            $table->text('summary')->nullable();
            $table->text('thumbnail')->nullable();
            $table->date('published_date')->nullable();
            $table->integer('time_to_read_minutes')->default(1);
            $table->integer('nb_views')->default(0);
            $table->foreignId('category_id');

            $table->bigInteger('author_id')->nullable();
            $table->foreign('author_id')->references('id')->on('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
