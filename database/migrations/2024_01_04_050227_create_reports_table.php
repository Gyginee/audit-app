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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('store_code');
            $table->unsignedBigInteger('province_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('type_report');
            $table->boolean('finish'); // Corrected 'boolen' to 'boolean'
            $table->foreign('province_id')->references('id')->on('provinces');
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
        Schema::dropIfExists('reports');
    }
};
