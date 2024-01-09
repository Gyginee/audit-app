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
        //
        Schema::create('image_paths', function (Blueprint $table) {
            $table->id();
            $table->text('url');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('type');
            $table->unsignedBigInteger('report_id');
            $table->timestamps();
            $table->foreign('report_id')->references('id')->on('reports');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('image_paths');
    }
};
