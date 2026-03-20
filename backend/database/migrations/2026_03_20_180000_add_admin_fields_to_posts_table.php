<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('pApproved_by')->nullable()->after('pStatus');
            $table->timestamp('pApproved_at')->nullable()->after('pApproved_by');
            $table->unsignedBigInteger('pRejected_by')->nullable()->after('pApproved_at');
            $table->timestamp('pRejected_at')->nullable()->after('pRejected_by');
            $table->text('pReject_reason')->nullable()->after('pRejected_at');
            
            $table->foreign('pApproved_by')->references('uId')->on('users')->onDelete('set null');
            $table->foreign('pRejected_by')->references('uId')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['pApproved_by']);
            $table->dropForeign(['pRejected_by']);
            $table->dropColumn([
                'pApproved_by',
                'pApproved_at', 
                'pRejected_by',
                'pRejected_at',
                'pReject_reason'
            ]);
        });
    }
};