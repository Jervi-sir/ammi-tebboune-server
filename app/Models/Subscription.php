<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use NotificationChannels\WebPush\HasPushSubscriptions;
use NotificationChannels\WebPush\PushSubscription;

class Subscription extends Model
{
    use HasFactory, Notifiable, HasPushSubscriptions;

    protected $fillable = [
        'endpoint',
        'public_key',
        'auth_token',
    ];
}
