<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Anchored after `uPassword` (was `plain_password` before that
            // column was dropped for OWASP A02 compliance — see the
            // drop_plain_password_from_users_table migration).
            $table->timestamp('notifications_read_at')->nullable()->after('uPassword');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('notifications_read_at');
        });
    }
};
