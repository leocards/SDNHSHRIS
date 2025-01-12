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
        Schema::create('pds_personal_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('placeofbirth', 1000)->nullable();
            $table->json('civilstatus')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->enum('bloodtype', [
                'A',
                'A+',
                'A-',
                'B',
                'B+',
                'B-',
                'AB',
                'AB+',
                'AB-',
                'O',
                'O+',
                'O-',
            ])->nullable();
            $table->string('gsis')->nullable();
            $table->string('pagibig')->nullable();
            $table->string('philhealth')->nullable();
            $table->string('sss')->nullable();
            $table->string('tin')->nullable();
            $table->string('agencyemployee')->nullable();
            $table->string('telephone')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->json('citizenship')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pds_personal_information');
    }
};
