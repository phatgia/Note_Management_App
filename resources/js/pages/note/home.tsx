import React, { useState, useEffect, useRef } from 'react';
import NoteLayout from '@/layouts/note-layout';
import { Link, usePage, router } from '@inertiajs/react';
import { useViewMode } from '@/hooks/use-view-mode';

const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    return doc.body.textContent || "";
};

export default function Home({ notes, categories }: any) {
    const [isMenuNavBarOpen, setIsMenuNavBarOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { viewMode, updateViewMode } = useViewMode();
    
    const { url } = usePage();

    const [searchQuery, setSearchQuery] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('search') || '';
        }
        return '';
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const currentParams = new URLSearchParams(window.location.search);
            
            if (searchQuery) {
                currentParams.set('search', searchQuery);
            } else {
                currentParams.delete('search');
            }

            const basePath = url.split('?')[0]; 
            
            router.get(basePath, Object.fromEntries(currentParams), {
                preserveState: true, 
                replace: true
            });
        }, 300); 
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)){
                setIsMenuNavBarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return ()=> document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Hàm xử lý bấm nút Ghim
    const togglePin = (e: React.MouseEvent, noteId: number) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/notes/${noteId}/pin`, {}, { preserveScroll: true, preserveState: true });
    };

    const pinnedNote = notes?.filter((note:any)=>note.is_pinned) || [];
    const otherNote = notes?.filter((note:any)=>!note.is_pinned) || [];

    const showNote =(note: any, index: number)=>(
        <div key={`${note.id}-${index}`} className="relative group">   
            {/* NÚT GHIM KHI HOVER */}
           

            <Link 
                href={`/note-detail/${note.id}`} 
                className={`${note.bg_color || 'bg-white'} dark:bg-gray-800/90 border ${note.is_pinned ? 'border-orange-400 dark:border-orange-500/50 shadow-md ring-1 ring-orange-200 dark:ring-orange-900/30' : 'border-gray-200 dark:border-gray-700'} rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? "p-5 flex flex-col min-h-[18rem] max-h-[18rem]" : "p-3 sm:p-4 flex flex-row items-center gap-3 sm:gap-4"}`}
            >                  

                {viewMode === 'grid' ? (
                    <>
                        {/* Grid View: ICONS TRẠNG THÁI */}
                        <div className="flex items-center gap-2 mb-4">
                            <button 
                                onClick={(e) => togglePin(e, note.id)}
                                className={`absolute p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer 
                                    ${viewMode === 'grid' ? 'top-3 right-3' : '-translate-y-1/2 right-4'}
                                    ${note.is_pinned ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/50 opacity-100 shadow-sm' : 'text-gray-400 bg-white/80 dark:bg-gray-800/80 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'}
                                `}
                                title={note.is_pinned ? "Bỏ ghim" : "Ghim ghi chú"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill={note.is_pinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                            </button>

                            {/* Icon Note Mặc định */}
                            <div className="bg-orange-100 dark:bg-gray-900 border border-transparent dark:border-orange-500/30 text-orange-500 p-1.5 rounded-lg shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>
                            </div>
                            
                            {/* Icon Share */}
                            {note.shared_users && note.shared_users.length > 0 && (
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg shrink-0" title="Đã chia sẻ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                </div>
                            )}

                            {/* Icon Password */}
                            {note.password && (
                                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1.5 rounded-lg shrink-0" title="Có mật khẩu">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                </div>
                            )}
                        </div>

                        {/* Grid View: Tiêu đề & Nội dung */}
                        <h3 className="font-bold text-card-foreground text-lg mb-2 line-clamp-1 pr-8" title={note.title}>
                            {note.title}
                        </h3>
                        
                        {note.password ? (
                            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium italic mt-3 mb-2 bg-gray-50/50 dark:bg-gray-800/50 p-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 w-max">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">Ghi chú đã được bảo mật</span>
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mt-2 leading-relaxed break-words">
                                {stripHtml(note.content)}
                            </p>
                        )}

                        {/* Grid View: Nhãn */}
                        {note.categories && note.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4 mt-auto pt-4">
                                {note.categories.map((cat: any, catIndex: number) => (
                                    <span key={`${cat.id}-${catIndex}`} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.color ? cat.color : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {cat.name || cat.Name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Grid View: Ngày tháng tạo */}
                        <div className={`border-t border-gray-100 dark:border-gray-700 mt-auto pt-4 flex justify-between items-center ${(!note.categories || note.categories.length === 0) ? 'mt-4' : ''}`}>
                            <p className="text-xs font-medium text-gray-400">
                                {new Date(note.created_at).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* List View: ICONS TRẠNG THÁI */}
                        <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                            <div className="bg-orange-100 dark:bg-card border border-transparent dark:border-orange-500/30 text-orange-500 p-2.5 rounded-xl shrink-0">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                </svg>
                            </div>

                            <div className="flex gap-1">
                                {note.shared_users && note.shared_users.length > 0 && (
                                    <div className="text-blue-500" title="Đã chia sẻ"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></div>
                                )}
                                {note.password && (
                                    <div className="text-red-500" title="Có mật khẩu"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></div>
                                )}
                            </div>
                        </div>

                        {/* List View: Nội dung */}
                        <div className="flex-1 overflow-hidden pr-10"> {/* pr-10 để chừa chỗ cho nút Pin */}
                            <h3 className="font-bold text-card-foreground text-base truncate mb-0.5" title={note.title}>
                                {note.title}
                            </h3>
                            
                            {note.password ? (
                                <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 italic">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>
                                    <span className="text-[11px]">Đã bảo mật</span>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                                    {stripHtml(note.content)}
                                </p>
                            )}
                        </div>
                        
                        {/* List View: Nhãn và ngày tháng */}
                        <div className="flex flex-col items-end shrink-0 gap-1 pl-2 border-l border-gray-100 dark:border-gray-700 min-w-[120px]">
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                                {new Date(note.updated_at || note.created_at).toLocaleDateString('vi-VN')}
                            </p>
                            {note.categories && note.categories.length > 0 && (
                                <div className="flex gap-1 justify-end mt-1 max-w-[120px] overflow-hidden">
                                    {note.categories.slice(0, 2).map((cat: any, catIndex: number) => (
                                        <span key={`${cat.id}-${catIndex}`} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[60px] ${cat.color ? cat.color : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {cat.name || cat.Name}
                                        </span>
                                    ))}
                                    {note.categories.length > 2 && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">+{note.categories.length - 2}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-1 pl-2 border-l border-gray-100 dark:border-gray-700 min-w-2">
                            <button 
                                onClick={(e) => togglePin(e, note.id)}
                                className={`p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer 
                                    ${viewMode === 'list' ? 'top-3 right-3' : 'top-1/2 -translate-y-1/2 right-4'}
                                    ${note.is_pinned ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/50 opacity-100 shadow-sm' : 'text-gray-400 bg-white/80 dark:bg-gray-800/80 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'}
                                `}
                                title={note.is_pinned ? "Bỏ ghim" : "Ghim ghi chú"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill={note.is_pinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </Link>
        </div>
    );

    return (
        <NoteLayout title="Tất cả ghi chú">
            {/* Thanh trên cùng - Mobile */}
            <div className="grid md:hidden sticky top-0 bg-card border-b border-gray-300 dark:border-gray-800 p-4 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Tất cả ghi chú</h1>
                    <div className="flex items-center gap-4">
                        {isMenuNavBarOpen && (
                            <div className="absolute z-100 top-20 right-2 w-50 p-3 bg-background border border-gray-300 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                <button onClick={()=>updateViewMode('grid')} className={viewMode ==='grid'?"mt-3 flex gap-2 items-center w-full bg-orange-500 dark:bg-card dark:border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"cursor-pointer mt-3 flex gap-2 items-center w-full border border-gray-500 rounded-md px-4 py-2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={viewMode === 'grid'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                    </svg>
                                    <span className={viewMode === 'grid'?"font-bold text-white dark:text-orange-500":"font-bold text-gray-500"}>Lưới</span>
                                </button>
                                <button onClick={()=>updateViewMode('list')} className={viewMode ==='list'?"mt-3 flex gap-2 items-center w-full bg-orange-500 dark:bg-card dark:border-orange-500 border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"cursor-pointer mt-3 flex gap-2 items-center w-full border border-gray-500 rounded-md px-4 py-2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={viewMode === 'list'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span className={viewMode === 'list'?"font-bold text-white dark:text-orange-500":"font-bold text-gray-500"}>Danh sách</span>
                                </button>
                                <Link href="/create-note" className="mt-3 bg-3 bg-orange-500 dark:bg-card border border-orange-500 dark:text-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    <span>Ghi chú mới</span>
                                </Link>
                            </div>
                        )}
                        <button onClick={()=>setIsMenuNavBarOpen(!isMenuNavBarOpen)} className="bg-orange-500 dark:bg-card dark:border-orange-500 dark:text-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        </button>
                    </div>
                </div>
                
                <div className="mt-3 flex md:hidden sticky top-0 bg-card items-center justify-center">
                    <div className="w-full">
                        <div className="relative">
                            <input 
                                type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm ghi chú..." 
                                className="w-full bg-white dark:bg-background border border-gray-500 text-gray-500 dark:text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thanh trên cùng - Desktop */}
            <div className="hidden md:flex sticky top-0 bg-card items-center justify-between border-b border-gray-300 dark:border-gray-800 p-6 z-10">
                <h1 className="text-2xl font-bold text-foreground">Tất cả ghi chú</h1>
                <div className="flex items-center gap-4">
                    <button onClick={()=>updateViewMode('grid')} className={viewMode ==='grid'?"bg-orange-500 dark:bg-card dark:border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"border border-gray-500 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={viewMode === 'grid'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                    </button>
                    <button onClick={()=>updateViewMode('list')} className={viewMode ==='list'?"bg-orange-500 dark:bg-card dark:border-orange-500 border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"border border-gray-500 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={viewMode === 'list'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                    <Link href="/create-note" className="bg-orange-500 dark:bg-card border border-orange-500 dark:text-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span>Ghi chú mới</span>
                    </Link>
                </div>
            </div>

            {/* Ghi chú đã ghim */}
            <div className="mb-10">
                {!notes || notes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có ghi chú nào</p>
                        <p className="text-sm">Hãy bấm "Ghi chú mới" để bắt đầu nhé!</p>
                    </div>
                ) : (
                    <>
                        {pinnedNote.length>0 &&(
                            <div className="mb-8">
                                <div className="flex items-center gap-3 m-3 mt-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                                    <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">Đã ghim</p>
                                    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
                                </div>
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 m-3" : "flex flex-col gap-4 m-3"}>
                                    {pinnedNote.map((note: any, index: number) => showNote(note, index))}
                                </div>
                            </div>
                        )}

                        {otherNote.length>0 &&(
                            <div className="mb-8">
                                <div className="flex items-center gap-3 m-3 mt-6">
                                    <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">Các ghi chú khác</p>
                                    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
                                </div>
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6 m-3" : "flex flex-col gap-4 m-3"}>
                                    {otherNote.map((note: any, index: number) => showNote(note, index))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
                        
        </NoteLayout>
    );
}