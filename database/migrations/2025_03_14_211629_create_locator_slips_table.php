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
        Schema::create('locator_slips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('principal_id')->constrained('users');
            $table->date('dateoffiling');
            $table->string('purposeoftravel');
            $table->enum('type', ['business', 'time']);
            $table->string('destination');
            $table->json('agenda');
            $table->enum('status', ['disapproved', 'approved', 'pending'])->default('pending');
            // $table->string('memo', 1000)->nullable();
            $table->date('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locator_slips');
    }
};
