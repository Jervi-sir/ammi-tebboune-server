<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function store(Request $request)
    {

        $data = $request->all();

        $existingSubscription = Subscription::where('endpoint', $data['endpoint'])->first();

        if (!$existingSubscription) {
            Subscription::create([
                'endpoint' => $data['endpoint'],
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
            ]);
        }

        return response()->json(['success' => true]);
    }
}
