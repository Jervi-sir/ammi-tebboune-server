<?php

use App\Http\Controllers\SubscriptionController;
use App\Models\PushNotification;
use App\Models\User;
use App\Notifications\NewsUpdateNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProfileController;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\VAPID;
use Minishlink\WebPush\WebPush;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/list-categories', [ArticleController::class, 'listCategories']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/hot-topic', [ArticleController::class, 'hotTopic']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

Route::get('/profile', [ProfileController::class, 'show']);


Route::post('/subscribe', [SubscriptionController::class, 'store']);


Route::get('/broadcast', function(Request $request) {
    $subscriptions = PushNotification::all();

        $auth = [
            'VAPID' => [
                'subject' => 'mailto:your-email@example.com',
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);

        foreach ($subscriptions as $subscription) {
            $webPush->sendNotification(
                new Subscription(
                    $subscription->endpoint,
                    $subscription->public_key,
                    $subscription->auth_token
                ),
                json_encode(['title' => 'New Notification', 'body' => $request->message])
            );
        }

        $webPush->flush();

        return response()->json(['success' => true]);
});


Route::get('/generate-vapid-keys', function () {
    $vapidKeys = VAPID::createVapidKeys();
    return response()->json($vapidKeys);
});