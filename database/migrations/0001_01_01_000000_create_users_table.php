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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('middlename')->nullable();
            $table->string('extensionname')->nullable();
            $table->date('birthday');
            $table->enum('gender', ['male', 'female']);
            $table->string('status')->nullable();
            $table->string('email')->unique();
            $table->string('mobilenumber', 13)->nullable();
            $table->string('personnelid')->unique();
            $table->string('department')->nullable();
            $table->enum('role', ['hr', 'principal', 'teaching', 'non-teaching']);
            $table->string('position')->nullable();
            $table->enum('gradelevel', ['7','8','9','10','11','12'])->nullable();
            $table->enum('curriculumnhead', ['7','8','9','10','11','12'])->nullable();
            $table->enum('academichead', ['junior','senior'])->nullable();
            $table->date('hiredate');
            $table->string('credits')->nullable();
            $table->string('splcredits')->nullable();
            $table->boolean('enable_email_notification')->default(false);
            $table->boolean('enable_email_message_notification')->default(false);
            $table->boolean('enable_email_announcement_reminder')->default(false);
            $table->string('employmentstatus')->nullable();
            $table->string('salary')->nullable();
            $table->string('avatar')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('status_updated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
