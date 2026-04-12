import { Head, router, useForm } from '@inertiajs/react'
import React, { PropsWithChildren, useState, useRef, useEffect } from 'react';
import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';
import InputError from '@/components/input-error';

type Props = { title: string; };

const TAG_COLORS = [
    'bg-orange-100 text-orange-700 border-orange-200', 'bg-blue-100 text-blue-700 border-blue-200',
    'bg-green-100 text-green-700 border-green-200', 'bg-purple-100 text-purple-700 border-purple-200',
    'bg-pink-100 text-pink-700 border-pink-200', 'bg-gray-100 text-gray-700 border-gray-200'
];

const ICONS: Record<string, React.ReactNode> = {
    tag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.607.607 1.59.607 2.198 0l4.318-4.317a1.554 1.554 0 0 0 0-2.198l-9.581-9.58a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" /></svg>,
    star: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>,
    heart: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>,
    book: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3c-1.05 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>,
    folder: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>
};

export default function NoteLayout({ children, title }: PropsWithChildren<Props>) {
    const { auth, sidebarData, flash } = usePage().props as any;
    const user = auth.user;
    const categories = sidebarData?.categories || [];
    const noteCount = sidebarData?.noteCount || 0;
    const sharedCount = sidebarData?.sharedCount || 0;
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { url } = usePage();

    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const { data: otpData, setData: setOtpData, post: verifyOtp, processing: verifyingOtp, errors: otpErrors, reset: resetOtp } = useForm({ otp: '' });

    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [editingCatId, setEditingCatId] = useState<number | null>(null);
    const { data: catData, setData: setCatData, put: updateCat, processing: catProcessing, reset: resetCat } = useForm({ name: '', color: '', icon: '' });

    const toggleTheme = () => { updateAppearance(resolvedAppearance === 'light' ? 'dark' : 'light'); };

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (flash?.message) {
            setToast({ show: true, message: flash.message });
            const timer = setTimeout(() => setToast({ show: false, message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.message, flash?.uuid]);

    // --- OTP Handlers ---
    const handleSendOtp = () => {
        setSendingOtp(true);
        router.post('/otp/send', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSendingOtp(false);
                setIsOtpModalOpen(true);
            },
            onError: () => {
                setSendingOtp(false);
                alert("Lỗi gửi mail. Vui lòng kiểm tra lại cấu hình SMTP.");
            }
        });
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        verifyOtp('/otp/verify', {
            preserveScroll: true,
            onSuccess: () => {
                setIsOtpModalOpen(false);
                resetOtp();
            }
        });
    };

    // --- Label Handlers ---
    const startEditingCat = (cat: any) => {
        setEditingCatId(cat.id);
        setCatData({ name: cat.name || cat.Name, color: cat.color || TAG_COLORS[0], icon: cat.icon || 'tag' });
    };

    const saveCatEdit = (id: number) => {
        updateCat(`/categories/${id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingCatId(null)
        });
    };

    const deleteCat = (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa nhãn này? (Ghi chú thuộc nhãn này sẽ không bị xóa)")) {
            router.delete(`/categories/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-gray-800 font-sans">
            <Head title={title} />

            <aside className="w-64 bg-sidebar border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-colors shrink-0">
                <Link href="/home" className="cursor-pointer flex border-b border-gray-200 dark:border-gray-800 pb-4 px-4 py-9">
                    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                        <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                    </svg>
                    <p className="font-bold text-xl ml-2 text-card-foreground">Note Management</p>
                </Link>

                <div className="px-4 py-4">
                    <div className="relative">
                        <input 
                            type="text" placeholder="Tìm kiếm ghi chú..." 
                            className="w-full bg-background border border-gray-200 dark:border-gray-700 text-foreground text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                    <p className="text-xs font-semibold text-gray-400 mb-2 mt-2 uppercase tracking-wider">Danh mục</p>
                    
                    <Link href="/home" className={url === '/home' ? "flex items-center justify-between bg-orange-200 dark:bg-gray-800 dark:border border-orange-500 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1 hover:bg-orange-100 transition-colors" : "flex items-center justify-between bg-transparent dark:hover:bg-gray-800 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1 hover:bg-orange-100 transition-colors"}>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                            <span className="font-medium text-sm">Tất cả ghi chú</span>
                        </div>
                        <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{noteCount}</span>
                    </Link>

                    <Link href="/shared-note" className={url.startsWith('/shared-note') ? "flex items-center justify-between bg-orange-200 dark:bg-gray-800 dark:border border-orange-500 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1 hover:bg-orange-100 transition-colors" : "flex items-center justify-between bg-transparent dark:hover:bg-gray-800 text-orange-600 px-3 py-2 rounded-lg cursor-pointer mb-1 hover:bg-orange-100 transition-colors"}>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                            <span className="font-medium text-sm">Được chia sẻ</span>
                        </div>
                        <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{sharedCount}</span>
                    </Link>

                    <div className="flex items-center justify-between mt-4 mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nhãn</p>
                        <button onClick={() => setIsLabelModalOpen(true)} className="text-gray-400 hover:text-orange-500 transition-colors p-1" title="Quản lý Nhãn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-1 pb-4">
                        {categories && categories.length > 0 ? (
                            categories.map((cat: any, index: number) => {
                                const colorString = cat.color || '';
                                const textColorClass = colorString.split(' ').find((c: string) => c.startsWith('text-')) || 'text-gray-500';

                                return (
                                    <Link 
                                        key={`${cat.id}-${index}`} href={`/home?category_id=${cat.id}`} 
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors font-medium text-sm group ${url === `/home?category_id=${cat.id}` ? 'bg-orange-100 dark:bg-gray-800 border border-orange-200 dark:border-gray-700 text-orange-700 dark:text-orange-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <div className={`${textColorClass} group-hover:scale-110 transition-transform shrink-0`}>
                                            {ICONS[cat.icon] || ICONS['tag']}
                                        </div>
                                        <span className="flex-1 truncate group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                            {cat.name || 'Nhãn'}
                                        </span>
                                    </Link>
                                );
                            })
                        ) : (
                            <span className="text-sm text-gray-400 italic px-3">Chưa có nhãn nào</span>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
                    {/* NÚT CHƯA XÁC MINH EMAIL -> MỞ OTP */}
                    {user && user.email_verified_at === null && (
                        <div className="border border-orange-200 dark:border-orange-900/50 rounded-xl bg-orange-50 dark:bg-orange-900/20 p-3 mb-3 text-xs flex flex-col gap-2 shadow-sm">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                <p className="text-orange-800 dark:text-orange-400 font-medium whitespace-nowrap">Chưa xác minh email</p>
                            </div>
                            <button onClick={handleSendOtp} disabled={sendingOtp} className="w-full bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-500/30 font-bold text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 py-1.5 rounded-lg transition-colors cursor-pointer">
                                {sendingOtp ? 'Đang gửi mã...' : 'Nhập mã OTP ngay'}
                            </button>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between gap-2 relative" ref={menuRef}>
                        {isMenuOpen && (
                            <div className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                <Link href="/settings/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg> Hồ sơ
                                </Link>
                                <button onClick={() => router.post(logout())} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg> Đăng xuất
                                </button>
                            </div>
                        )}
                        <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-between gap-2 w-full text-left p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                            <div className="flex items-center gap-3 flex-1 overflow-hidden group">
                                {user.avatar ? (
                                    <img src={`/storage/${user.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-gray-800 text-orange-600 dark:text-orange-500 border border-orange-500 flex items-center justify-center font-bold text-lg shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>                          
                                )}
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-orange-500 transition-colors">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background relative min-w-0">
                {children}
                <button 
                    onClick={toggleTheme} suppressHydrationWarning={true}
                    className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:scale-110 transition-all duration-300 z-50 text-gray-500 dark:text-gray-400 hover:text-orange-500 cursor-pointer"
                >
                    {mounted ? ( resolvedAppearance === 'light' ? ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>) : ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>) ) : ( <div className="w-6 h-6"></div> )}
                </button>
            </main>

            {isOtpModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white text-center">Xác minh Email</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 leading-relaxed">
                            Một mã OTP gồm 6 chữ số đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
                        </p>
                        <form onSubmit={handleVerifyOtp}>
                            <input 
                                type="text" maxLength={6} required autoFocus
                                value={otpData.otp} onChange={e => setOtpData('otp', e.target.value)}
                                placeholder="Nhập 6 số OTP..." 
                                className="w-full text-center tracking-[0.5em] font-bold text-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 dark:text-white"
                            />
                            <InputError message={otpErrors.otp} className="mb-4 text-center" />
                            
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsOtpModalOpen(false)} className="cursor-pointer flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-xl font-bold transition-colors">Đóng</button>
                                <button type="submit" disabled={verifyingOtp} className="cursor-pointer flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50">
                                    {verifyingOtp ? 'Đang thử...' : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: LABEL MANAGER (CRUD) */}
            {isLabelModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý Nhãn</h2>
                            <button onClick={() => {setIsLabelModalOpen(false); setEditingCatId(null);}} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-2">
                            {categories.length === 0 ? <p className="text-center text-sm text-gray-500 italic py-4">Chưa có nhãn nào.</p> : null}
                            
                            {categories.map((cat: any) => (
                                <div key={cat.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col gap-3">
                                    {editingCatId === cat.id ? (
                                        <div className="flex flex-col gap-2">
                                            <input 
                                                type="text" value={catData.name} onChange={e => setCatData('name', e.target.value)} 
                                                className="w-full text-sm font-bold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:text-white focus:ring-1 focus:ring-orange-500" 
                                                autoFocus
                                            />
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1 shrink-0 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
                                                    {Object.keys(ICONS).map(iconKey => (
                                                        <button key={iconKey} type="button" onClick={() => setCatData('icon', iconKey)} className={`p-1 rounded-md ${catData.icon === iconKey ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-300' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{ICONS[iconKey]}</button>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
                                                    {TAG_COLORS.map((col, idx) => (
                                                        <button key={idx} type="button" onClick={() => setCatData('color', col)} className={`w-5 h-5 rounded-full border ${col.split(' ')[0]} ${col.split(' ')[2]} ${catData.color === col ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-1">
                                                <button onClick={() => setEditingCatId(null)} className="text-xs font-bold px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 cursor-pointer">Hủy</button>
                                                <button onClick={() => saveCatEdit(cat.id)} disabled={catProcessing} className="text-xs font-bold px-3 py-1.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 cursor-pointer">Lưu</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-2">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${cat.color ? cat.color : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                <span className="shrink-0">{ICONS[cat.icon] || ICONS['tag']}</span>
                                                <span className="truncate">{cat.name || cat.Name}</span>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button onClick={() => startEditingCat(cat)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors cursor-pointer" title="Sửa">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                                                </button>
                                                <button onClick={() => deleteCat(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors cursor-pointer" title="Xóa">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST THÔNG BÁO */}
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 ease-out flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl font-medium text-sm ${toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
                <div className="bg-green-500 text-white rounded-full p-1 shadow-inner"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></div>
                {toast.message}
            </div>
        </div>
    );
}