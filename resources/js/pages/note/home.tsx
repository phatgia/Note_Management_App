import React from 'react';
import NoteLayout from '@/layouts/note-layout';

export default function Home() {
    return (
        <NoteLayout title="Tất cả ghi chú">
            <div className="sticky top-0  bg-white flex items-center justify-between border-b border-gray-200 p-6">
                
                <h1 className="text-2xl font-bold text-gray-900">Tất cả ghi chú</h1>
                
                <div className="flex items-center gap-4">
                    {/* Nút Tạo ghi chú */}
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Ghi chú mới
                    </button>
                </div>
            </div>

            <>
                <div className="flex items-center gap-3 m-3">
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
                    <p>Đã ghim </p>
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 2xl:grid-cols-6 gap-6 m-3">
                    <div className=" border border-orange-300 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-md shadow-orange-200 hover:shadow-2xl  cursor-pointer">
                        {/* Icon */}
                        <div className="flex items-center gap-2 mb-4">
                            {/* Icon Ghim (Màu cam) */}
                            <div className="bg-orange-200 text-orange-500 p-1.5 rounded-lg">
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
                            </div>
                            {/* Icon Khóa (Màu tím) */}
                            <div className="bg-purple-100 text-purple-500 p-1.5 rounded-lg">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                        </div>

                        {/* Nội dung chữ */}
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Kế hoạch dự án cuối kỳ</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">Phân chia công việc, timeline và các mục tiêu cần đạt được trong tuần tới...</p>

                        {/* Các Nhãn*/}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">Công việc</span>
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">Ý tưởng</span>
                        </div>

                        {/* Chân thẻ (Ngày tháng) - mt-auto giúp nó luôn bám sát đáy */}
                        <div className="border-t border-orange-100 mt-auto pt-4">
                            <p className="text-xs font-medium text-gray-400">Hôm nay, 09:30</p>
                        </div>
                    </div>
                    
                    <div className=" border border-blue-300 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-md shadow-orange-200 hover:shadow-2xl cursor-pointer">
                        {/* Icon */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-orange-200 text-orange-500 p-1.5 rounded-lg">
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
                            </div>
                            {/* Icon Share (Màu xanh) */}
                            <div className="bg-blue-100 text-blue-500 p-1.5 rounded-lg">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                            </div>
                        </div>

                        {/* Nội dung chữ */}
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Meeting notes - Sprint 3</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">Các điểm thảo luận chính: API authentication, database schema, deployment pipeline...</p>

                        {/* Khu vực chứa 2 cái khung ảnh mờ */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#EBE9E2] h-20 rounded-xl flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                            </div>
                            <div className="bg-[#EBE9E2] h-20 rounded-xl flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                            </div>
                        </div>

                        {/* Chân thẻ */}
                        <div className="border-t border-blue-100 mt-auto pt-4">
                            <p className="text-xs font-medium text-gray-400">Hôm qua, 14:20</p>
                        </div>
                    </div>
                </div>
            </>


            <>
                <div className="flex items-center gap-3 m-3">
                    <p>Ghi chú khác</p>
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-6 2xl:grid-cols-6 gap-6 m-3">
                    <div className=" border border-orange-300 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-md shadow-orange-200 hover:shadow-2xl  cursor-pointer">
                        {/* Nội dung chữ */}
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Kế hoạch dự án cuối kỳ</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">Phân chia công việc, timeline và các mục tiêu cần đạt được trong tuần tới...</p>

                        {/* Các Nhãn*/}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">Công việc</span>
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">Ý tưởng</span>
                        </div>

                        {/* Chân thẻ (Ngày tháng) - mt-auto giúp nó luôn bám sát đáy */}
                        <div className="border-t border-orange-100 mt-auto pt-4">
                            <p className="text-xs font-medium text-gray-400">Hôm nay, 09:30</p>
                        </div>
                    </div>
                    
                    <div className=" border border-blue-300 rounded-2xl p-5 flex flex-col min-h-[16rem] shadow-md shadow-orange-200 hover:shadow-2xl cursor-pointer">
                        {/* Nội dung chữ */}
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Meeting notes - Sprint 3</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">Các điểm thảo luận chính: API authentication, database schema, deployment pipeline...</p>
                        {/* Chân thẻ */}
                        <div className="border-t border-blue-100 mt-auto pt-4">
                            <p className="text-xs font-medium text-gray-400">Hôm qua, 14:20</p>
                        </div>
                    </div>
                </div>
            </>
            
        </NoteLayout>
    );
}