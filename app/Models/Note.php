<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Note extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'image_path',
        'bg_color',
        'password',
        'is_pinned',
        'pinned_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
    public function sharedUsers()
    {
        return $this->belongsToMany(User::class, 'note_user')->withPivot('role')->withTimestamps();
    }
}
