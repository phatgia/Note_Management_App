import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import NoteSettingLayout from '@/layouts/note-setting-layout';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <div className="w-full bg-background min-h-screen pb-12">
            <Head title="Bảo mật"/>

            {/* Header cho Mobile */}
            <div className="sticky top-0 md:hidden flex justify-center bg-card border-b border-gray-200 text-xl md:text-2xl text-card-foreground font-bold p-4 md:p-6.5 z-10 shadow-sm">
                <h1>Bảo mật</h1>
            </div>

            <div className="sticky top-0 hidden md:flex bg-card border-b border-gray-200 text-xl md:text-2xl text-card-foreground font-bold p-4 md:p-6.5 z-10 shadow-sm">
                <h1>Bảo mật</h1>
            </div>

            <div className="max-w-3xl mx-auto mt-6 md:mt-10 px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="bg-card border border-gray-300 rounded-xl shadow-sm overflow-hidden w-full">
                    
                    {/* Tiêu đề Khối */}
                    <div className="px-4 md:px-6 py-4 border-b border-gray-300 flex items-center justify-center md:justify-start gap-2 bg-gray-50/50 dark:bg-gray-800/30">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-5 h-5 text-orange-500"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" 
                            />
                        </svg>
                        <h2 className="font-bold text-card-foreground text-md">Thay đổi mật khẩu của bạn</h2>
                    </div>
                    
                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="p-4 md:p-6 space-y-6 dark:text-white"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                {/* Input Mật khẩu hiện tại */}
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-gray-700 dark:text-gray-300 font-semibold">
                                        Mật khẩu hiện tại
                                    </Label>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">
                                        Mật khẩu mới
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-semibold">
                                        Xác nhận mật khẩu
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex justify-end items-center gap-4 pt-2">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600 font-medium">
                                            Đã cập nhật thành công!
                                        </p>
                                    </Transition>

                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer px-6"
                                    >
                                        {processing ? 'Đang lưu...' : 'Lưu mật khẩu'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}

Security.layout = (page: React.ReactNode) => (
    <NoteSettingLayout title="Cài đặt">
        {page}
    </NoteSettingLayout>
);