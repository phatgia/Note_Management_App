import { Head, router } from '@inertiajs/react'
import React, { PropsWithChildren, useState, useRef, useEffect } from 'react';
import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';

type Props = {
    title: string;
    noteCount?: number;
};

export default function NoteLayout({ children, title, noteCount }: PropsWithChildren<Props>) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // State gửi xác thực mail
    const [processing, setProcessing] = useState(false);

    // State và Ref cho pop-up 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResend = () => {
        setProcessing(true);
        router.post('/email/verification-notification', {}, {
            onSuccess: () => {
                router.get('/verify-email'); 
            },
            onError: () => {
                alert('Lỗi! Không thể gửi mail lúc này. Vui lòng thử lại sau.');
                setProcessing(false); 
            },
        });
    };

    return (
        <div className="flex h-screen w-full bg-[#F8F9FA] overflow-hidden text-gray-800 font-sans">
            <Head title={title} />

            {/* Trái */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
                {/* Logo */}
                <div className="flex border-b border-gray-200 pb-4 px-4 py-9">
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                        <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                    </svg>
                    <p className="font-bold text-xl ml-2">Note Management</p>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="px-4 py-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm ghi chú..." 
                            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4">
                    <p className="text-xs font-semibold text-gray-400 mb-2 mt-2 uppercase tracking-wider">Danh mục</p>
                    <div className="flex items-center justify-between bg-orange-50 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1">
                        <div className="flex items-center gap-3">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-5 h-5 text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
                                />
                            </svg>
                            <span className="font-medium text-sm">Tất cả ghi chú</span>
                        </div>
                        <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {noteCount ?? 0}
                        </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-400 mb-2 mt-2 uppercase tracking-wider">Nhãn</p>
                </div>

                {/* Xác thực email */}
                <div className="p-4 border-t border-gray-200">
                    {user && user.email_verified_at === null && (
                        <div className="border rounded-full bg-orange-100 p-3 mb-3 text-xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-orange-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <p className="text-orange-800 font-medium whitespace-nowrap">Chưa xác minh email</p>
                            </div>

                            <button 
                                onClick={handleResend} 
                                disabled={processing} 
                                className="font-bold text-orange-500 hover:text-orange-700 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                                {processing ? 'Đang gửi...' : 'Gửi lại'}
                            </button>
                        </div>
                    )}
                    
                    {/* Hồ sơ người dùng */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="relative" ref={menuRef}>
                            {/* Popup Menu (Nổi lên trên khi isMenuOpen = true) */}
                            {isMenuOpen && (
                                <div className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                    <Link 
                                        href="/settings/profile" 
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
                                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                        </svg>
                                        Hồ sơ
                                    </Link>

                                    <Link 
                                        href="/settings/appearance" 
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            strokeWidth={1.5} 
                                            stroke="currentColor" 
                                            className="w-5 h-5 text-orange-500 hover:text-orange-500 transition-colors"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" 
                                            />
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                            />
                                        </svg>
                                        Cài đặt
                                    </Link>

                                    <button 
                                        onClick={() => router.post(logout())} 
                                        className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}

                            <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-between gap-2 cursor-pointer w-full text-left">
                                <div className="flex items-center gap-3 flex-1 overflow-hidden group">
                                    
                                    {user.avatar ? (
                                        <img 
                                            src={`/storage/${user.avatar}`} 
                                            alt="Avatar" 
                                            className="w-10 h-10 rounded-full object-cover border border-orange-200 shrink-0 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-lg group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>                           
                                    )}

                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-500 transition-colors">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </button>
                            
                        </div>
                    </div>
                </div>
            </aside>

            {/* Phải */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA]">
                {children}
            </main>
        </div>
    );
}