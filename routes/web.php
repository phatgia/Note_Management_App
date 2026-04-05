<?php

use App\Http\Controllers\NoteController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/home');
    }
    return redirect()->route('login');
});
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [NoteController::class, 'index'])->name('home');

    Route::resource('notes', NoteController::class)->except(['index']);
});
Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'note/home')->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});
Route::get('/verify-email', function () {
    return Inertia\Inertia::render('auth/verify-email');
});
require __DIR__ . '/settings.php';
