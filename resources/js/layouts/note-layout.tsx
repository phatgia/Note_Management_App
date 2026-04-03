import { Head, router } from '@inertiajs/react'
import React, { PropsWithChildren } from 'react';
import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
type Props = {
    title: string;
    noteCount?: number;
};

export default function NoteLayout({ children, title, noteCount }: PropsWithChildren<Props>) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    return (
        <div className="flex h-screen w-full bg-[#F8F9FA] overflow-hidden text-gray-800 font-sans">
            <Head title={title} />

            {/* Trái */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
                {/* Logo */}
                <div className="flex border-b border-gray-200 pb-4 px-4 py-9">
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Thân tờ giấy (Màu cam sáng) */}
                        <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                        {/* Góc gập (Màu cam đậm) */}
                        <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                    </svg>
                    <p className="font-bold text-xl">Note Management</p>
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
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                            <span className="font-medium text-sm">Tất cả ghi chú</span>
                        </div>
                        <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {noteCount ?? 0}
                        </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-400 mb-2 mt-2 uppercase tracking-wider">Nhãn</p>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold">
                            NA
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button onClick={() => router.post(logout())} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-orange-500 rounded-lg transition-colors border border-transparent hover:border-gray-200">
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