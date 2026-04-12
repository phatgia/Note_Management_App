import React,{useState, useEffect, useRef} from 'react';
import NoteLayout from '@/layouts/note-layout';
import { Link, usePage, router } from '@inertiajs/react';
import {useViewMode} from '@/hooks/use-view-mode';

const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    return doc.body.textContent || "";
};

export default function Home({ notes,categories }: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { viewMode, updateViewMode } = useViewMode();

    const { url } = usePage();

    const [searchQuery, setSearchQuery] = useState(() =>{
        return new URLSearchParams(window.location.search).get('search') || '';
    });

    useEffect(()=>{
            const delayDebounceFn = setTimeout(() => {
            const basePath = url.split('?')[0]; 
            router.get(basePath, {search: searchQuery}, {preserveState:true, replace:true});
        }, 300); 
        return () => clearTimeout(delayDebounceFn);
    },[searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)){
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return ()=> document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
            <NoteLayout title="Tất cả ghi chú">
            <div className="grid md:hidden sticky top-0 bg-card border-b border-gray-300 p-4 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Tất cả ghi chú</h1>
                    <div className="flex items-center gap-4">
                        {isMenuOpen && (
                            <div className="absolute top-20 right-2 w-50 p-3 bg-background border border-gray-300 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                <button onClick={()=>updateViewMode('grid')} className={viewMode ==='grid'?"mt-3 flex gap-2 items-center w-full bg-orange-500 dark:bg-card dark:border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"cursor-pointer mt-3 flex gap-2 items-center w-full border border-gray-500 rounded-md px-4 py-2"}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={1.5} 
                                        stroke="currentColor" 
                                        className={viewMode === 'grid'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}
                                    >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" 
                                    />
                                    </svg>
                                    <span className={viewMode === 'grid'?"font-bold text-white dark:text-orange-500":"font-bold text-gray-500"}>Lưới</span>
                                </button>

                                <button onClick={()=>updateViewMode('list')} className={viewMode ==='list'?"mt-3 flex gap-2 items-center w-full bg-orange-500 dark:bg-card dark:border-orange-500 border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"cursor-pointer mt-3 flex gap-2 items-center w-full border border-gray-500 rounded-md px-4 py-2"}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={1.5} 
                                        stroke="currentColor" 
                                        className={viewMode === 'list'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}
                                    >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
                                    />
                                    </svg>
                                    <span className={viewMode === 'list'?"font-bold text-white dark:text-orange-500":"font-bold text-gray-500"}>Danh sách</span>
                                </button>

                                <Link 
                                    href="/create-note" 
                                    className="mt-3 bg-3 bg-orange-500 dark:bg-card border border-orange-500 dark:text-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Ghi chú mới</span>
                                </Link>
                            </div>
                        )}

                        <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="bg-orange-500 dark:bg-card dark:border-orange-500 dark:text-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                    </div>
                </div>
                

                <div className="mt-3 flex md:hidden sticky top-0 bg-card items-center justify-center">
                    <div className="">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e)=>setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm ghi chú..." 
                                className="w-full bg-white dark:bg-background border border-gray-500 text-gray-500 dark:text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>



            <div className="hidden md:flex sticky top-0 bg-card flex items-center justify-between border-b border-gray-300 p-6 z-10">
                <h1 className="text-2xl font-bold text-foreground">Tất cả ghi chú</h1>
                
                <div className="flex items-center gap-4">
                    <button onClick={()=>updateViewMode('grid')} className={viewMode ==='grid'?"bg-orange-500 dark:bg-card dark:border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"border border-gray-500 rounded-md px-4 py-2"}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className={viewMode === 'grid'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}
                        >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" 
                        />
                        </svg>
                    </button>

                    <button onClick={()=>updateViewMode('list')} className={viewMode ==='list'?"bg-orange-500 dark:bg-card dark:border-orange-500 border-orange-500 cursor-pointer border border-gray-200 rounded-md px-4 py-2":"border border-gray-500 rounded-md px-4 py-2"}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className={viewMode === 'list'?"w-5 h-5 text-white bg-orange-500 dark:bg-card dark:text-orange-500 cursor-pointer":"w-5 h-5 text-gray-500 cursor-pointer"}
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
                        className="bg-orange-500 dark:bg-card border border-orange-500 dark:text-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm"
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
                <div className="flex-1 h-[1px] bg-gray-300"></div>
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
                        
                        <Link 
                            href={`/note-detail/${note.id}`} 
                            key={note.id} 
                            className={`${note.bg_color || 'bg-white'} dark:bg-gray-800/90 border border-orange-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                        >                            
                            {/* Icon thẻ */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-orange-100 dark:bg-card dark:border border-orange-500 text-orange-500 p-1 rounded-lg">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Tiêu đề & Nội dung từ Database */}
                            <h3 className="font-bold text-card-foreground text-lg mb-2 line-clamp-1" title={note.title}>
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
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mt-2 leading-relaxed">
                                    {note.content.replace(/(<([^>]+)>)/gi, "")}
                                </p>
                            )}

                           {note.categories && note.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                                    {note.categories.map((cat: any) => (
                                        <span 
                                            key={cat.id}
                                            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.color ? cat.color : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                        >
                                            {cat.name || cat.Name}
                                        </span>
                                    ))}
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