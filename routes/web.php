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
    Route::get('/home', [NoteController::class, 'index'])->name('notes.index');
    Route::resource('note', NoteController::class)->except(['index']);
    Route::get('/create-note', [NoteController::class, 'create'])->name('create-note');
    Route::get('/note-detail/{note}', [\App\Http\Controllers\NoteController::class, 'show'])->name('notes.show');
    Route::put('/note-detail/{note}', [\App\Http\Controllers\NoteController::class, 'update'])->name('notes.update');
    Route::post('/note-detail/{note}/share', [\App\Http\Controllers\NoteController::class, 'share'])->name('notes.share');
    Route::put('/note-detail/{note}/share/{user}', [\App\Http\Controllers\NoteController::class, 'updateShare'])->name('notes.share.update');
    Route::delete('/note-detail/{note}/share/{user}', [\App\Http\Controllers\NoteController::class, 'removeShare'])->name('notes.share.destroy');
    Route::delete('/note-detail/{note}', [\App\Http\Controllers\NoteController::class, 'destroy'])->name('notes.destroy');
    Route::get('/shared-note', [\App\Http\Controllers\NoteController::class, 'sharedNotes'])->name('notes.shared');
    Route::post('/notes/{note}/pin', [\App\Http\Controllers\NoteController::class, 'togglePin']);
    Route::put('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy']);
    Route::delete('/notes/{note}/images/{imageId}', [NoteController::class, 'removeImage'])->name('notes.remove-image');
    Route::post('/otp/send', [\App\Http\Controllers\OtpController::class, 'send']);
    Route::post('/otp/verify', [\App\Http\Controllers\OtpController::class, 'verify']);
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
