// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';
import ResetPassword from './reset-password';

export default function ForgotPassword({ status }: { status?: string }) {
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
                            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email.
                        </p>
                    </div>
                </div>
            </div>

            {/* Phải */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h2>
                        <p className="text-gray-500">Nhập email tài khoản để nhận hướng dẫn đặt lại</p>
                    </div>
                    
                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <div className="space-y-6">
                        <Form {...email.form()}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2 text-black">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" name="email" autoComplete="off" autoFocus placeholder="email@example.com"/>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="my-6 flex items-center justify-start ">
                                        <Button className="w-full font-bold text-white bg-orange-500 cursor-pointer hover:bg-orange-600" disabled={processing} data-test="email-password-reset-link-button">
                                            {processing && (
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                            )}
                                            Gửi email đặt lại
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="space-x-1 text-center text-sm text-muted-foreground">
                            <span>Hoặc, quay lại</span>
                            <TextLink href={login()} className="text-black">đăng nhập</TextLink>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

ForgotPassword.layout = (page:any)=>page;