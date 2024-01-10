<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('province_id');
            $table->string('division_type');
            $table->string('codename');
            $table->integer('phone_code');
            // You can add more columns here based on your data
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('provinces');
    }
};
