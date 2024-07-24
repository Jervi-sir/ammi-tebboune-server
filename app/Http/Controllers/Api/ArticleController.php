<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ArticleController extends Controller
{
    public function listCategories(Request $request)
    {
        $categories = Category::all()->take(3);

        $data['categories'] = [];
        foreach ($categories as $key => $category) {
            $data['categories'][$key] = [
                'id' => $category->id,
                'name' => $category->name,
            ];
        }

        return response()->json([
            'categories' => $data['categories']
        ]);
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        $query = Article::query();
        Carbon::setLocale('ar');

        if ($request->has('category') && $request->category) {
            $category = Category::where('code', $request->category)->first();
            $query->where('category_id', $category->id);
        }

        $articles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $data = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'summary' => $article->summary,
                'thumbnail' => url('/storage/' . $article->thumbnail),
                'published_date_humanly_readable' => Carbon::parse($article->published_date)->diffForHumans(),
                'published_date' => Carbon::parse($article->published_date)->translatedFormat('d-m-Y H:i'),
                'category_id' => $article->category_id,
                'created_at' => Carbon::parse($article->created_at)->translatedFormat('d-m-Y H:i'),
                'created_at_humanly_readable' => Carbon::parse($article->created_at)->diffForHumans(),
                'nb_views' => $article->nb_views,
                'category' => $article->category->name,
                'time_to_read_minutes' => $article->time_to_read_minutes
            ];
        });

        return response()->json([
            'articles' => $data,
            'pagination' => [
                'total' => $articles->total(),
                'perPage' => $articles->perPage(),
                'currentPage' => $articles->currentPage(),
                'lastPage' => $articles->lastPage(),
                'nextPageUrl' => $articles->nextPageUrl(),
                'previousPageUrl' => $articles->previousPageUrl(),
            ]
        ]);
    }

    
    public function hotTopic(Request $request)
    {
        $articles = Article::inRandomOrder()->take(5)->get();
        Carbon::setLocale('ar');

        $data = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'summary' => $article->summary,
                'thumbnail' => url('/storage/' . $article->thumbnail),
                'published_date_humanly_readable' => Carbon::parse($article->published_date)->diffForHumans(),
                'published_date' => Carbon::parse($article->published_date)->translatedFormat('d-m-Y H:i'),
                'category_id' => $article->category_id,
                'created_at_humanly_readable' => Carbon::parse($article->created_at)->diffForHumans(),
                'created_at' => Carbon::parse($article->created_at)->translatedFormat('d-m-Y H:i'),
                'nb_views' => $article->nb_views,
                'category' => $article->category->name,
                'time_to_read_minutes' => $article->time_to_read_minutes
            ];
        });

        return response()->json([
            'articles' => $data,
        ]);

    }
    

    public function show($id)
    {
        $article = Article::findOrFail($id);

        $data = [
            'id' => $article->id,
            'title' => $article->title,
            'summary' => $article->summary,
            'thumbnail' => url('/storage/' . $article->thumbnail),
            'published_date' => Carbon::parse($article->published_date)->translatedFormat('d-m-Y H:i'),
            'category_id' => $article->category_id,
            'created_at' => Carbon::parse($article->created_at)->translatedFormat('d-m-Y H:i'),
            'nb_views' => $article->nb_views,
            'content' => changeImagesUrlInContent($article->content),
            'category' => $article->category->name,
            'time_to_read_minutes' => $article->time_to_read_minutes
        ];

        return response()->json([
            'article' => $data
        ]);
    }
}
