import React,{useState} from 'react';
import NoteLayout from '@/layouts/note-layout';
import { Link } from '@inertiajs/react';

const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    return doc.body.textContent || "";
};



export default function Home({ notes,categories }: any) {

    const [viewMode, setViewMode] = useState('grid');


    const gridView =()=>{
        setViewMode('grid');
    }

    const listview =()=>{
        setViewMode('list');
    }
    return (
        <NoteLayout title="Tất cả ghi chú" noteCount={notes.length} categories={categories}>
            {/* Thanh tiêu đề và Nút tạo mới */}
            <div className="sticky top-0 bg-background flex items-center justify-between border-b border-gray-200 p-6 z-10">
                <h1 className="text-2xl font-bold text-foreground">Tất cả ghi chú</h1>
                
                <div className="flex items-center gap-4">
                    <button onClick={gridView} className="bg-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-5 h-5 text-white cursor-pointer transition-colors"
                        >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" 
                        />
                        </svg>
                    </button>

                    <button onClick={listview} className="bg-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-5 h-5 text-white cursor-pointer transition-colors"
                        >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
                        />
                        </svg>
                    </button>

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
                <p className="font-semibold text-muted-foreground">Đã ghim</p>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Khu vực hiển thị lưới Ghi chú */}
            <div className={viewMode === 'grid'?"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 m-3": "flex flex-col gap-4 m-3"}>
                
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
                        
                        <Link href={`/note-detail/${note.id}`} key={note.id} className="bg-card border border-orange-200 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            
                            {/* Icon thẻ */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-orange-100 text-orange-500 p-1 rounded-lg">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Tiêu đề & Nội dung từ Database */}
                            <h3 className="font-bold text-card-foreground text-lg mb-2 line-clamp-1" title={note.title}>
                                {note.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
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
                        </Link>
                    ))
                )}
            </div>
        </NoteLayout>
    );
}