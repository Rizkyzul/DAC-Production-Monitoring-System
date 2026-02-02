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
        Schema::create('productions', function (Blueprint $table) {
            $table->id();
            $table->string('serial_number')->unique()->nullable();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->timestamp('status_pra_assembly')->nullable();
            $table->timestamp('status_assembly')->nullable();
            $table->timestamp('status_qc')->nullable();
            $table->timestamp('status_packing')->nullable();
            $table->timestamp('status_logistics')->nullable();
            $table->boolean('is_rejected')->default(false);
            $table->text('reject_reason')->nullable();
            $table->json('checklist_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productions');
    }
};
