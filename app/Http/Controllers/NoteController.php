<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Models\Category;
use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $categories = \App\Models\Category::where('user_id', auth()->id())->orWhereNull('user_id')->get();

        $notesQuery = Note::with(['categories', 'sharedUsers'])
            ->where('user_id', auth()->id())
            ->orderByDesc('is_pinned')
            ->orderByDesc('pinned_at')
            ->orderByDesc('updated_at');

        if ($request->filled('category_id')) {
            $notesQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        $notes = $notesQuery->get();

        return Inertia::render('note/home', [
            'notes' => $notes,
            'categories' => $categories,
            'currentCategoryId' => $request->category_id,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\Category::where('user_id', auth()->id())
            ->orWhereNull('user_id')
            ->get();

        $notes = \App\Models\Note::where('user_id', auth()->id())->get();

        return Inertia::render('note/create-note', [
            'categories' => $categories,
            'notes' => $notes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'new_category_name' => 'nullable|string|max:50',
            'new_category_color' => 'nullable|string',
            'new_category_icon' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'password' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $categoryIds = $request->category_ids ?? [];

        if ($request->filled('new_category_name')) {
            $newCategory = \App\Models\Category::create([
                'user_id' => auth()->id(),
                'name' => $request->new_category_name,
                'color' => $request->new_category_color,
                'icon' => $request->new_category_icon,
            ]);
            $categoryIds[] = $newCategory->id;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('notes', 'public');
        }

        $note = $request->user()->notes()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'bg_color' => $validated['bg_color'] ?? 'bg-white',
            'image_path' => $imagePath,
            'password' => $validated['password'] ?? null,
        ]);

        $note->categories()->sync($categoryIds);

        return redirect()->route('notes.index')
            ->with('message', 'Tạo ghi chú thành công!');
    }

    public function show(Note $note)
    {
        $isOwner = $note->user_id === auth()->id();
        $sharedUser = $note->sharedUsers()->where('user_id', auth()->id())->first();

        if (!$isOwner && !$sharedUser) {
            abort(403, 'Bạn không có quyền xem ghi chú này!');
        }

        $note->load(['categories', 'sharedUsers']);

        $categories = \App\Models\Category::where('user_id', auth()->id())
            ->orWhereNull('user_id')
            ->get();

        $canEdit = $isOwner || ($sharedUser && $sharedUser->pivot->role === 'editor');

        return Inertia::render('note/note-detail', [
            'note' => $note,
            'categories' => $categories,
            'isOwner' => $isOwner,
            'canEdit' => $canEdit,
        ]);
    }

    public function edit(Note $note)
    {
        $isOwner = $note->user_id === auth()->id();
        $isEditor = $note->sharedUsers()->where('user_id', auth()->id())->wherePivot('role', 'editor')->exists();

        if (!$isOwner && !$isEditor) {
            abort(403, 'Bạn không có quyền sửa ghi chú này!');
        }

        $note->load('categories');
        $categories = \App\Models\Category::where('user_id', auth()->id())->get();
        return Inertia::render('note/edit', [
            'note' => $note,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Note $note)
    {
        $isOwner = $note->user_id === auth()->id();
        $isEditor = $note->sharedUsers()->where('user_id', auth()->id())->wherePivot('role', 'editor')->exists();

        if (!$isOwner && !$isEditor) {
            abort(403, 'Bạn không có quyền sửa ghi chú này!');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'new_category_name' => 'nullable|string|max:50',
            'new_category_color' => 'nullable|string',
            'new_category_icon' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'password' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Validate file ảnh
        ]);

        $categoryIds = $request->category_ids ?? [];

        if ($request->filled('new_category_name')) {
            $newCategory = \App\Models\Category::create([
                'user_id' => auth()->id(),
                'name' => $request->new_category_name,
                'color' => $request->new_category_color,
                'icon' => $request->new_category_icon,
            ]);
            $categoryIds[] = $newCategory->id;
        }

        $updateData = [
            'title' => $validated['title'],
            'content' => $validated['content'],
            'bg_color' => $validated['bg_color'] ?? 'bg-white',
            'password' => $validated['password'] ?? null,
        ];

        if ($request->hasFile('image')) {
            if ($note->image_path) {
                Storage::disk('public')->delete($note->image_path);
            }
            // Lưu ảnh mới
            $updateData['image_path'] = $request->file('image')->store('notes', 'public');
        }

        $note->update($updateData);

        $note->categories()->sync($categoryIds);

        return back()->with('message', 'Đã cập nhật ghi chú thành công!');
    }

    public function removeImage(Note $note)
    {
        $isOwner = $note->user_id === auth()->id();
        $isEditor = $note->sharedUsers()->where('user_id', auth()->id())->wherePivot('role', 'editor')->exists();

        if (!$isOwner && !$isEditor) {
            abort(403, 'Bạn không có quyền xóa ảnh này!');
        }

        if ($note->image_path) {
            Storage::disk('public')->delete($note->image_path); 
            $note->update(['image_path' => null]); 
        }

        return back()->with('message', 'Đã xóa ảnh đính kèm!');
    }

    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Chỉ chủ bài viết mới có quyền xóa!');
        }

        if ($note->image_path) {
            Storage::disk('public')->delete($note->image_path);
        }

        $note->delete();

        return redirect()->route('notes.index')
            ->with('message', 'Ghi chú đã được đưa vào hư vô!');
    }

    public function share(Request $request, Note $note)
    {
        if ($note->user_id !== auth()->id())
            abort(403);

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:viewer,editor'
        ], [
            'email.exists' => 'Không tìm thấy tài khoản với email này trong hệ thống.'
        ]);

        $userToShare = \App\Models\User::where('email', $request->email)->first();

        if ($userToShare->id === auth()->id()) {
            return back()->withErrors(['email' => 'Bạn không thể tự chia sẻ cho chính mình!']);
        }

        $note->sharedUsers()->syncWithoutDetaching([
            $userToShare->id => ['role' => $request->role]
        ]);

        return back()->with('message', 'Đã chia sẻ thành công!');
    }

    public function updateShare(Request $request, Note $note, \App\Models\User $user)
    {
        if ($note->user_id !== auth()->id())
            abort(403);

        $note->sharedUsers()->updateExistingPivot($user->id, ['role' => $request->role]);
        return back();
    }

    public function removeShare(Note $note, \App\Models\User $user)
    {
        if ($note->user_id !== auth()->id())
            abort(403);

        $note->sharedUsers()->detach($user->id);
        return back();
    }

    public function sharedNotes()
    {
        $notes = auth()->user()->sharedNotes()->with('categories')->latest()->get();

        return Inertia::render('note/shared-note', [
            'notes' => $notes
        ]);
    }
    
    public function togglePin(Note $note)
    {
        if ($note->user_id !== auth()->id())
            abort(403);

        $note->update([
            'is_pinned' => !$note->is_pinned,
            'pinned_at' => !$note->is_pinned ? now() : null,
        ]);

        return back();
    }
}