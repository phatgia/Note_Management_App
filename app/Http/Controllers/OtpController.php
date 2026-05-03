<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    public function send()
    {
        $user = auth()->user();
        if ($user->email_verified_at)
            return back();

        $otp = rand(100000, 999999);

        Cache::put('otp_' . $user->id, $otp, now()->addMinutes(5));

        $htmlContent = '
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <h1 style="color: #f97316; margin-bottom: 20px; font-size: 28px; font-weight: 800;">Note Management</h1>
                <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Xin chào <strong>' . $user->name . '</strong>,</p>
                <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">Bạn đã yêu cầu mã OTP để xác minh địa chỉ email. Dưới đây là mã của bạn:</p>
                
                <div style="background-color: #fff7ed; border: 2px dashed #fb923c; border-radius: 12px; padding: 20px; margin: 0 auto; width: 250px;">
                    <p style="font-size: 36px; font-weight: bold; color: #ea580c; margin: 0; letter-spacing: 8px;">' . $otp . '</p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; line-height: 1.5;">
                    Mã này sẽ hết hạn sau <strong>5 phút</strong>.<br/>
                    Vui lòng không chia sẻ mã này với bất kỳ ai để bảo mật tài khoản.
                </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">© ' . date('Y') . ' Note Management App. All rights reserved.</p>
        </div>
        ';

        Mail::html($htmlContent, function ($message) use ($user) {
            $message->to($user->email)->subject('Mã OTP Xác minh Email');
        });

        return back()->with('message', 'Đã gửi mã OTP đến email của bạn!');
    }

    public function verify(Request $request)
    {
        $request->validate(['otp' => 'required|numeric']);

        $cachedOtp = Cache::get('otp_' . auth()->id());

        if ($cachedOtp && $cachedOtp == $request->otp) {
            $user = $request->user();
            $user->forceFill(['email_verified_at' => now()])->save();
            
            if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail) {
                event(new \Illuminate\Auth\Events\Verified($user));
            }

            Cache::forget('otp_' . $user->id);

            return back()->with('message', 'Xác minh email thành công! Chào mừng bạn.');
        }

        return back()->withErrors(['otp' => 'Mã OTP không chính xác hoặc đã hết hạn!']);
    }
}