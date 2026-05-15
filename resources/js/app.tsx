import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { initializeFontSize } from '@/hooks/use-font-size';
import { initializeViewMode } from '@/hooks/use-view-mode';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}
import './echo';
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}
createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('note/'):
                return null;
            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return null;
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

initializeFontSize();

initializeViewMode();

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}