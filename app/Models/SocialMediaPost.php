<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialMediaPost extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'platform', 'content', 'post_url', 'post_date',
    ];

}
