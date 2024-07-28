<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription as WebPushSubscription;
use App\Models\Subscription as SubscriptionModel;

class SendPushNotification extends Command
{
    protected $signature = 'send:push {message}';
    protected $description = 'Send a push notification to all subscribers';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $subscriptions = SubscriptionModel::all();

        $auth = [
            'VAPID' => [
                'subject' => 'mailto:example@example.com',
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);

        foreach ($subscriptions as $subscription) {
            $webPush->queueNotification(
                WebPushSubscription::create([
                    'endpoint' => $subscription->endpoint,
                    'publicKey' => $subscription->public_key,
                    'authToken' => $subscription->auth_token,
                ]),
                json_encode(['title' => 'Notification', 'body' => $this->argument('message')])
            );
        }

        $webPush->flush();
    }
}
