<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $query = Article::query();

        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        $articles = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $data = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'summary' => $article->summary,
                'thumbnail' => url('/storage/' . $article->thumbnail),
                'published_date' => Carbon::parse($article->published_date)->translatedFormat('d-m-Y H:i'),
                'category_id' => $article->category_id,
                'created_at' => Carbon::parse($article->created_at)->translatedFormat('d-m-Y H:i'),
                'nb_views' => $article->nb_views,
                'category' => $article->category->name,
            ];
        });

        return response()->json([
            'data' => $data,
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
            'content' => $article->content,
            'category' => $article->category->name,
        ];

        return response()->json($data);
    }
}
