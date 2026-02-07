'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import styles from './InstallPrompt.module.css';

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
        <div style={{ marginBottom: '2rem' }}>
            <label className={styles.sectionLabel}>App Installation</label>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <Download size={24} />
                    </div>
                    <div className={styles.text}>
                        <h3 style={{ fontSize: '1rem' }}>Install App</h3>
                        <p style={{ fontSize: '0.85rem' }}>Get the best experience</p>
                    </div>
                </div>

                {isAndroid && (
                    <button className={styles.button} onClick={handleInstallClick}>
                        Install
                    </button>
                )}

                {isIOS && (
                    <button className={styles.button} onClick={() => setShowIOSInstructions(true)}>
                        Install
                    </button>
                )}
            </div>

            {/* iOS Instructions Modal */}
            <div
                className={`${styles.overlay} ${showIOSInstructions ? styles.open : ''}`}
                onClick={() => setShowIOSInstructions(false)}
            />
            <div className={`${styles.iosModal} ${showIOSInstructions ? styles.open : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className={styles.iosTitle} style={{ marginBottom: 0 }}>Install Application</h3>
                    <button onClick={() => setShowIOSInstructions(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.iosStep}>
                    <Share className={styles.iosIcon} size={24} />
                    <span>1. Tap the <strong>Share</strong> button</span>
                </div>
                <div className={styles.iosStep}>
                    <PlusSquare className={styles.iosIcon} size={24} />
                    <span>2. Select <strong>Add to Home Screen</strong></span>
                </div>
            </div>
        </div>
    );
}
