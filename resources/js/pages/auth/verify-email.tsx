// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white">
            <Head title="Xác thực email" />
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
                            Xác thực  
                            <span className="text-orange-500"> Email</span>
                        </p>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <p className="text-gray-400 text-sm xl:text-base max-w-md">
                            {/* Tạo một mật khẩu an toàn <br /> để bảo vệ các ghi chú của bạn. */}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md flex flex-col items-center text-center">
                    
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Kiểm tra hộp thư của bạn</h2>
                        <p className="text-gray-500">Để hoàn tất hồ sơ và tăng cường bảo mật, vui lòng kiểm tra hộp thư để xác thực email. Nếu chưa nhận được, hãy yêu cầu gửi lại phía dưới.</p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            Một liên kết xác thực mới vừa được gửi đến địa chỉ email của bạn.
                        </div>
                    )}

                    <Form {...send.form()} className="space-y-6 text-center">
                        {({ processing }) => (
                            <>
                                <Button className="p-5 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white text-md" disabled={processing} variant="secondary">
                                    {processing && <Spinner />}
                                    Gửi lại xác thực email
                                </Button>

                                <TextLink
                                    href={logout()}
                                    className="mx-auto block text-sm cursor-pointer text-black"
                                >
                                    Đăng xuất
                                </TextLink>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}

VerifyEmail.layout = {
    title: 'Verify email',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
