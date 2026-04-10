import {useSyncExternalStore} from 'react';

export type FontSize = 'small'|'medium'|'large';

export type UseFontSizeReturn ={
    readonly fontSize: FontSize;
    readonly updateFontSize: (size: FontSize) => void;
};


const fontSizeMap: Record<FontSize, string> ={
    small: '14px',
    medium: '16px', 
    large: '18px',
};

const listeners = new Set<() => void>();
let currentFontSize: FontSize = 'medium';

const setCookie = (name: string, value: string, days = 365): void => {
    if(typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredFontSize = (): FontSize =>{
    if(typeof window === 'undefined') return 'medium';
    return(localStorage.getItem('fontSize') as FontSize) || 'medium';
};

const applyFontSize = (size: FontSize): void =>{
    if(typeof document === 'undefined') return;
    document.documentElement.style.fontSize = fontSizeMap[size];
};

const subscribe = (callback: () => void) =>{
    listeners.add(callback);
    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeFontSize(): void{
    if(typeof window === 'undefined') return;

    if(!localStorage.getItem('fontSize')){
        localStorage.setItem('fontSize', 'medium');
        setCookie('fontSize', 'medium');
    }

    currentFontSize = getStoredFontSize();
    applyFontSize(currentFontSize);
}

export function useFontSize(): UseFontSizeReturn{
    const fontSize: FontSize = useSyncExternalStore(
        subscribe,
        () => currentFontSize,
        () => 'medium'
    );

    const updateFontSize = (size: FontSize): void =>{
        currentFontSize = size;
        localStorage.setItem('fontSize', size);
        setCookie('fontSize', size);
        applyFontSize(size);
        notify();
    };

    return {fontSize, updateFontSize} as const;
}