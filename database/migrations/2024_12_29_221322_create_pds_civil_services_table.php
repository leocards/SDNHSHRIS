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
        Schema::create('pds_civil_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('careerservice', 1000);
            $table->string('rating', 20)->nullable();
            $table->date('examination')->nullable();
            $table->string('placeexamination', 500)->nullable();
            $table->string('licensenumber', 20)->nullable();
            $table->string('validity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pds_civil_services');
    }
};
