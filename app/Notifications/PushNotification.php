<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\Message;
use NotificationChannels\WebPush\WebPushChannel;

class PushNotification extends Notification
{
    use Queueable;

    protected $title;
    protected $body;
    protected $url;

    public function __construct($title, $body, $url)
    {
        $this->title = $title;
        $this->body = $body;
        $this->url = $url;
    }

    public function via($notifiable)
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new Message)
            ->title($this->title)
            ->body($this->body)
            ->action('View Article', $this->url)
            ->data(['url' => $this->url]);
    }
}
