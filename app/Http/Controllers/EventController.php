<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    public function showEditor(Request $request)
    {   
        return Inertia::render('Events/PublishEvent');
    }

    public function publish(Request $request)
    {
        $data = $request->all();
       
        // Extract base64 images and save them
        $content = $data['content'];
        $content = saveImagesAndReplaceSrc($content);
        $event = Event::create([
            'title' => $data['title'],
            'summary' => $data['summary'],
            'content' => $content,
            'event_date' => $data['event_date'],
            'location' => $data['location'],
            'wilaya' => $data['wilaya'],
            'thumbnail' => saveThumbnailBase64($data['thumbnail']),
            'time_to_read_minutes' => countReadTime($content)
        ]);

        $url =  route('event.showEvent', ['id' => $event->id]);
        return response()->json([
            'url' => $url
        ]);
    }

    public function showEvent(Request $request, $id) 
    {
        $event = Event::find($id);
        Carbon::setLocale('ar');
        $data['event'] = [
            'id' => $event->id,
            'title' => $event->title,
            'summary' => $event->summary,
            'content' => changeImagesUrlInContentServer($event->content),
            'event_date' => $event->event_date,
            'location' => $event->location,
            'wilaya' => $event->wilaya,
            'thumbnail' => '/storage/' . $event->thumbnail,
            'nb_views' => $event->nb_views,
            'created_at' => Carbon::parse($event->created_at)->diffForHumans(), // Format date to numeric format
        ];

        return Inertia::render('Events/ViewEvent', [
            'event' => $data['event']
        ]);
    }


    public function listEvents(Request $request)
    {
        $perPage = 10;
        $query = Event::query();

        $events = $query->orderBy('created_at', 'desc')->paginate($perPage);

        Carbon::setLocale('en');
        $data['events'] = [];
        foreach ($events as $key => $event) {
            $data['events'][$key] = [
                'id' => $event->id,
                'title' => $event->title,
                'summary' => $event->summary,
                'location' => $event->location,
                'wilaya' => $event->wilaya,
                'thumbnail' => '/storage/' . $event->thumbnail,
                'created_at' => Carbon::parse($event->created_at)->translatedFormat('d-m-Y H:i'), // Format date to numeric format
                'event_date' => Carbon::parse($event->event_date)->translatedFormat('d-m-Y H:i'), // Format date to numeric format
                'nb_views' => $event->nb_views,
            ];
        }


        return Inertia::render('Events/ListEvents', [
            'events' => $data['events'],
            'pagination' => [
                'total' => $events->total(),
                'perPage' => $events->perPage(),
                'currentPage' => $events->currentPage(),
                'lastPage' => $events->lastPage(),
                'nextPageUrl' => $events->nextPageUrl(),
                'previousPageUrl' => $events->previousPageUrl()
            ],
        ]);
    }


    public function edit($id)
    {
        $event = Event::findOrFail($id);
    
        $data['events'] = [
            'id' => $event->id,
            'title' => $event->title,
            'summary' => $event->summary,
            'location' => $event->location,
            'wilaya' => $event->wilaya,
            'thumbnail' => '/storage/' . $event->thumbnail,
            'created_at' => $event->created_at,
            'event_date' => $event->event_date,
            'nb_views' => $event->nb_views,
            'content' => changeImagesUrlInContentServer($event->content),
        ];

        return Inertia::render('Events/EditEvent', [
            'event' => $data['events'],
        ]);
    }
    
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $data = $request->all();
        
        // Update the article data
        $content = $data['content'];
        $content = saveImagesAndReplaceSrc($content);
        
        $event->update([
            'title' => $data['title'],
            'summary' => $data['summary'],
            'thumbnail' => $request->has('thumbnail') ? saveThumbnailBase64($data['thumbnail']) : $event->thumbnail,
            'content' => $content,
            'wilaya' => $data['wilaya'],
            'location' => $data['location'],
            'event_date' => $data['event_date'],
        ]);
    
        $url =  route('event.showEvent', ['id' => $event->id]);
        return response()->json([
            'url' => $url
        ]);
    }
    

    public function destroy($id)
    {
        $article = Event::findOrFail($id);
        // Optionally, you can check permissions here
        // if ($request->user()->cannot('delete', $article)) {
        //     abort(403);
        // }
        $article->delete();
        return redirect()->back();
    }
}
