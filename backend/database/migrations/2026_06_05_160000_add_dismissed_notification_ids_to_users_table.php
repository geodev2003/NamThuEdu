<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // List of dynamic notification IDs the student has dismissed.
            // Notifications are computed on-the-fly (no DB rows), so we
            // persist the IDs the user has cleared and exclude them on read.
            $table->json('dismissed_notification_ids')
                ->nullable()
                ->after('notifications_read_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('dismissed_notification_ids');
        });
    }
};
