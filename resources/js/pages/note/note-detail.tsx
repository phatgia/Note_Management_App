import React, { useMemo, useState, useRef, useEffect } from "react";
import NoteLayout from "@/layouts/note-layout";
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TAG_COLORS = [
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-pink-100 text-pink-700 border-pink-200',
];

const ICONS: Record<string, React.ReactNode> = {
    tag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.607.607 1.59.607 2.198 0l4.318-4.317a1.554 1.554 0 0 0 0-2.198l-9.581-9.58a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" /></svg>,
    star: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>,
    heart: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>,
    book: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3c-1.05 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>,
    folder: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>
};

const modules={
    toolbar: { container: "#my-custom-toolbar" }
};

const quillFomat =
    [['bold', 'italic', 'underline', 'strike'], 
        [{ 'color': [] }, { 'background': [] }],   
        ['link', 'image'],                        
        ['clean']
    ];

export default function NoteDetail({ auth, note, categories, isOwner, canEdit }: any) {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const { data: shareData, setData: setShareData, post: postShare, processing: sharing, errors: shareErrors, reset: resetShare } = useForm({
        email: '',
        role: 'viewer'
    });

    const handleShare = (e: React.FormEvent) => {
        e.preventDefault();
        postShare(`/note-detail/${note.id}/share`, {
            onSuccess: () => {
                setIsShareModalOpen(false);
                resetShare();
            }
        });
    };

    const [isLocked, setIsLocked] = useState(!!note?.password);
    const [unlockPassword, setUnlockPassword] = useState('');
    const [unlockError, setUnlockError] = useState('');

    const { data, setData, put, processing, errors } = useForm({
        title: note.title || '',
        content: note.content || '',
        category_ids: note.categories ? note.categories.map((c: any) => c.id) : [] as number[], 
        new_category_name: '',                     
        new_category_color: TAG_COLORS[0], 
        new_category_icon: 'tag', 
        bg_color: note.bg_color || 'bg-white',
        password: note.password || '',
    });

    const funcUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;
        put(`/note-detail/${note.id}`); 
    };

    const funcDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(`/note-detail/${note.id}`);
    };

    const toggleCategory = (id: number) => {
        if (!canEdit) return;
        let newIds = [...data.category_ids];
        if (newIds.includes(id)) {
            newIds = newIds.filter(item => item !== id); 
        } else {
            newIds.push(id); 
        }
        setData('category_ids', newIds);
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (unlockPassword === note.password) {
            setIsLocked(false);
            setUnlockError('');
        } else {
            setUnlockError('Mật khẩu không chính xác!');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <NoteLayout title={data.title}>
            <div className="w-full bg-[#F8F9FA] dark:bg-background min-h-screen pb-12 overflow-y-auto">
                <Head title={canEdit ? "Chỉnh sửa ghi chú" : "Xem ghi chú"} />

                {/* --- THANH TIÊU ĐỀ --- */}
                <div className="md:hidden h-30 flex items-center justify-between sticky top-0 bg-white dark:bg-card border-b border-gray-300 dark:border-gray-700 p-6 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Cập nhật lần cuối: {new Date(note.updated_at).toLocaleDateString('vi-VN')}
                        </span>
                        {!canEdit && (
                            <span className="ml-2 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-700">
                                Chỉ xem
                            </span>
                        )}
                    </div>
                </div>

                <div className="hidden md:flex  flex items-center justify-between sticky top-0 bg-white dark:bg-card border-b border-gray-300 dark:border-gray-700 p-6 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Cập nhật lần cuối: {new Date(note.updated_at).toLocaleDateString('vi-VN')}
                        </span>
                        {!canEdit && (
                            <span className="ml-2 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-700">
                                Chỉ xem
                            </span>
                        )}
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
                    
                    {/* Ổ KHÓA OVERLAY */}
                    {isLocked && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#F8F9FA]/50 dark:bg-background/50 backdrop-blur-md m-2 rounded-3xl">
                            <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center max-w-sm w-full mx-4 animate-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ghi chú bảo mật</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Vui lòng nhập mật khẩu để xem nội dung.</p>

                                <form onSubmit={handleUnlock}>
                                    <input 
                                        type="password" autoFocus
                                        value={unlockPassword} onChange={(e) => setUnlockPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu..." 
                                        className="w-full text-center tracking-widest bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 dark:text-white transition-colors"
                                    />
                                    {unlockError && <p className="text-red-500 text-xs mb-2 font-bold">{unlockError}</p>}
                                    
                                    <button type="submit" className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-2 shadow-sm">
                                        Mở khóa ngay
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={`flex flex-col lg:flex-row gap-6 items-start transition-all duration-500 ${isLocked ? 'blur-md pointer-events-none select-none opacity-40' : ''}`}>
                        
                        {/* CỘT TRÁI */}
                        <form className={`flex-1 w-full border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 space-y-6 transition-colors duration-500 ${data.bg_color}`}>
                            
                            {/* Tiêu đề */}
                            <div>
                                <Label htmlFor="title" className="text-sm font-bold text-gray-700 dark:text-gray-300">Tiêu đề</Label>
                                <input 
                                    readOnly={!canEdit}
                                    id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required placeholder="Nhập tiêu đề ghi chú..."
                                    className={`mt-2 w-full text-lg font-semibold border text-gray-900 dark:text-white rounded-xl px-4 py-3 transition-all backdrop-blur-sm ${!canEdit ? 'bg-transparent border-transparent focus:ring-0 px-0' : 'bg-white/60 dark:bg-gray-900/60 border-gray-200 focus:ring-2 focus:ring-orange-500'}`}
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Nội dung */}
                            <div>
                                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Nội dung</Label>
                                <div className={`bg-white/80 dark:bg-card backdrop-blur-sm rounded-lg transition-all ${!canEdit ? 'border-none' : 'border border-gray-300 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500'}`}>
                                    {canEdit && (
                                        <div id="my-custom-toolbar" className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
                                            <div className="flex items-center gap-1 bg-white dark:bg-card p-1 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm">
                                                <button type="button" className="ql-bold w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"></button>
                                                <button type="button" className="ql-italic w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"></button>
                                                <button type="button" className="ql-underline w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"></button>
                                                <button type="button" className="ql-strike w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"></button>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white dark:bg-card p-1 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm">
                                                <select className="ql-color"></select>
                                                <select className="ql-background"></select>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white dark:bg-card p-1 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm ml-auto">
                                                <button type="button" className="ql-clean w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"></button>
                                            </div>
                                        </div>
                                    )}
                                    <ReactQuill 
                                        readOnly={!canEdit}
                                        theme="snow" modules={modules} value={data.content} onChange={(value) => setData('content', value)}
                                        placeholder="Bắt đầu viết nội dung ghi chú của bạn ở đây..."
                                        className="border-none [&>.ql-container.ql-snow]:border-none [&>.ql-container]:text-base [&>.ql-container]:min-h-[250px] dark:text-white"
                                    />
                                </div>
                                <InputError message={errors.content} className="mt-2" />
                            </div>

                            <div className="border-t border-gray-200/60 flex flex-col gap-3 pt-4">
                                <Label className="text-sm text-card-foreground font-semibold">Ảnh</Label>
                                <div className="flex gap-3 flex-wrap items-center">
                                    <button className="text-orange-500 border border-orange-500 border-dashed rounded-lg p-3">
                                        <div className="flex justify-center ">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-orange-500">
                                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        Thêm ảnh
                                    </button>
                                </div>
                            </div>

                            {/* NHÃN */}
                            <div className="border-t border-gray-300/60 dark:border-gray-700/60 flex flex-col gap-3 pt-4">
                                <Label className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Nhãn</Label>
                                <div className="flex gap-3 flex-wrap items-center">
                                    {categories && categories.length > 0 && (
                                        categories.map((cat: any, index: number) => (
                                            <button 
                                                key={`${cat.id}-${index}`} type="button" onClick={() => toggleCategory(cat.id)}
                                                className={`rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium border transition-all ${cat.color ? cat.color : 'bg-gray-100 text-gray-700 border-gray-300'} ${data.category_ids.includes(cat.id) ? 'ring-2 ring-offset-2 ring-gray-400 scale-105 shadow-md' : (canEdit ? 'hover:scale-105 opacity-80 hover:opacity-100' : 'opacity-100 cursor-default')}`}
                                            >
                                                {ICONS[cat.icon] || ICONS['tag']} {cat.name || cat.Name} 
                                            </button>
                                        ))
                                    )}

                                    {canEdit && (
                                        isAddingTag ? (
                                            <div className="flex flex-col gap-2 bg-white dark:bg-card border border-gray-300 dark:border-gray-600 rounded-xl p-2 shadow-sm animate-in fade-in zoom-in duration-200">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" autoFocus placeholder="Tên nhãn mới..." value={data.new_category_name}
                                                        onChange={(e) => setData('new_category_name', e.target.value)}
                                                        className="text-sm border-none bg-transparent focus:ring-0 p-0 w-40 text-gray-700 dark:text-gray-200 placeholder-gray-400 font-medium"
                                                    />
                                                    <button type="button" onClick={() => { setIsAddingTag(false); setData('new_category_name', ''); }} className="ml-auto cursor-pointer text-gray-400 hover:text-red-500 p-1 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                                                    </button>
                                                </div>
                                                <div className="h-px w-full bg-gray-100 dark:bg-gray-700"></div>
                                                <div className="flex items-center gap-4 justify-between">
                                                    <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-700 pr-3">
                                                        {Object.keys(ICONS).map((iconKey) => (
                                                            <button key={iconKey} type="button" onClick={() => setData('new_category_icon', iconKey)} className={`p-1 rounded-md transition-all ${data.new_category_icon === iconKey ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-300' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                                                                {ICONS[iconKey]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {TAG_COLORS.map((colorClass, idx) => (
                                                            <button key={idx} type="button" onClick={() => setData('new_category_color', colorClass)} className={`w-5 h-5 rounded-full border transition-all ${colorClass.split(' ')[0]} ${colorClass.split(' ')[2]} ${data.new_category_color === colorClass ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'hover:scale-110'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => setIsAddingTag(true)} className="text-sm border border-orange-400 border-dashed bg-white dark:bg-card flex p-1.5 pl-2 pr-3 cursor-pointer rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors text-orange-600 font-medium items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg> Thêm nhãn
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Màu nền */}
                            {canEdit && (
                                
                                <div className="border-t border-gray-300/60 dark:border-gray-700/60 pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                    <Label className="text-sm text-gray-400 font-semibold">Màu nền</Label>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => setData('bg_color', 'bg-white')} className={`w-8 h-8 rounded-full border-2 bg-white shadow-sm transition-all ${data.bg_color === 'bg-white' ? 'border-orange-500 ring-4 ring-orange-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                        <button type="button" onClick={() => setData('bg_color', 'bg-blue-50')} className={`w-8 h-8 rounded-full border-2 bg-blue-50 shadow-sm transition-all ${data.bg_color === 'bg-blue-50' ? 'border-blue-500 ring-4 ring-blue-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                        <button type="button" onClick={() => setData('bg_color', 'bg-green-50')} className={`w-8 h-8 rounded-full border-2 bg-green-50 shadow-sm transition-all ${data.bg_color === 'bg-green-50' ? 'border-green-500 ring-4 ring-green-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                        <button type="button" onClick={() => setData('bg_color', 'bg-yellow-50')} className={`w-8 h-8 rounded-full border-2 bg-yellow-50 shadow-sm transition-all ${data.bg_color === 'bg-yellow-50' ? 'border-yellow-500 ring-4 ring-yellow-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* CỘT PHẢI */}
                        {(isOwner || canEdit) && (
                            <div className="w-full lg:w-80 space-y-6">
                                
                                {/* Khung Chia sẻ (Chỉ owner mới thấy) */}
                                {isOwner && (
                                    <div className="dark:bg-card bg-white border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="flex items-center gap-3 dark:bg-card bg-gray-50 border-b border-gray-300 dark:border-gray-700 px-5 py-3 font-bold text-gray-700 dark:text-gray-200 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500 group-hover:text-orange-500 transition-colors">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                            </svg>
                                            Chia sẻ
                                        </div>
                                        
                                        <div className="max-h-48 overflow-y-auto" ref={menuRef}>
                                            {note.shared_users && note.shared_users.length > 0 ? (
                                                note.shared_users.map((user: any, index: number) => (
                                                    <div key={`${user.id}-${index}`} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0 relative">
                                                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                                                            <div className="flex items-center justify-center bg-orange-500 text-white rounded-full w-10 h-10 font-bold shrink-0">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="dark:text-white overflow-hidden">
                                                                <h1 className="font-bold text-gray-800 dark:text-white truncate text-sm">{user.name}</h1>
                                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="relative">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} 
                                                                className={`cursor-pointer text-xs font-bold border rounded-full px-3 py-1 transition-colors ${user.pivot.role === 'editor' ? 'text-green-800 border-green-300 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'text-blue-800 border-blue-300 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'}`}
                                                            >
                                                                {user.pivot.role === 'editor' ? 'Sửa' : 'Xem'}
                                                            </button>

                                                            {openMenuId === user.id && (
                                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => { 
                                                                            setOpenMenuId(null); 
                                                                            router.put(`/note-detail/${note.id}/share/${user.id}`, { role: user.pivot.role === 'editor' ? 'viewer' : 'editor' }); 
                                                                        }} 
                                                                        className="w-full text-left cursor-pointer px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                                                                        Đổi thành {user.pivot.role === 'editor' ? 'Chỉ xem' : 'Được sửa'}
                                                                    </button>
                                                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => { 
                                                                            setOpenMenuId(null); 
                                                                            if(confirm(`Gỡ quyền truy cập của ${user.name}?`)) router.delete(`/note-detail/${note.id}/share/${user.id}`); 
                                                                        }} 
                                                                        className="w-full text-left cursor-pointer px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
                                                                        Gỡ quyền truy cập
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="p-5 text-sm text-gray-500 text-center italic">Chưa chia sẻ cho ai.</p>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 flex items-center justify-center p-3">
                                            <button onClick={() => setIsShareModalOpen(true)} type="button" className="flex items-center justify-center w-full gap-2 cursor-pointer border border-gray-300 dark:border-gray-600 rounded-xl p-2 text-sm text-gray-700 dark:text-gray-300 font-bold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-gray-800 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                                Thêm người chia sẻ
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Khung Hành Động và Mật khẩu (Chỉ editor mới thấy) */}
                                {canEdit && (
                                    <>
                                        <div className="bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-5 space-y-3 transition-colors">
                                            <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                                                Cài đặt Mật khẩu
                                            </Label>
                                            <input 
                                                type="password"
                                                placeholder="Để trống nếu không khóa..."
                                                value={data.password || ''}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="w-full text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-colors"
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                Đặt mật khẩu để bảo vệ ghi chú này. Không ai có thể xóa hay xem nội dung trừ khi nhập đúng mật khẩu.
                                            </p>
                                        </div>

                                        <div className="bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-5 space-y-3 transition-colors">
                                            <button 
                                                onClick={funcUpdate} disabled={processing}
                                                className="cursor-pointer w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                {processing ? 'Đang cập nhật...' : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                        Lưu thay đổi
                                                    </>
                                                )}
                                            </button>
                                            <button 
                                                onClick={funcDelete}
                                                className="cursor-pointer w-full py-3 px-4 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-200 dark:border-red-800/50"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                                Xóa ghi chú
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
            
            {/* Modal Chia sẻ */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Chia sẻ Ghi chú</h2>
                        <form onSubmit={handleShare} className="space-y-4">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email người nhận</Label>
                                <input 
                                    type="email" required autoFocus
                                    placeholder="ví dụ: nguyenvanb@gmail.com"
                                    value={shareData.email} onChange={e => setShareData('email', e.target.value)}
                                    className="mt-1 w-full text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-orange-500 dark:text-white"
                                />
                                <InputError message={shareErrors.email} className="mt-1" />
                            </div>
                            
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quyền hạn</Label>
                                <select 
                                    value={shareData.role} onChange={e => setShareData('role', e.target.value)}
                                    className="mt-1 w-full text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-orange-500 dark:text-white"
                                >
                                    <option value="viewer">Chỉ xem (Viewer)</option>
                                    <option value="editor">Được chỉnh sửa (Editor)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button type="button" onClick={() => { setIsShareModalOpen(false); resetShare(); }} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 font-bold rounded-xl transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" disabled={sharing} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                                    {sharing ? 'Đang gửi...' : 'Gửi lời mời'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận Xóa Ghi chú */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white text-center">Xóa ghi chú này?</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 leading-relaxed">
                            Hành động này không thể hoàn tác. Ghi chú sẽ bị xóa vĩnh viễn khỏi hệ thống của bạn và những người được chia sẻ.
                        </p>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="cursor-pointer flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 font-bold rounded-xl transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="button" onClick={confirmDelete} className="cursor-pointer flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm">
                                Xóa vĩnh viễn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NoteLayout>
    );
}