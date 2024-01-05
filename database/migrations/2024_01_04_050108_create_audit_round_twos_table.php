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
        Schema::create('audit_round_twos', function (Blueprint $table) {
            $table->id();
            $table->string('store_code');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('report_id');
            $table->foreign('store_code')->references('store_code')->on('stores');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_round_twos');
    }
};
