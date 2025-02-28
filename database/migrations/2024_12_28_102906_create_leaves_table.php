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
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('schoolyearid')->constrained('school_years')->onDelete('cascade');
            $table->foreignId('hr_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('principal_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->date('filingfrom');
            $table->date('filingto')->nullable();
            $table->string('salary', 20)->nullable();
            $table->enum('type', [
                "vacation",
                "mandatory",
                "sick",
                "maternity",
                "paternity",
                "spl",
                "solo",
                "study",
                "vowc",
                "rehabilitation",
                "slbw",
                "emergency",
                "adoption",
                "others",
            ]);
            $table->string('others', 500)->nullable();
            $table->integer('daysapplied');
            $table->date('from');
            $table->date('to')->nullable();
            $table->enum('commutation', ['requested', 'not'])->nullable();
            $table->enum('principalstatus', ['disapproved', 'approved', 'pending'])->default('pending');
            $table->text('principaldisapprovedmsg')->nullable();
            $table->enum('hrstatus', ['disapproved', 'approved', 'pending'])->default('pending');
            $table->text('hrdisapprovedmsg')->nullable();
            $table->enum('details', ['vphilippines', 'vabroad', 'shospital', 'spatient', 'degree', 'examreview', 'monitization', 'terminal'])->nullable();
            $table->string('detailsinput', 1000)->nullable();
            $table->boolean('notifiedDueMedical')->nullable();
            $table->json('approvedfor')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
