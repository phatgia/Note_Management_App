<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;
class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = Note::where('user_id', auth()->id())
            ->latest()
            ->get();
        return Inertia::render('note/home', ['notes' => $notes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('note/create-note', ['category' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'image_path' => 'nullable|string',
            'password' => 'nullable|string'
        ]);

        $request->user()->notes()->create($validated);

        return redirect()->route('notes.index')
            ->with('message', 'Tạo ghi chú thành công!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->load('category');

        return Inertia::render('note/show', [
            'note' => $note
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        // Tránh việc user này gõ URL lấy id để sửa ghi chú của user khác
        if ($note->user_id !== auth()->id()) {
            abort(403, 'Bạn không có quyền sửa ghi chú này!');
        }

        $categories = Category::all();
        return Inertia::render('note/edit', [
            'note' => $note,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $note->update($validated);

        return redirect()->route('notes.index')
            ->with('message', 'Đã cập nhật ghi chú thành công!');
    }

    /**
     * Remove the specified resource from storage.
     */
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
