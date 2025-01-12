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
        Schema::create('salns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->date('asof');
            $table->json('spouse');
            $table->json('children');
            $table->json('assets');
            $table->json('liabilities');
            $table->json('biandfc');
            $table->json('relativesingovernment');
            $table->date('date');
            $table->enum('isjoint', ['joint','separate','not']);
            $table->enum('status', ['pending','approved'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salns');
    }
};
