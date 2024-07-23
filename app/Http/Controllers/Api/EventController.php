<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $query = Event::query();

        $events = $query->orderBy('event_date', 'desc')->paginate($perPage);

        Carbon::setLocale('ar');
        $data = $events->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'summary' => $event->summary,
                'thumbnail' => url('/storage/' . $event->thumbnail),
                'created_at_humanly_readable' => Carbon::parse($event->created_at)->diffForHumans(),
                'created_at' => $event->created_at,
                'location' => $event->location,
                'wilaya' => $event->wilaya,
                'event_date_humanly_readable' => Carbon::parse($event->event_date)->diffForHumans(), // Format date to numeric format
                'event_date' => $event->event_date, // Format date to numeric format
                'nb_views' => $event->nb_views,
                'time_to_read_minutes' => $event->time_to_read_minutes
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'total' => $events->total(),
                'perPage' => $events->perPage(),
                'currentPage' => $events->currentPage(),
                'lastPage' => $events->lastPage(),
                'nextPageUrl' => $events->nextPageUrl(),
                'previousPageUrl' => $events->previousPageUrl(),
            ]
        ]);
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);

        Carbon::setLocale('ar');
        $data = [
            'id' => $event->id,
            'title' => $event->title,
            'summary' => $event->summary,
            'thumbnail' => url('/storage/' . $event->thumbnail),
            'created_at_humanly_readable' => Carbon::parse($event->created_at)->diffForHumans(),
            'created_at' => Carbon::parse($event->created_at)->translatedFormat('d-m-Y H:i'),
            'nb_views' => $event->nb_views,
            'content' => changeImagesUrlInContent($event->content),
            'location' => $event->location,
            'wilaya' => $event->wilaya,
            'event_date_humanly_readable' => Carbon::parse($event->event_date)->diffForHumans(), // Format date to numeric format
            'event_date' => $event->event_date, // Format date to numeric format
            'time_to_read_minutes' => $event->time_to_read_minutes
        ];

        return response()->json([
            'event' => $data
        ]);
    }
}
