/// <reference path="../.astro/types.d.ts" />

interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
}
/// <reference types="astro/client" />
