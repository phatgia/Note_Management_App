import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';
import NoteSettingLayout from '@/layouts/note-setting-layout';

export default function Appearance() {
    return (
        <div className="w-full bg-[#F8F9FA] min-h-screen pb-12">
            <Head title="Tùy chỉnh"/>

            <div className=" sticky top-0 bg-white border-b border-gray-200  text-2xl font-bold p-6.5 z-10">
                <h1>Tùy chọn giao diện</h1>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden w-1/2 m-10">
                    <div className="text-2xl font-bold px-6 py-4 border-b border-gray-300 flex items-center gap-2">
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
                                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" 
                            />
                        </svg>
                        <h2 className="font-bold text-gray-800 text-md">Giao diện</h2>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold">Chế độ tối</p>
                        <AppearanceTabs/>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold">Cỡ chữ</p>
                        <div className="text-xs gap-2 flex p-1">
                            <button className="cursor-pointer bg-white p-2 rounded-lg border border-gray-400 pl-4 pr-4">Nhỏ</button>
                            <button className="cursor-pointer bg-orange-400 p-2 rounded-lg border border-gray-400 pl-4 pr-4">Vừa</button>
                            <button className="cursor-pointer bg-white p-2 rounded-lg border border-gray-400 pl-4 pr-4">Lớn</button>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold">Màu nền mặc định cho ghi chú</p>
                        <div className="gap-5 flex rounded-xl p-1">
                            <button className="cursor-pointer bg-white p-2 rounded-lg border border-gray-400"></button>
                            <button className="cursor-pointer bg-orange-200 p-2 rounded-lg border border-gray-400"></button>
                            <button className="cursor-pointer bg-blue-200 p-2 rounded-lg border border-gray-400"></button>
                            <button className="cursor-pointer bg-pink-200 p-2 rounded-lg border border-gray-400"></button>
                            <button className="cursor-pointer bg-red-200 p-2 rounded-lg border border-gray-400"></button>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold">Hiển thị mặc định</p>
                        <div className="text-xs gap-5 flex rounded-xl p-1">
                            <button className="cursor-pointer flex items-center gap-1 bg-white p-2 rounded-lg border border-gray-400">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className="w-5 h-5 text-gray-500 hover:text-orange-500 cursor-pointer transition-colors"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" 
                                    />
                                </svg>
                                Grid
                            </button>

                            <button className="cursor-pointer flex items-center gap-1 bg-orange-200 p-2 rounded-lg border border-orange-400">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className="w-5 h-5 text-gray-500 hover:text-orange-500 cursor-pointer transition-colors"
                                >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
                                />
                                </svg>
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

Appearance.layout = (page: React.ReactNode) => (
    <NoteSettingLayout title="Cài đặt">
        {page}
    </NoteSettingLayout>
);
