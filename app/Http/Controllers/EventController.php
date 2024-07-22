<?php

namespace App\Http\Controllers;

use App\Models\Event;
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
        $content = $this->saveImagesAndReplaceSrc($content);
        $event = Event::create([
            'title' => $data['title'],
            'summary' => $data['summary'],
            'content' => $content,
            'event_date' => $data['event_date'],
            'location' => $data['location'],
            'thumbnail' => $data['thumbnail']->store('thumbnails', 'public'),
        ]);
        return response()->json($event);

        $url =  route('event.showEvent', ['id' => $event->id]);
        return response()->json([
            'url' => $url
        ]);
    }


    private function saveImagesAndReplaceSrc($content)
    {
        $dom = new \DOMDocument();
        @$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $images = $dom->getElementsByTagName('img');
        
        foreach ($images as $img) {
            $base64Image = $img->getAttribute('src');
        
            if (strpos($base64Image, 'data:image') === 0) {
                list($type, $data) = explode(';', $base64Image);
                list(, $data)      = explode(',', $data);
                $decodedImageData = base64_decode($data);
                // Generate a filename, usually with a timestamp to avoid overwriting
                $filename = 'image_' . time() . '.jpg'; // Assuming the image is a jpeg
                // Save the image to the public storage disk
                Storage::disk('public')->put('images/' . $filename, $decodedImageData);
                // Return the URL to the saved image
                $path = Storage::url('images/' . $filename);
                $img->setAttribute('src', $path);
            }
        }
    
        return $dom->saveHTML();
    }
    
}
