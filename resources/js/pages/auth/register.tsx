import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white">
            <Head title="Đăng ký" />
            {/* Trái */}
            <div className="relative hidden lg:flex flex-col overflow-hidden bg-gradient-to-br from-neutral-900 to-orange-900">
                {/* Nội dung */}
                <div className="relative z-10 flex flex-col justify-center h-full p-10 lg:p-14 xl:p-20 gap-8 text-white">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                            {/* Thân tờ giấy (Màu cam sáng) */}
                            <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                            {/* Góc gập (Màu cam đậm) */}
                            <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                        </svg>
                        <p className="font-bold text-3xl">Note Management</p>
                    </div>

                    {/* Tiêu đề */}
                    <div>
                        <p className="font-bold text-4xl xl:text-5xl">
                            Bắt đầu hành trình<br/> 
                            ghi chú <span className="text-orange-500">của bạn</span>
                        </p>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <p className="text-gray-400 text-sm xl:text-base max-w-md">
                            Tạo tài khoản miễn phí và bắt đầu tổ chức cuộc sống của bạn với Note Management ngay hôm nay.
                        </p>
                    </div>
                </div>
            </div>


            {/* Phải */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="md:hidden flex items-center gap-3">
                        <svg width="50" height="50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                            <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                            <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                        </svg>
                        <p className="font-bold text-3xl">Note Management</p>
                    </div>

                    <div className="">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Tạo tài khoản</h2>
                        <p className="text-gray-500">Điền thông tin bên dưới để đăng ký</p>
                    </div>

                    <Form {...store.form()} resetOnSuccess={['password', 'password_confirmation']} disableWhileProcessing className="">   
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    {/* Tên */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input className="border-3 px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white rounded-xl text-black" id="name" type="text" required autoFocus tabIndex={1} autoComplete="name" name="name" placeholder="Họ tên"/>
                                        <InputError message={errors.name} className="mt-2"/>
                                    </div>
                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input className="border-3 px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white rounded-xl text-black" id="email" type="email" required tabIndex={2} autoComplete="email" name="email" placeholder="email@example.com"/>
                                        <InputError message={errors.email} />
                                    </div>
                                    {/* Mật khẩu */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                        <PasswordInput className="border-3 px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white rounded-xl text-black" id="password" required tabIndex={3} autoComplete="new-password" name="password" placeholder="Mật khẩu"/>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                                        <PasswordInput className="border-3 px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white rounded-xl text-black" id="password_confirmation" required tabIndex={4} autoComplete="new-password" name="password_confirmation" placeholder="Xác nhận mật khẩu"/>
                                        <InputError message={errors.password_confirmation}/>
                                    </div>

                                    <Button type="submit" className="mt-2 w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-bold rounded-xl hover:shadow-lg" tabIndex={5} data-test="register-user-button">
                                        {processing && <Spinner />}
                                        Tạo tài khoản
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground mt-5">
                                    Bạn đã có tài khoản?{' '}
                                    <TextLink href={login()} tabIndex={6} className=" text-orange-600">
                                        Đăng Nhập
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
                
            </div> 

        </div>
        
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
