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

        Mail::raw("Mã OTP xác minh tài khoản Note Management của bạn là: $otp.\n\nMã này sẽ hết hạn sau 5 phút.", function ($message) use ($user) {
            $message->to($user->email)->subject('Mã OTP Xác minh Email');
        });

        return back()->with('message', 'Đã gửi mã OTP đến email của bạn!');
    }

    public function verify(Request $request)
    {
        $request->validate(['otp' => 'required|numeric']);

        $cachedOtp = Cache::get('otp_' . auth()->id());

        if ($cachedOtp && $cachedOtp == $request->otp) {
            auth()->user()->update(['email_verified_at' => now()]);
            Cache::forget('otp_' . auth()->id());

            return back()->with('message', 'Xác minh email thành công! Chào mừng bạn.');
        }

        return back()->withErrors(['otp' => 'Mã OTP không chính xác hoặc đã hết hạn!']);
    }
}