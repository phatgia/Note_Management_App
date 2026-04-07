import { Head, router } from '@inertiajs/react'
import React, { PropsWithChildren } from 'react';
import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import Home from '@/pages/note/home';
type Props = {
    title: string;
    // noteCount?: number;
};

export default function NoteSettingLayout({ children, title, }: PropsWithChildren<Props>) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    return (
        <div className="flex h-screen w-full bg-[#F8F9FA] overflow-hidden text-gray-800 font-sans">
            <Head title={title} />

            {/* Trái */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center border-b border-gray-200 pb-4 px-4 py-9">
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Thân tờ giấy (Màu cam sáng) */}
                        <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                        {/* Góc gập (Màu cam đậm) */}
                        <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                    </svg>
                    <p className="font-bold text-xl">Note Management</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4">
                    {/* Quay lại */}
                    <div className="flex items-center justify-between bg-orange-50 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1">
                        <Link href="/home" className="flex items-center gap-3 cursor-pointer">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-5 h-5 text-gray-500 hover:text-orange-500  transition-colors"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
                                />
                            </svg>
                            <span className="font-medium text-sm">Quay lại</span>
                        </Link>
                    </div>
                    {/* Hồ sơ cá nhân */}
                    <div className="flex items-center justify-between bg-orange-50 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1">
                        <Link href="/settings/profile" className="flex items-center gap-3 cursor-pointer">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-5 h-5 text-gray-500 hover:text-orange-500  transition-colors"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
                                />
                            </svg>
                            <span className="font-medium text-sm">Hồ sơ cá nhân</span>
                        </Link>
                    </div>
                    {/* Tùy chọn */}
                    <div className="flex items-center justify-between bg-orange-50 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1">
                        <Link href= "/settings/appearance" className="flex items-center gap-3 cursor-pointer">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-5 h-5 text-gray-500 hover:text-orange-500  transition-colors"
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
                            <span className="font-medium text-sm">Tùy chọn</span>
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => router.post(logout())} className="cursor-pointer hover:text-orange-600 text-orange-400 items-center flex gap-3 p-2 text-gray-400 hover:bg-gray-100 hover:text-orange-500 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                            <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={2} 
                                    stroke="currentColor" 
                                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            <span>Đăng xuất</span>
                        </button>
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