<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * @deprecated 2026-06 — This seeder previously populated the `plain_password`
 * column on legacy student rows so teachers could view raw passwords. The
 * column has been dropped (OWASP A02 — Cryptographic Failures: storing
 * recoverable passwords on disk is unsafe even when encrypted with the
 * application key, since a single-key compromise yields every password in
 * cleartext). Kept as a stub so any historical references resolve, but it
 * is intentionally a no-op. Safe to delete in a follow-up cleanup once we
 * confirm nothing in CI/local workflows still calls it.
 */
class UpdateOldStudentsPassword extends Seeder
{
    public function run(): void
    {
        if (isset($this->command)) {
            $this->command->warn(
                'UpdateOldStudentsPassword is deprecated and now a no-op. '
                . 'The plain_password column has been removed for security. '
                . 'Use the admin "reset password" flow to issue new credentials '
                . 'and surface them once to the teacher.'
            );
        }
    }
}
