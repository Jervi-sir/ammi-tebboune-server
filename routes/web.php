<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Articles
Route::get('/article/publish', [ArticleController::class, 'showEditor'])->name('article.showEditor');
Route::post('/article/publish', [ArticleController::class, 'publish'])->name('article.publish');
Route::get('/articles', [ArticleController::class, 'listArticles'])->name('article.listArticles');
Route::get('/articles/{id}', [ArticleController::class, 'showArticle'])->name('article.showArticle');
Route::delete('/articles/{id}', [ArticleController::class, 'destroy'])->name('article.destroy');
Route::get('/articles/{id}/edit', [ArticleController::class, 'edit'])->name('article.edit');
Route::post('/articles/{id}/update', [ArticleController::class, 'update'])->name('article.update');

// Events
Route::get('/event/publish', [EventController::class, 'showEditor'])->name('event.showEditor');
Route::post('/event/publish', [EventController::class, 'publish'])->name('event.publish');
Route::get('/events/{id}', [ArticleController::class, 'showEvent'])->name('event.showEvent');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
