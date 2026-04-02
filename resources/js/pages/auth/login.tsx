import { Form, Head, Link } from '@inertiajs/react';
import React from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white">
            <Head title="Đăng nhập" />
            {/* Trái */}
            <div className="relative hidden lg:block overflow-hidden">
                {/* Nền */}
                <div className="absolute inset-0 bg-gradient-to-br bg-neutral-900 to-orange-800"></div>

                {/* Nội dung */}
                <div className="relative z-10 flex h-full flex-col p-20 text-white">
                    {/* Logo */}
                    <div className="pt-30 flex items-center">
                        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Thân tờ giấy (Màu cam sáng) */}
                            <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                            {/* Góc gập (Màu cam đậm) */}
                            <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                        </svg>
                        <p className="font-bold text-3xl">Note Management</p>
                    </div>

                    <div className="pt-15">
                        <p className="font-bold text-5xl">Ghi chú thông minh,<br/> 
                            quản lý <span className="text-orange-500">hiệu quả</span>
                        </p>
                    </div>

                    <div className="pt-15">
                        <p className="text-gray-400">Tạo, tổ chức và chia sẻ ghi chú của bạn một <br/> cách dễ dàng. Hỗ trợ hình ảnh, nhãn và cộng tác <br/> thời gian thực.</p>
                    </div>

                    <div className="pt-15">
                        <ul className="text-xs text-gray-400">

                            <li className="p-3 pl-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 shrink-0 pr-2">
                                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                                <p>Mã hóa ghi chú bằng mật khẩu riêng</p>
                            </li>

                            <li className="p-3 pl-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 shrink-0 pr-2">
                                    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
                                </svg>
                                <p>Chia sẻ & cộng tác thời gian thực</p>
                            </li>

                            <li className="p-3 pl-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 shrink-0 pr-2">
                                    <path fillRule="evenodd" d="M1.371 8.143c5.858-5.857 15.356-5.857 21.214 0a.75.75 0 010 1.061l-1.06 1.061a.75.75 0 01-1.061 0 13.5 13.5 0 00-19.092 0 .75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 010-1.062zm3.182 3.182c4.101-4.1 10.743-4.1 14.844 0a.75.75 0 010 1.061l-1.06 1.06a.75.75 0 01-1.06 0 10.5 10.5 0 00-14.849 0 .75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 010-1.061zm3.182 3.182c2.343-2.343 6.142-2.343 8.485 0a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061 0 7.5 7.5 0 00-10.607 0 .75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 010-1.061zm3.182 3.182a1.5 1.5 0 012.122 0l1.06 1.06a1.5 1.5 0 01-2.121 2.122l-1.06-1.06a1.5 1.5 0 010-2.122z" clipRule="evenodd" />
                                </svg>
                                <p>Hoạt động offline, đồng bộ tự động</p>
                            </li>   

                            <li className="p-3 pl-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 shrink-0 pr-2">
                                    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                                </svg>
                                <p>Quản lý nhãn, lọc thông minh</p>
                            </li>   
                        </ul>
                    </div>
                </div>
            </div>

            {/* Phải */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Chào mừng bạn đã trở lại!</h2>
                        <p className="text-gray-500">Đăng nhập để tiếp tục với ghi chú của bạn</p>
                    </div>

                    {status && (
                        <div className="mb-4 text-center text-sm text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                            {status}
                        </div>
                    )}

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="font-bold text-gray-700">Email</Label>
                                        <Input id="email" type="email" name="email" required placeholder="name@example.com" className="border-3 px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white rounded-xl text-black" autoFocus tabIndex={1} autoComplete="email"/>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Mật khẩu */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="font-bold text-gray-700">Mật khẩu</Label>
                                        <PasswordInput id="password" name="password" required tabIndex={2} autoComplete="current-password" placeholder="••••••••" className="border-3 px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white rounded-xl text-black"/>
                                        <div className="flex items-center justify-end">
                                            {canResetPassword && (
                                                <TextLink href={request()} className="text-sm text-sm text-orange-500 hover:text-orange-800" tabIndex={5}>
                                                    Quên mật khẩu?
                                                </TextLink>
                                            )}
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Ghi nhớ đăng nhập */}
                                    <div className="flex items-center space-x-3 mt-1">
                                        <Checkbox id="remember" name="remember" tabIndex={3} className="border-2 border-gray-300 text-orange-600 focus:ring-orange-500"/>
                                        <Label htmlFor="remember" className="font-normal text-gray-600 cursor-pointer">Ghi nhớ đăng nhập</Label>
                                    </div>

                                    {/* Nút Đăng nhập */}
                                    <Button type="submit" className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-bold rounded-xl hover:shadow-lg" tabIndex={4} disabled={processing} data-test="login-button">
                                        {processing && <Spinner className="mr-2" />}
                                        Đăng nhập
                                    </Button>
                                </div>

                                {/* Đăng ký */}
                                {canRegister && (
                                    <div className="mt-4 text-center text-sm text-gray-600">
                                        Bạn chưa có tài khoản?{' '}
                                        <Link href={register()} tabIndex={5} className="font-bold text-orange-600 hover:text-orange-800 hover:underline">
                                            Tạo tài khoản miễn phí
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>
                </div>
            </div>
            
        </div>
    );
}


Login.layout = (page: any) => page;