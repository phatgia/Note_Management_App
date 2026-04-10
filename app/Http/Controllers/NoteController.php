<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $categories = \App\Models\Category::all();

        $query = Note::with('categories')
            ->where('user_id', auth()->id())
            ->latest();

        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        $notes = $query->get();

        return Inertia::render('note/home', [
            'notes' => $notes,
            'categories' => $categories,
            'currentCategoryId' => $request->category_id,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\Category::all();
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
            'image_path' => 'nullable|string',
            'password' => 'nullable|string'
        ]);

        $categoryIds = $request->category_ids ?? [];

        if ($request->filled('new_category_name')) {
            $newCategory = \App\Models\Category::create([
                'name' => $request->new_category_name,
                'color' => $request->new_category_color,
                'icon' => $request->new_category_icon,
            ]);
            $categoryIds[] = $newCategory->id;
        }

        $note = $request->user()->notes()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'bg_color' => $validated['bg_color'] ?? 'bg-white',
            'image_path' => $validated['image_path'] ?? null,
            'password' => $validated['password'] ?? null,
        ]);

        $note->categories()->sync($categoryIds);

        return redirect()->route('notes.index')
            ->with('message', 'Tạo ghi chú thành công!');
    }

    public function show(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->load('categories');

        $categories = \App\Models\Category::all();

        return Inertia::render('note/note-detail', [
            'note' => $note,
            'categories' => $categories,
        ]);
    }

    public function edit(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Bạn không có quyền sửa ghi chú này!');
        }

        $note->load('categories');
        $categories = Category::all();

        return Inertia::render('note/edit', [
            'note' => $note,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
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
        ]);

        $categoryIds = $request->category_ids ?? [];

        if ($request->filled('new_category_name')) {
            $newCategory = \App\Models\Category::create([
                'name' => $request->new_category_name,
                'color' => $request->new_category_color,
                'icon' => $request->new_category_icon,
            ]);
            $categoryIds[] = $newCategory->id;
        }

        $note->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'bg_color' => $validated['bg_color'] ?? 'bg-white',
            'password' => $validated['password'],
        ]);

        $note->categories()->sync($categoryIds);

        return redirect()->route('notes.index')
            ->with('message', 'Đã cập nhật ghi chú thành công!');
    }

    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->delete();

        return redirect()->route('notes.index')
            ->with('message', 'Ghi chú đã được đưa vào hư vô!');
    }
}