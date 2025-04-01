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
        Schema::create('class_assumptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('principal_id')->constrained('users');
            $table->foreignId('curriculumnhead_id')->constrained('users');
            $table->foreignId('academichead_id')->constrained('users');
            $table->json('details');
            $table->enum('status', ['disapproved', 'approved', 'pending'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_assumptions');
    }
};
