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
        Schema::create('pds_work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->json('inlcusivedates')->nullable();
            $table->string('positiontitle')->nullable();
            $table->string('department')->nullable();
            $table->string('monthlysalary', 20)->nullable();
            $table->string('salarygrade')->nullable();
            $table->string('statusofappointment', 45)->nullable();
            $table->string('isgovernment', 1)->default('n');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pds_work_experiences');
    }
};
