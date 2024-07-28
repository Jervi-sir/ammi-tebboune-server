<?php

use App\Http\Controllers\SubscriptionController;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\NewsUpdateNotification;
use App\Notifications\PushNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProfileController;
use Minishlink\WebPush\VAPID;

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
    $subscriptions = Subscription::all();

    // Prepare notification details
    $title = 'New Article Published';
    $body = 'title';
    $url = url('/articles/' . 'id');

    // Send notification to all subscriptions
    foreach ($subscriptions as $subscription) {
        $subscription->notify(new PushNotification($title, $body, $url));
    }

    return response()->json('sent', 201);
});


Route::get('/generate-vapid-keys', function () {
    $vapidKeys = VAPID::createVapidKeys();
    return response()->json($vapidKeys);
});