<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Drop the `plain_password` column from `users`.
 *
 * Background
 * ----------
 * The original migration (2026_04_08_150000_add_plain_password_to_users)
 * added an `plain_password` TEXT column intended to let teachers "view a
 * student's password". It was populated via Laravel's `encrypt()` helper,
 * which is symmetric and reversible by anyone holding APP_KEY. That
 * effectively means anyone with the database dump AND the application key
 * (developers, ops, anyone with a copy of `.env`, anyone reading a leaked
 * backup) can recover every student's plaintext password.
 *
 * This violates OWASP A02:2021 (Cryptographic Failures): user secrets must
 * be one-way hashed, never reversibly stored. The hashed `uPassword`
 * column is sufficient for authentication; teachers who need to "give a
 * student their password" should generate a new one and reset it (the
 * existing `resetStudentPassword` flow returns the new password in the
 * response payload at the moment it is set, then forgets it).
 *
 * Rollout notes
 * -------------
 * 1. Application code that wrote to this column has already been removed
 *    (see UserController@createSingleStudent, batchCreateStudents,
 *    resetStudentPassword; User::$fillable; the seeders).
 * 2. The down() migration intentionally re-adds the column as nullable
 *    text so a rollback won't fail, but DO NOT start writing to it again.
 *    If a feature legitimately needs plaintext recovery, design it
 *    around per-action one-time tokens, not at-rest plaintext storage.
 * 3. After deploying this migration, rotate APP_KEY in every environment
 *    so any old DB snapshot containing the encrypted column can no
 *    longer be decrypted by attackers who get hold of both.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'plain_password')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('plain_password');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'plain_password')) {
            Schema::table('users', function (Blueprint $table) {
                // Re-added only so a rollback does not fail. Do NOT
                // populate this column again. See the class-level docblock.
                $table->text('plain_password')->nullable()->after('uPassword');
            });
        }
    }
};
