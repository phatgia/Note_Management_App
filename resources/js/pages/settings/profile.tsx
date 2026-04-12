import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import NoteSettingLayout from '@/layouts/note-setting-layout';

export default function Profile({
    mustVerifyEmail,
    status,
}:{
    mustVerifyEmail: boolean;
    status?: string;
}){
    const {auth} = usePage().props as any;
    const user = auth.user;
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    const {data, setData, post, processing, recentlySuccessful, errors} = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,  
        remove_avatar: false,         
        _method: 'patch',             
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file); 
            setData('remove_avatar', false);
            setPreviewPhoto(URL.createObjectURL(file)); 
        }
    };

    const handleRemovePhoto = () =>{
        setData('avatar', null); 
        setData('remove_avatar', true); 
        setPreviewPhoto(null); 
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }
    };

    const submitForm = (e: React.FormEvent) =>{
        e.preventDefault();
        post('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewPhoto(null); 
            }
        });
    };

    return (
        <div className="w-full bg-background min-h-screen pb-12">
            <Head title="Hồ sơ cá nhân" />

            <div className="sticky top-0 md:hidden flex justify-center bg-card border-b border-gray-200 text-xl md:text-2xl text-card-foreground font-bold p-4 md:p-6.5 z-10 shadow-sm">
                <h1>Hồ sơ cá nhân</h1>
            </div>

            <div className="sticky top-0 hidden md:flex  bg-card border-b border-gray-200 text-xl md:text-2xl text-card-foreground font-bold p-4 md:p-6.5 z-10 shadow-sm">
                <h1>Hồ sơ cá nhân</h1>
            </div>

            <div className="max-w-3xl mx-auto mt-6 md:mt-10 px-4 sm:px-6 lg:px-8 space-y-8">            
                {/*Hồ sơ*/}
                <div className="bg-card border border-gray-300 rounded-xl shadow-sm overflow-hidden w-full">
                    <div className="text-card-foreground px-4 md:px-6 py-4 border-b border-gray-300 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        <h2 className="font-bold text-card-foreground text-md">Thông tin cá nhân</h2>
                    </div>

                    <form onSubmit={submitForm} className="text-card-foreground space-y-6">
                        <div className="p-4 md:p-6 border-b border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-sm text-card-foreground">Ảnh đại diện</p>
                                <p className="text-xs text-muted-foreground mt-1">JPG, PNG - tối đa 5MB</p>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handlePhotoChange} 
                                />

                                {previewPhoto ? (
                                    <img src={previewPhoto} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-inner" />
                                ) : (!data.remove_avatar && user.avatar) ? (
                                    <img src={`/storage/${user.avatar}`} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-inner" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl shadow-inner uppercase shrink-0">
                                        {user.name ? user.name.substring(0, 2) : 'NA'}
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        Tải ảnh lên
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleRemovePhoto} 
                                        className="cursor-pointer border border-red-200 text-red-500 hover:bg-red-50 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        Xoá ảnh
                                    </button>
                                </div>
                            </div>
                        </div>
                        {errors.avatar && <p className="text-red-500 text-sm px-4 md:px-6 -mt-2">{errors.avatar}</p>}

                        <div className="p-4 md:p-6 space-y-6">
                            <div className="pb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-300 gap-2 sm:gap-4">
                                <Label htmlFor="name" className="shrink-0">Tên hiển thị</Label>
                                <div className="w-full sm:w-2/3">
                                    <Input
                                        id="name"
                                        className="w-full mt-1 sm:mt-0"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)} 
                                        required
                                        autoComplete="name"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>
                            </div>

                            <div className="pb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-300 gap-2 sm:gap-4">
                                <Label htmlFor="email" className="shrink-0">Email</Label>
                                <div className="w-full sm:w-2/3">
                                    <Input
                                        id="email"
                                        type="email"
                                        className="w-full mt-1 sm:mt-0"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)} 
                                        required
                                        autoComplete="username"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>
                            </div>

                            {mustVerifyEmail && user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Email của bạn chưa được xác thực.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-orange-500 underline decoration-neutral-300 hover:decoration-current"
                                        >
                                            Ấn vào đây để xác thực email.
                                        </Link>
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-2">
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out duration-300"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600 self-center font-medium">Đã lưu</p>
                                </Transition>
                                
                                <Button
                                    disabled={processing}
                                    type="submit" 
                                    className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                                >
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                
                {/*Bảo mật */}
                <div className="bg-card border border-gray-300 rounded-xl shadow-sm overflow-hidden w-full">
                    <div className="px-4 md:px-6 py-4 border-b border-gray-300 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                        <h2 className="font-bold text-card-foreground text-md">Bảo mật</h2>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-sm text-card-foreground">Đổi mật khẩu</p>
                            <p className="text-xs text-muted-foreground mt-1">Cập nhật mật khẩu đăng nhập</p>
                        </div>
                        <div className="flex w-full sm:w-auto">
                            <Link href="/settings/security" className="cursor-pointer border border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full sm:w-auto text-center">
                                Đổi mật khẩu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Profile.layout = (page: React.ReactNode) => (
    <NoteSettingLayout title="Cài đặt">
        {page}
    </NoteSettingLayout>
);