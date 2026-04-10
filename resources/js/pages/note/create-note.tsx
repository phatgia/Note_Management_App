import React, { useMemo, useState } from "react";
import NoteLayout from "@/layouts/note-layout";
import { Head, Link, useForm } from '@inertiajs/react';
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

export default function Create({ notes, categories }: any) {
    const [isAddingTag, setIsAddingTag] = useState(false);

   const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category_ids: [] as number[], 
        new_category_name: '',                     
        new_category_color: TAG_COLORS[0], 
        new_category_icon: 'tag', 
        bg_color: 'bg-white',               
    });

    const modules = useMemo(() => ({
        toolbar: { container: "#my-custom-toolbar" }
    }), []);
    const toggleCategory = (id: number) => {
        let newIds = [...data.category_ids];
        if (newIds.includes(id)) {
            newIds = newIds.filter(item => item !== id); 
        } else {
            newIds.push(id);
        }
        setData('category_ids', newIds);
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/note'); 
    };

    return (
        <NoteLayout title="Tạo ghi chú" noteCount={notes?.length || 0} categories={categories}>
            <div className="w-full bg-background min-h-screen pb-12 overflow-y-auto">
                <Head title="Tạo ghi chú" />

                {/* --- THANH TIÊU ĐỀ --- */}
                <div className="flex items-center gap-4 sticky top-0 bg-card border-b border-gray-200 p-6 z-10">
                    <Link href="/home" className="p-2 -ml-2 rounded-full transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="dark:text-orange-500 w-6 h-6 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-card-foreground">Tạo ghi chú mới</h1>
                </div>

                <div className="max-w-7xl mx-auto p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Trái*/}
                    <form onSubmit={submit} className="flex-1 w-full bg-card border border-gray-300 rounded-2xl shadow-sm p-6 space-y-6">
                        
                        {/* 1. Tiêu đề */}
                        <div>
                            <Label htmlFor="title" className="text-sm font-bold text-card-foreground">Tiêu đề</Label>
                            <input 
                                id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required placeholder="Nhập tiêu đề ghi chú..."
                                className="mt-2 w-full text-lg font-semibold bg-white/60 dark:bg-card dark:text-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* 2. Nội dung */}
                        <div>
                            <Label className="text-sm font-bold text-card-foreground mb-2 block">Nội dung</Label>
                            <div className="bg-white/80 dark:bg-card dark:text-white backdrop-blur-sm rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 transition-all">                               
                                {/* CUSTOM TOOLBAR */}
                                <div id="my-custom-toolbar" className="flex flex-wrap items-center gap-2 bg-white/50 dark:bg-card border-b border-gray-200 dark:border-border px-3 py-2 rounded-t-lg">                               
                                    <span className="ql-formats flex items-center bg-white dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm m-0">    
                                        <button type="button" className="ql-bold"></button>
                                        <button type="button" className="ql-italic"></button>
                                        <button type="button" className="ql-underline"></button>
                                        <button type="button" className="ql-strike"></button>
                                    </span>

                                    <span className="ql-formats flex items-center bg-white dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm m-0">
                                        <select className="ql-color"></select>
                                        <select className="ql-background"></select>
                                    </span>

                                    <span className="ql-formats flex items-center bg-white dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm m-0">
                                        <button type="button" className="ql-link"></button>
                                        <button type="button" className="ql-image"></button>
                                    </span>

                                    <span className="ql-formats flex items-center bg-white dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm m-0 ml-auto">
                                        <button type="button" className="ql-clean"></button>
                                    </span>
                                </div>

                                <ReactQuill 
                                    theme="snow" modules={modules} value={data.content} onChange={(value) => setData('content', value)}
                                    placeholder="Bắt đầu viết nội dung ghi chú của bạn ở đây..."
                                    className="border-none [&>.ql-container.ql-snow]:border-none [&>.ql-container]:text-base [&>.ql-container]:min-h-[250px]"
                                />
                            </div>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        {/* 3. KHU VỰC NHÃN & TẠO NHÃN MỚI TÍCH HỢP ICON */}
                        <div className="border-t border-gray-200/60 flex flex-col gap-3 pt-4">
                            <Label className="text-sm text-card-foreground font-semibold">Nhãn</Label>
                            
                            <div className="flex gap-3 flex-wrap items-center">
                                {/* Load danh sách nhãn cũ */}
                                {categories && categories.length > 0 && (
                                    categories.map((cat: any) => (
                                        <button 
                                            key={cat.id} type="button"
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium border transition-all 
                                                ${cat.color ? cat.color : 'bg-gray-100 text-gray-700 border-gray-200'} 
                                                ${data.category_ids.includes(cat.id) ? 'ring-2 ring-offset-2 ring-gray-400 scale-105 shadow-md' : 'hover:scale-105 opacity-80 hover:opacity-100'}
                                            `}
                                        >
                                            {ICONS[cat.icon] || ICONS['tag']}
                                            {cat.name || cat.Name} 
                                        </button>
                                    ))
                                )}

                                {/* Form tạo Nhãn mới */}
                                {isAddingTag ? (
                                    <div className="flex flex-col gap-2 bg-card border border-gray-300 rounded-xl p-2 shadow-sm animate-in fade-in zoom-in duration-200">
                                        
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="text" autoFocus placeholder="Tên nhãn mới..." value={data.new_category_name}
                                                onChange={(e) => {
                                                    setData('new_category_name', e.target.value);
                                                }}
                                                className="text-sm border-none bg-transparent focus:ring-0 p-0 w-40 text-gray-700 placeholder-gray-400 font-medium"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => { setIsAddingTag(false); setData('new_category_name', ''); }} 
                                                className="ml-auto dark:bg-card cursor-pointer text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-md"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                                            </button>
                                        </div>

                                        <div className="h-px w-full bg-gray-100"></div>

                                        <div className="flex items-center gap-4 justify-between">
                                            {/* Chọn Icon */}
                                            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                                                {Object.keys(ICONS).map((iconKey) => (
                                                    <button
                                                        key={iconKey} type="button"
                                                        onClick={() => setData('new_category_icon', iconKey)}
                                                        className={` cursor-pointer p-1 rounded-md transition-all ${data.new_category_icon === iconKey ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-300 ' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                                                    >
                                                        {ICONS[iconKey]}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Chọn Màu */}
                                            <div className="flex items-center gap-1.5">
                                                {TAG_COLORS.map((colorClass, idx) => (
                                                    <button
                                                        key={idx} type="button"
                                                        onClick={() => setData('new_category_color', colorClass)}
                                                        className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${colorClass.split(' ')[0]} ${colorClass.split(' ')[2]} ${data.new_category_color === colorClass ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'hover:scale-110'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        type="button" onClick={() => setIsAddingTag(true)}
                                        className="dark:bg-card text-sm border border-orange-500 border-dashed bg-white flex p-1.5 pl-2 pr-3 cursor-pointer rounded-full hover:bg-orange-50 transition-colors text-orange-600 font-medium items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                        </svg>
                                        Thêm nhãn
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 4. Màu nền bài viết */}
                        <div className="border-t border-gray-200/60 pt-4 flex items-center gap-6">
                            <Label className="text-sm text-card-foreground font-semibold">Màu nền</Label>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setData('bg_color', 'bg-white')} className={`w-8 h-8 rounded-full border-2 bg-white shadow-sm transition-all ${data.bg_color === 'bg-white' ? 'border-orange-500 ring-4 ring-orange-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                <button type="button" onClick={() => setData('bg_color', 'bg-blue-50')} className={`w-8 h-8 rounded-full border-2 bg-blue-50 shadow-sm transition-all ${data.bg_color === 'bg-blue-50' ? 'border-blue-500 ring-4 ring-blue-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                <button type="button" onClick={() => setData('bg_color', 'bg-green-50')} className={`w-8 h-8 rounded-full border-2 bg-green-50 shadow-sm transition-all ${data.bg_color === 'bg-green-50' ? 'border-green-500 ring-4 ring-green-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                                <button type="button" onClick={() => setData('bg_color', 'bg-yellow-50')} className={`w-8 h-8 rounded-full border-2 bg-yellow-50 shadow-sm transition-all ${data.bg_color === 'bg-yellow-50' ? 'border-yellow-500 ring-4 ring-yellow-100 scale-110' : 'border-gray-300 hover:scale-110'}`} />
                            </div>
                        </div>
                    </form>

                    {/* CỘT PHẢI */}
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-card border border-gray-300 rounded-2xl shadow-sm p-5">
                            <button onClick={submit} disabled={processing} className="cursor-pointer w-full py-3 px-4 bg-orange-500 dark:bg-card dark:border border-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                {processing ? 'Đang lưu...' : 'Lưu ghi chú'}
                                {!processing && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </NoteLayout>
    );
}