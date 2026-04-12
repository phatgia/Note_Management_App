<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Note;

Broadcast::channel('note.{id}', function ($user, $id) {
    if (!$user) {
        return false;
    }

    $note = Note::find($id);
    if (!$note) {
        return false;
    }

    $isOwner = $note->user_id === $user->id;
    $isShared = $note->sharedUsers()->where('users.id', $user->id)->exists();

    if ($isOwner || $isShared) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar,
        ];
    }

    return false;
});