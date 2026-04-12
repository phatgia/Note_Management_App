<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== auth()->id())
            abort(403);

        $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $category->update($request->only(['name', 'color', 'icon']));

        return back()->with('message', 'Đã cập nhật nhãn thành công!');
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== auth()->id())
            abort(403);
        $category->notes()->detach();
        $category->delete();

        return back()->with('message', 'Đã xóa nhãn!');
    }
}