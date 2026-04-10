import {Head} from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import {edit as editAppearance} from '@/routes/appearance';
import NoteSettingLayout from '@/layouts/note-setting-layout';
import {useFontSize} from '@/hooks/use-font-size';
import {useViewMode} from '@/hooks/use-view-mode';


export default function Appearance() {
    const { fontSize, updateFontSize } = useFontSize();

    const { viewMode, updateViewMode } = useViewMode();
    return (
        <div className="w-full bg-background min-h-screen pb-12">
            <Head title="Tùy chỉnh"/>

            <div className=" sticky top-0 bg-background border-b border-gray-200 text-card-foreground  text-2xl font-bold p-6.5 z-10">
                <h1>Tùy chọn giao diện</h1>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-card border border-gray-300 rounded-xl shadow-sm overflow-hidden w-1/2 m-10">
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
                        <h2 className="font-bold text-card-foreground text-md">Giao diện</h2>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold text-card-foreground">Chế độ tối</p>
                        <AppearanceTabs/>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold text-card-foreground">Cỡ chữ</p>
                        <div className="text-xs gap-2 flex p-1">
                            <button onClick={()=>updateFontSize('small')} className={`cursor-pointer p-2 rounded-lg border pl-4 pr-4 transition-all font-medium ${
                                    fontSize === 'small' 
                                    ? "bg-orange-500 dark:bg-card text-white border-orange-500 shadow-sm" 
                                    : "bg-white dark:bg-card border-gray-300 dark:border-border text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}>
                                Nhỏ
                            </button>

                            <button onClick={()=>updateFontSize('medium')} className={`cursor-pointer p-2 rounded-lg border pl-4 pr-4 transition-all font-medium ${
                                    fontSize === 'medium' 
                                    ? "bg-orange-500 dark:bg-card text-white border-orange-500 shadow-sm" 
                                    : "bg-white dark:bg-card border-gray-300 dark:border-border text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}>
                                Vừa
                            </button>

                            <button onClick={()=>updateFontSize('large')} className={`cursor-pointer p-2 rounded-lg border pl-4 pr-4 transition-all font-medium ${
                                    fontSize === 'large' 
                                    ? "bg-orange-500 dark:bg-card text-white border-orange-500 shadow-sm" 
                                    : "bg-white dark:bg-card border-gray-300 dark:border-border text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}>
                                Lớn
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold text-card-foreground">Màu nền mặc định cho ghi chú</p>
                        <div className="gap-5 flex rounded-xl p-1">
                            <button className="w-8 h-8 cursor-pointer bg-white p-2 rounded-full border border-gray-400"></button>
                            <button className="w-8 h-8 cursor-pointer bg-orange-200 p-2 rounded-full border border-gray-400"></button>
                            <button className="w-8 h-8 cursor-pointer bg-blue-200 p-2 rounded-full border border-gray-400"></button>
                            <button className="w-8 h-8 cursor-pointer bg-pink-200 p-2 rounded-full border border-gray-400"></button>
                            <button className="w-8 h-8 cursor-pointer bg-red-200 p-2 rounded-full border border-gray-400"></button>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <p className="font-bold text-card-foreground">Hiển thị mặc định</p>
                        <div className="text-xs gap-5 flex rounded-xl p-1">
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
