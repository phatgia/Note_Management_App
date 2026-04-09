import React,{PropsWithChildren, useState, useRef, useEffect} from "react";
import NoteLayout from "@/layouts/note-layout";
import { Head, Link, useForm, router } from '@inertiajs/react';

import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function NoteDetail({ note }: any) {
    const { data, setData, put, processing, errors } = useForm({
        title: note.title,
        content: note.content,
        color: note.color || 'bg-white',
    });


    // Sửa
    const funcUpdate =(e: React.FormEvent) => {
        e.preventDefault();
        put(`/note-detail/${note.id}`); 
    };

    // Xóa
    const funcDelete =() =>{
        if(window.confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
            router.delete(`/note-detail/${note.id}`);
        }
    };

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
    

    return(
        <NoteLayout title={data.title} noteCount={0}>
            <div className="w-full bg-gray-100 min-h-screen pb-12 overflow-y-auto">
                <Head title="Chỉnh sửa ghi chú" />

                {/* Thanh Header: Nút Quay lại & Nút Hành động */}
                <div className="flex items-center justify-between sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-orange-50 transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-500 group-hover:text-orange-500 transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <span className="text-sm font-medium text-gray-500">
                            Cập nhật lần cuối: {new Date(note.updated_at).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>
                
                {/* Thông tin ghi chú */}
                <div className="max-w-7xl mx-auto p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">
                                    
                    {/* Trái*/}
                    <form className="flex-1 w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
                        
                        {/* Tiêu đề */}
                        <div>
                            <Label htmlFor="title" className="text-sm font-bold text-gray-700">Tiêu đề</Label>
                            <input 
                                id="title" 
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required 
                                placeholder="Nhập tiêu đề ghi chú..."
                                className="mt-2 w-full text-lg font-semibold bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Thanh công cụ định dạng*/}
                        <div className="flex items-center gap-4 border-y border-gray-100 py-3">
                            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                                <button type="button" className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors font-serif font-bold w-8 h-8 flex items-center justify-center">B</button>
                                <button type="button" className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors font-serif italic w-8 h-8 flex items-center justify-center">I</button>
                                <button type="button" className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors font-serif underline w-8 h-8 flex items-center justify-center">U</button>
                            </div>

                            <div className="flex items-center gap-1">
                            </div>
                        </div>

                        {/* Nội dung */}
                        <div>
                            <textarea 
                                id="content" 
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                required 
                                rows={10}
                                placeholder="Bắt đầu viết nội dung ghi chú của bạn ở đây..."
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 text-base leading-relaxed resize-y placeholder-gray-400 p-0"
                            />
                            <InputError message={errors.content} className="mt-2" />
                        </div>
                        {/* Nhãn */}
                        <div className="border-t flex items-center gap-3 p-3">
                            <Label className="text-sm text-gray-500 font-semibold">Nhãn</Label>
                            {/* Các loại nhãn */}
                            <div className="flex gap-3">
                                <div className="rounded-full bg-orange-200 p-1 pl-2 pr-2 flex items-center gap-2">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor" 
                                        className="w-5 h-5 text-orange-500"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.607.607 1.59.607 2.198 0l4.318-4.317a1.554 1.554 0 0 0 0-2.198l-9.581-9.58a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                    công việc
                                </div>

                                <div className="rounded-full bg-purple-200 p-1 pl-2 pr-2 flex items-center gap-2">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor" 
                                        className="w-5 h-5 text-purple-500"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.607.607 1.59.607 2.198 0l4.318-4.317a1.554 1.554 0 0 0 0-2.198l-9.581-9.58a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>                                    
                                    ý tưởng
                                </div>

                                <button className="text-sm border border-orange-300 border-dashed flex p-1 pl-2 pr-2 cursor-pointer rounded-full">
                                    <div className="flex items-center justify-center">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="currentColor" 
                                            className="w-5 h-5 text-orange-500 "
                                        >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" 
                                            clipRule="evenodd" 
                                        />
                                        </svg>
                                    </div>
                                    Thêm nhãn
                                </button>
                            </div>
                            {/* <div className="flex items-center gap-3 mt-3">
                                
                            </div> */}
                        </div>
                        {/* Ảnh và tệp đính kèm */}
                        <div className="border-t ">
                            <button type="button" className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-200 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                Thêm ảnh
                            </button>
                            <button type="button" className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-200 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                </svg>
                                Đính kèm
                            </button>
                        </div>

                        <div className="border-t p-3">
                            <Label className="text-sm text-gray-500 font-semibold">Màu nền</Label>
                            <div className="flex items-center gap-3 mt-3">
                                <button className="w-8 h-8 rounded-full border-2 border-orange-500 bg-white shadow-sm ring-2 ring-offset-1 ring-orange-200"></button>
                                <button className="w-8 h-8 rounded-full border border-gray-200 bg-blue-50 hover:scale-110 transition-transform"></button>
                                <button className="w-8 h-8 rounded-full border border-gray-200 bg-green-50 hover:scale-110 transition-transform"></button>
                                <button className="w-8 h-8 rounded-full border border-gray-200 bg-yellow-50 hover:scale-110 transition-transform"></button>
                            </div>
                        </div>
                    </form>

                    {/* Phải */}
                    <div className="w-full lg:w-80 space-y-6">
                        
                        {/* Khung Chia sẻ */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex items-center gap-3 bg-gray-50 border-b border-gray-200 px-5 py-3 font-bold text-gray-700 text-sm">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className="w-5 h-5 text-orange-500 group-hover:text-orange-500 transition-colors"
                                >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" 
                                />
                                </svg>
                                
                                Chia sẻ
                            </div>

                            <div className="flex items-center justify-between p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center bg-orange-500 rounded-full w-10 h-10">
                                        TA
                                    </div>
                                    <div className="">
                                        <h1>Trần Văn A</h1>
                                        <p className="text-xs">a@gmail.com</p>

                                    </div>
                                </div>

                                <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className=" cursor-pointer text-xs text-green-800 font-bold border rounded-full p-3 bg-green-200">
                                    Sửa
                                </button>


                                {isMenuOpen && (
                                    <div className="absolute w-48 bg-white border border-gray-200 rounded-xl shadow-lg ">
                                        <button 
                                            type="button"
                                            onClick={()=>{setIsMenuOpen(false); }}
                                            className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                            Đổi thành Chỉ xem
                                        </button>
                                        
                                        <div className="border-t border-gray-100 my-1"></div>
                                        
                                        <button 
                                            type="button"
                                            onClick={()=>{setIsMenuOpen(false);}}
                                            className="cursor-pointer px-4 py-2.5 text-sm text-red-600 hover:bg-red-50  flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                            </svg>
                                            Gỡ quyền truy cập
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t flex items-center justify-center">
                                <button className="flex items-center gap-3 cursor-pointer m-3 border border-gray-300 rounded-xl p-3 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Thêm người chia sẻ
                                </button>
                            </div>
                        </div>

                        {/* Lưu hoặc xóa*/}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                            <button 
                                onClick={funcUpdate}
                                disabled={processing}
                                className="mb-3 cursor-pointer border border-gray-200 w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
                            >
                                {/* {processing ? 'Đang lưu...' : 'Lưu ghi chú'}
                                {!processing && ( */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                {/* )} */}
                                Lưu ghi chú
                            </button>

                            <button 
                                onClick={funcDelete}
                                className="cursor-pointer border border-gray-200 w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Xóa
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </NoteLayout>
    );
}