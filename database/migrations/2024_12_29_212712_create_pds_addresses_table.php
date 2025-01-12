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
        Schema::create('pds_addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pdspi_id');
            $table->enum('type', ['residential', 'permanent']);
            $table->boolean('same')->default(false);
            $table->string('houselotblockno', 50)->nullable();
            $table->string('street', 100)->nullable();
            $table->string('subdivision', 100)->nullable();
            $table->string('barangay', 100)->nullable();
            $table->string('citymunicipality', 50)->nullable();
            $table->string('province', 50)->nullable();
            $table->string('zipcode', 10)->nullable();
            $table->timestamps();

            $table->foreign('pdspi_id')->references('id')->on('pds_personal_information');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pds_addresses');
    }
};
