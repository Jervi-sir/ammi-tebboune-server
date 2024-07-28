<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function store(Request $request)
    {

        $data = $request->all();

        $existingSubscription = Subscription::where('endpoint', $data['subscription']['endpoint'])->first();

        if (!$existingSubscription) {
            Subscription::create([
                'endpoint' => $data['subscription']['endpoint'],
                'public_key' => $data['subscription']['keys']['p256dh'],
                'auth_token' => $data['subscription']['keys']['auth'],
            ]);
        }

        return response()->json(['success' => true]);
    }
}
