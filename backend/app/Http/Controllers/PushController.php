<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\Request;

class PushController extends Controller
{
    /**
     * POST /api/push/subscribe
     * Save or update push subscription for the authenticated user.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'endpoint'     => 'required|string|max:500',
            'p256dh_key'   => 'required|string',
            'auth_key'     => 'required|string',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }

        PushSubscription::updateOrCreate(
            ['endpoint' => $request->endpoint],
            [
                'user_id'    => $user->uId,
                'p256dh_key' => $request->p256dh_key,
                'auth_key'   => $request->auth_key,
            ]
        );

        return response()->json(['status' => 'success', 'message' => 'Subscription saved.']);
    }

    /**
     * DELETE /api/push/unsubscribe
     * Remove push subscription.
     */
    public function unsubscribe(Request $request)
    {
        $request->validate(['endpoint' => 'required|string']);

        PushSubscription::where('endpoint', $request->endpoint)
            ->where('user_id', $request->user()->uId)
            ->delete();

        return response()->json(['status' => 'success', 'message' => 'Subscription removed.']);
    }

    /**
     * GET /api/push/vapid-public-key
     * Return the VAPID public key for the frontend to use.
     */
    public function vapidPublicKey()
    {
        return response()->json([
            'status'     => 'success',
            'public_key' => env('VAPID_PUBLIC_KEY'),
        ]);
    }
}
