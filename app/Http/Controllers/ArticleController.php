<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function listArticles(Request $request)
    {
        $perPage = 10;
        $query = Article::query();

        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        $articles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        Carbon::setLocale('en');
        $data['articles'] = [];
        foreach ($articles as $key => $article) {
            $data['articles'][$key] = [
                'id' => $article->id,
                'title' => $article->title,
                'summary' => $article->summary,
                'thumbnail' => '/storage/' . $article->thumbnail,
                'published_date' => Carbon::parse($article->published_date)->translatedFormat('d-m-Y H:i'), // Format date to numeric format
                'category_id' => $article->category_id,
                'created_at' => Carbon::parse($article->created_at)->translatedFormat('d-m-Y H:i'), // Format date to numeric format
                'nb_views' => $article->nb_views,
                'category' => $article->category
            ];
        }

        $categories = Category::all();

        return Inertia::render('Articles/ListArticles', [
            'articles' => $data['articles'],
            'pagination' => [
                'total' => $articles->total(),
                'perPage' => $articles->perPage(),
                'currentPage' => $articles->currentPage(),
                'lastPage' => $articles->lastPage(),
                'nextPageUrl' => $articles->nextPageUrl(),
                'previousPageUrl' => $articles->previousPageUrl()
            ],
            'categories' => $categories,
            'selectedCategory' => $request->category
        ]);
    }


    public function showArticle(Request $request, $id) 
    {
        $article = Article::find($id);
        Carbon::setLocale('ar');
        $data['article'] = [
            'id' => $article->id,
            'title' => $article->title,
            'summary' => $article->summary,
            'thumbnail' => '/storage/' . $article->thumbnail,
            'category' => $article->category,
            'nb_views' => $article->nb_views,
            'content' => $article->content,
            'created_at' => Carbon::parse($article->created_at)->diffForHumans(), // Format date to numeric format
        ];

        return Inertia::render('Articles/ViewArticle', [
            'article' => $data['article']
        ]);
    }

    public function showEditor(Request $request)
    {   
        $categories = Category::all();
        $data['categories'] = [];
        foreach ($categories as $key => $category) {
            $data['categories'][$key] = [
                'id' => $category->id,
                'name' => $category->name,
            ];
        }

        return Inertia::render('Articles/PublishArticle', [
            'categories' => $data['categories']
        ]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        // Optionally, you can check permissions here
        // if ($request->user()->cannot('delete', $article)) {
        //     abort(403);
        // }
        $article->delete();
        return redirect()->back();
    }

    public function publish(Request $request)
    {
        $data = $request->all();
        // dd($data);
        // Extract base64 images and save them
        $content = $data['content'];
        $content = $this->saveImagesAndReplaceSrc($content);
        // Save the updated content and other data
        // Assuming you have a model named `Article`
        $article = Article::create([
            'title' => $data['title'],
            'category_id' => Category::where('name', $data['category'])->first()->id,
            'summary' => $data['summary'],
            'thumbnail' => $data['thumbnail']->store('thumbnails', 'public'),
            'content' => $content,
            'published_date' => now()
        ]);

        $url =  route('article.showArticle', ['id' => $article->id]);
        return response()->json([
            'url' => $url
        ]);
    }

    public function edit($id)
    {
        $article = Article::with('category')->findOrFail($id);
        $categories = Category::all();
        $data['categories'] = [];
        foreach ($categories as $key => $category) {
            $data['categories'][$key] = [
                'id' => $category->id,
                'name' => $category->name,
            ];
        }
    
        return Inertia::render('Articles/EditArticle', [
            'article' => $article,
            'categories' => $data['categories'],
        ]);
    }
    

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $data = $request->all();
        
        // Update the article data
        $content = $data['content'];
        $content = $this->saveImagesAndReplaceSrc($content);
        
        $article->update([
            'title' => $data['title'],
            'category_id' => Category::where('name', $data['category'])->first()->id,
            'summary' => $data['summary'],
            'thumbnail' => $data['thumbnail'] ? $data['thumbnail']->store('thumbnails', 'public') : $article->thumbnail,
            'content' => $content,
        ]);

        $url =  route('article.showArticle', ['id' => $article->id]);
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
