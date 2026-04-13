<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteImage extends Model
{
    // Bật cho phép điền hàng loạt
    protected $fillable = ['note_id', 'file_path'];

    // Khai báo mối quan hệ ngược lại: 1 Ảnh thuộc về 1 Ghi chú
    public function note()
    {
        return $this->belongsTo(Note::class);
    }
}