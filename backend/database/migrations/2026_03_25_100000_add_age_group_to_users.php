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
        Schema::table('users', function (Blueprint $table) {
            // Age group: kids (6-12), teens (13-17), adults (18-45)
            $table->enum('age_group', ['kids', 'teens', 'adults'])
                  ->default('teens')
                  ->after('role')
                  ->comment('User age group for UI adaptation');
            
            // Date of birth for automatic age group calculation
            $table->date('date_of_birth')
                  ->nullable()
                  ->after('age_group')
                  ->comment('User date of birth');
            
            // Theme preference: auto (based on age), or manual override
            $table->string('theme_preference', 20)
                  ->default('auto')
                  ->after('date_of_birth')
                  ->comment('Theme preference: auto, kids, teens, adults');
            
            // Last theme update timestamp
            $table->timestamp('theme_updated_at')
                  ->nullable()
                  ->after('theme_preference')
                  ->comment('Last time theme was updated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'age_group',
                'date_of_birth',
                'theme_preference',
                'theme_updated_at'
            ]);
        });
    }
};
