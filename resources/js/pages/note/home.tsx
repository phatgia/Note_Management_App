import React from 'react';
import NoteLayout from '@/layouts/note-layout';
import { Link } from '@inertiajs/react';

const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    return doc.body.textContent || "";
};
export default function Home({ notes,categories }: any) {
    return (
        <NoteLayout title="Tất cả ghi chú" noteCount={notes.length} categories={categories}>
            {/* Thanh tiêu đề và Nút tạo mới */}
            <div className="sticky top-0 bg-white flex items-center justify-between border-b border-gray-200 p-6 z-10">
                <h1 className="text-2xl font-bold text-gray-900">Tất cả ghi chú</h1>
                
                <div className="flex items-center gap-4">
                    <Link 
                        href="/create-note" 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ghi chú mới
                    </Link>
                </div>
            </div>

            {/* Tiêu đề phân mục */}
            <div className="flex items-center gap-3 m-3 mt-6">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-5 h-5 text-orange-500"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <p className="font-semibold text-gray-700">Sổ tay của bạn</p>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Khu vực hiển thị lưới Ghi chú */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 m-3">
                
                {/* Logic kiểm tra: Nếu mảng notes trống */}
                {!notes || notes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có ghi chú nào</p>
                        <p className="text-sm">Hãy bấm "Ghi chú mới" để bắt đầu nhé!</p>
                    </div>
                ) : (
                    notes.map((note: any) => (
                        <div key={note.id} className="bg-white border border-orange-200 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            
                            {/* Icon thẻ */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-orange-100 text-orange-500 p-2 rounded-lg">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Tiêu đề & Nội dung từ Database */}
                            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1" title={note.title}>
                                {note.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {stripHtml(note.content)}
                            </p>

                            {/* Nhãn Danh mục (Category) - Sẽ hiển thị nếu Ghi chú này có gắn Category */}
                            {note.category && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                                        {note.category.name}
                                    </span>
                                </div>
                            )}

                            {/* Ngày tháng tạo */}
                            <div className="border-t border-gray-100 mt-auto pt-4 flex justify-between items-center">
                                <p className="text-xs font-medium text-gray-400">
                                    {new Date(note.created_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </NoteLayout>
    );
}