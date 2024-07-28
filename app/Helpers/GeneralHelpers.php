<?php

use Illuminate\Support\Facades\Storage;

function countReadTime($content)
{
  $wordCount = str_word_count(strip_tags($content)); // Strip tags to avoid counting HTML tags
  $readingSpeed = 200; // Average reading speed in words per minute
  $timeToReadMinutes = ceil($wordCount / $readingSpeed);

  return $timeToReadMinutes;
}

function saveImagesAndReplaceSrc($content)
{
    $dom = new \DOMDocument();
    @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
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
            // $path = Storage::url('images/' . $filename);
            $path= 'images/' . $filename;
            $img->setAttribute('src', $path);
        }
    }

    return $dom->saveHTML();
}

function saveThumbnailBase64($base64Image)
{
    
    list($type, $data) = explode(';', $base64Image);
    list(, $data)      = explode(',', $data);
    $decodedImageData = base64_decode($data);
    // Generate a filename, usually with a timestamp to avoid overwriting
    $filename = 'image_' . time() . '.jpg'; // Assuming the image is a jpeg
    // Save the image to the public storage disk
    Storage::disk('public')->put('thumbnails/' . $filename, $decodedImageData);
    // Return the URL to the saved image
    // $path = Storage::url('thumbnail/' . $filename);
    $path= 'thumbnails/' . $filename;

    return $path;
}

function changeImagesUrlInContentAPI($content)
{
    $dom = new \DOMDocument();
    @$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

    // Get all img tags and update their src attributes
    $images = $dom->getElementsByTagName('img');
    foreach ($images as $img) {
        $src = $img->getAttribute('src');
        $img->setAttribute('src', makeUrlImageWithDomain($src));
    }

    $content = $dom->saveHTML();

    return $content;
}

function changeImagesUrlInContentServer($content)
{
    $dom = new \DOMDocument();
    @$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

    // Get all img tags and update their src attributes
    $images = $dom->getElementsByTagName('img');
    foreach ($images as $img) {
        $src = $img->getAttribute('src');
        $img->setAttribute('src', makeUrlImageWithDomain($src));
    }

    $content = $dom->saveHTML();

    return $content;
}

function makeUrlImageWithDomain($path)
{
    return url('/storage/'. $path);
}