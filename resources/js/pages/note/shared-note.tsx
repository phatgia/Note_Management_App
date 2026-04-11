import React from 'react';
import NoteLayout from '@/layouts/note-layout';
import { Link } from '@inertiajs/react';
import { useViewMode } from '@/hooks/use-view-mode';

const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    return doc.body.textContent || "";
};

export default function SharedNote({ notes }: any) {
    const editorNotes = notes?.filter((note: any) => note.pivot.role === 'editor') || [];
    const viewerNotes = notes?.filter((note: any) => note.pivot.role === 'viewer') || [];
    
   const { viewMode, updateViewMode } = useViewMode();

    const gridView = () => {
        updateViewMode('grid');
    }

    const listview = () => {
        updateViewMode('list');
    }

    return (
        <NoteLayout title="Ghi chú được chia sẻ">
            {/* Thanh tiêu đề */}
            <div className="sticky top-0 bg-white dark:bg-card flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6 z-10 transition-colors">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ghi chú được chia sẻ</h1>
                
                <div className="flex items-center gap-4">
                    <button onClick={gridView} className={`cursor-pointer border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                    </button>

                    <button onClick={listview} className={`cursor-pointer border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 transition-colors ${viewMode === 'list' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                
                    <Link href="/create-note" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ghi chú mới
                    </Link>
                </div>
            </div>

            {/* === KHU VỰC: CÓ THỂ CHỈNH SỬA === */}
            <div className="mb-8">
                <div className="flex items-center gap-3 m-3 mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.158 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Có thể chỉnh sửa</p>
                    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {editorNotes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                        <svg className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-sm">Chưa có ghi chú nào được chia sẻ quyền chỉnh sửa.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 m-3" : "flex flex-col gap-4 m-3"}>
                        {editorNotes.map((note: any) => (
                            <Link href={`/note-detail/${note.id}`} key={note.id} className={`${note.bg_color || 'bg-white'} dark:bg-gray-800/90 border border-orange-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-orange-100 dark:bg-gray-900 border border-transparent dark:border-orange-500/30 text-orange-500 p-1.5 rounded-lg">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1" title={note.title}>{note.title}</h3>
                                
                                {note.password ? (
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium italic mt-3 mb-2 bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 w-max">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>
                                        <span className="text-xs">Ghi chú đã được bảo mật</span>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mt-2 mb-4 leading-relaxed">{stripHtml(note.content)}</p>
                                )}

                                {note.categories && note.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4 mt-2">
                                        {note.categories.map((cat: any) => (
                                            <span key={cat.id} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.color ? cat.color : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {cat.name || cat.Name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-auto pt-4 flex justify-between items-center">
                                    <p className="text-xs font-medium text-gray-400">{new Date(note.created_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* === KHU VỰC: CHỈ XEM === */}
            <div>
                <div className="flex items-center gap-3 m-3 mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Chỉ xem</p>
                    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {viewerNotes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                        <svg className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <p className="text-sm">Chưa có ghi chú nào được chia sẻ quyền xem.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 m-3" : "flex flex-col gap-4 m-3"}>
                        {viewerNotes.map((note: any) => (
                            <Link href={`/note-detail/${note.id}`} key={note.id} className={`${note.bg_color || 'bg-white'} dark:bg-gray-800/90 border border-orange-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-orange-100 dark:bg-gray-900 border border-transparent dark:border-orange-500/30 text-orange-500 p-1.5 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1" title={note.title}>{note.title}</h3>
                                
                                {note.password ? (
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium italic mt-3 mb-2 bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 w-max">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>
                                        <span className="text-xs">Ghi chú đã được bảo mật</span>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mt-2 mb-4 leading-relaxed">{stripHtml(note.content)}</p>
                                )}

                                {note.categories && note.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4 mt-2">
                                        {note.categories.map((cat: any) => (
                                            <span key={cat.id} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.color ? cat.color : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {cat.name || cat.Name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-auto pt-4 flex justify-between items-center">
                                    <p className="text-xs font-medium text-gray-400">{new Date(note.created_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </NoteLayout>
    );
}