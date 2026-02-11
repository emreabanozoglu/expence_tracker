'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isStandalone, setIsStandalone] = useState(true);
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if standalone
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');

        setIsStandalone(isStandaloneMode);

        // Check UA
        const ua = window.navigator.userAgent;
        const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
        const isAndroidDevice = /Android/.test(ua);

        setIsIOS(isIOSDevice);
        setIsAndroid(isAndroidDevice);

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setPromptEvent(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (promptEvent) {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            if (choice.outcome === 'accepted') {
                setPromptEvent(null);
            }
        }
    };

    if (!isMounted) return null;

    // Don't show if already installed or on desktop
    if (isStandalone || (!isIOS && !isAndroid)) {
        return null;
    }

    return (
        <div className="mb-8">
            <label className="block mb-3 text-sm uppercase tracking-wider text-base-content/60 font-semibold">App Installation</label>
            <div className="flex items-center justify-between gap-4 p-6 bg-base-100 border border-base-200 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center text-primary-content shrink-0 shadow-sm">
                        <Download size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-base font-semibold m-0 mb-1 text-base-content">Install App</h3>
                        <p className="m-0 text-sm text-base-content/60">Get the best experience</p>
                    </div>
                </div>

                {isAndroid && (
                    <button className="btn btn-primary btn-sm" onClick={handleInstallClick}>
                        Install
                    </button>
                )}

                {isIOS && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowIOSInstructions(true)}>
                        Install
                    </button>
                )}
            </div>

            {/* iOS Instructions Modal */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${showIOSInstructions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowIOSInstructions(false)}
            />
            <div className={`fixed bottom-0 left-0 right-0 bg-base-100 p-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${showIOSInstructions ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold m-0 text-base-content">Install Application</h3>
                    <button onClick={() => setShowIOSInstructions(false)} className="btn btn-circle btn-ghost btn-sm text-base-content">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-4 text-base text-base-content">
                    <Share className="text-primary" size={24} />
                    <span>1. Tap the <strong>Share</strong> button</span>
                </div>
                <div className="flex items-center gap-4 mb-2 text-base text-base-content">
                    <PlusSquare className="text-primary" size={24} />
                    <span>2. Select <strong>Add to Home Screen</strong></span>
                </div>
            </div>
        </div>
    );
}
