import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white">
            <Head title="Đặt lại mật khẩu" />
            {/* Trái */}
            <div className="relative hidden lg:flex flex-col overflow-hidden bg-gradient-to-br from-neutral-900 to-orange-900">
                {/* Nội dung */}
                <div className="relative z-10 flex flex-col justify-center h-full p-10 lg:p-14 xl:p-20 gap-8 text-white">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                            <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V20L20 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#F97316"/>
                            <path d="M28 20H24C21.7909 20 20 21.7909 20 24V28L28 20Z" fill="#C2410C"/>
                        </svg>
                        <p className="font-bold text-3xl">Note Management</p>
                    </div>

                    {/* Tiêu đề */}
                    <div>
                        <p className="font-bold text-4xl xl:text-5xl leading-tight">
                            Đặt lại <br/> 
                            <span className="text-orange-500">mật khẩu</span>
                        </p>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <p className="text-gray-400 text-sm xl:text-base max-w-md">
                            Tạo một mật khẩu an toàn <br /> để bảo vệ các ghi chú của bạn.
                        </p>
                    </div>
                </div>
            </div>

            {/* Phải */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h2>
                        <p className="text-gray-500">Nhập mật khẩu mới cho tài khoản của bạn</p>
                    </div>

                    <Form
                        {...update.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-6 text-black">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        className="mt-1 block w-full"
                                        readOnly
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Mật khẩu mới</Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full"
                                        autoFocus
                                        placeholder="Mật khẩu mới"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Xác nhận mật khẩu
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full"
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 w-full font-bold text-white bg-orange-500 cursor-pointer hover:bg-orange-600"
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing && <Spinner />}
                                    Đặt lại mật khẩu
                                </Button>
                            </div>
                        )}
                    </Form> 
                </div>
                
            </div>
            
        </div>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
