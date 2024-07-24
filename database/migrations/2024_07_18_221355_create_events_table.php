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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->integer('time_to_read_minutes')->default(1);
            $table->date('event_date')->nullable();
            $table->text('location')->nullable();
            $table->text('wilaya')->nullable();
            $table->text('thumbnail')->nullable();
            $table->integer('nb_views')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
