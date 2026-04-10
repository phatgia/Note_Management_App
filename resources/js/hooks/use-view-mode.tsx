import {useSyncExternalStore} from 'react';

export type ViewMode = 'grid'|'list';

export type UseViewModeReturn ={
    readonly viewMode: ViewMode;
    readonly updateViewMode: (mode: ViewMode) => void;
};

const listeners = new Set<() => void>();
let currentViewMode: ViewMode = 'grid'; 

const setCookie = (name: string, value: string, days = 365): void => {
    if(typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredViewMode = (): ViewMode =>{
    if(typeof window === 'undefined') return 'grid';
    return (localStorage.getItem('viewMode') as ViewMode) || 'grid';
};

const subscribe = (callback: () => void) =>{
    listeners.add(callback);
    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeViewMode(): void{
    if(typeof window === 'undefined') return;

    if(!localStorage.getItem('viewMode')) {
        localStorage.setItem('viewMode', 'grid');
        setCookie('viewMode', 'grid');
    }
    currentViewMode = getStoredViewMode();
}

export function useViewMode(): UseViewModeReturn{
    const viewMode: ViewMode = useSyncExternalStore(
        subscribe,
        () => currentViewMode,
        () => 'grid'
    );

    const updateViewMode = (mode: ViewMode): void =>{
        currentViewMode = mode;
        localStorage.setItem('viewMode', mode);
        setCookie('viewMode', mode);
        notify();
    };

    return { viewMode, updateViewMode } as const;
}