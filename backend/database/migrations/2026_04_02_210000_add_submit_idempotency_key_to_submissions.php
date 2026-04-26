<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSubmitIdempotencyKeyToSubmissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('submissions', 'submit_idempotency_key')) {
                $table->string('submit_idempotency_key', 64)->nullable()->after('sGraded_time');
                $table->unique('submit_idempotency_key', 'submissions_submit_idempotency_key_unique');
            }
        });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
            if (Schema::hasColumn('submissions', 'submit_idempotency_key')) {
                $table->dropUnique('submissions_submit_idempotency_key_unique');
                $table->dropColumn('submit_idempotency_key');
            }
        });
        }
    }
}
