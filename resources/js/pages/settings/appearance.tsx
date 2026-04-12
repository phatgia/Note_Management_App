import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import NoteSettingLayout from '@/layouts/note-setting-layout';
import { useFontSize } from '@/hooks/use-font-size';
import { useViewMode } from '@/hooks/use-view-mode';

export default function Appearance(){
    const {fontSize, updateFontSize} = useFontSize();
    const {viewMode, updateViewMode} = useViewMode();

    return (
        <div className="w-full bg-background min-h-screen pb-12">
            <Head title="Tùy chỉnh" />

            <div className="sticky top-0 md:hidden flex justify-center bg-card border-b border-gray-200 text-xl md:text-2xl text-card-foreground font-bold p-4 md:p-6.5 z-10 shadow-sm">
                <h1>Tùy chọn giao diện</h1>
            </div>

            <div className="sticky top-0 hidden md:flex  bg-card border-b border-gray-200 text-xl md:text-2xl text-card-foreground font-bold p-4 md:p-6.5 z-10 shadow-sm">
                <h1>Tùy chọn giao diện</h1>
            </div>

            <div className="max-w-3xl mx-auto mt-6 md:mt-10 px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="bg-card border border-gray-300 rounded-xl shadow-sm overflow-hidden w-full">
                    <div className="px-4 md:px-6 py-4 border-b border-gray-300 flex items-center justify-center md:justify-start gap-2 bg-gray-50/50 dark:bg-gray-800/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        <h2 className="font-bold text-card-foreground text-md">Giao diện</h2>
                    </div>

                    <div className="px-4 md:px-6 py-6 border-b border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="font-bold text-card-foreground">Chế độ tối</p>
                        <div className="flex w-full md:w-auto">
                            <AppearanceTabs />
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 border-b border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="font-bold text-card-foreground">Cỡ chữ</p>
                        <div className="text-xs sm:text-sm gap-2 flex flex-wrap w-full md:w-auto">
                            <button onClick={()=>updateFontSize('small')} className={`cursor-pointer flex-1 md:flex-none p-2 rounded-lg border px-4 transition-all font-medium ${
                                    fontSize === 'small' 
                                    ? "bg-orange-500 dark:bg-card text-white border-orange-500 shadow-sm" 
                                    : "bg-white dark:bg-card border-gray-300 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}>
                                Nhỏ
                            </button>

                            <button onClick={()=>updateFontSize('medium')} className={`cursor-pointer flex-1 md:flex-none p-2 rounded-lg border px-4 transition-all font-medium ${
                                    fontSize === 'medium' 
                                    ? "bg-orange-500 dark:bg-card text-white border-orange-500 shadow-sm" 
                                    : "bg-white dark:bg-card border-gray-300 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}>
                                Vừa
                            </button>

                            <button onClick={()=>updateFontSize('large')} className={`cursor-pointer flex-1 md:flex-none p-2 rounded-lg border px-4 transition-all font-medium ${
                                    fontSize === 'large' 
                                    ? "bg-orange-500 dark:bg-card text-white border-orange-500 shadow-sm" 
                                    : "bg-white dark:bg-card border-gray-300 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}>
                                Lớn
                            </button>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="font-bold text-card-foreground">Hiển thị mặc định</p>
                        <div className="text-xs sm:text-sm gap-4 flex w-full md:w-auto">
                            
                            <button onClick={()=>updateViewMode('grid')} className={`flex-1 md:flex-none flex justify-center items-center gap-2 border rounded-md px-6 py-2.5 transition-colors ${
                                viewMode === 'grid' ? "bg-orange-500 border-orange-500 text-white dark:bg-card dark:text-orange-500 shadow-sm" : "border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                                <span className="md:hidden font-medium">Lưới</span>
                            </button>

                            <button onClick={()=>updateViewMode('list')} className={`flex-1 md:flex-none flex justify-center items-center gap-2 border rounded-md px-6 py-2.5 transition-colors ${
                                viewMode === 'list' ? "bg-orange-500 border-orange-500 text-white dark:bg-card dark:text-orange-500 shadow-sm" : "border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                                <span className="md:hidden font-medium">Danh sách</span>
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