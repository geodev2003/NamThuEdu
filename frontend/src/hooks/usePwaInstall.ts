import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePwaInstallReturn {
  canInstall: boolean;
  triggerInstall: () => Promise<void>;
}

/**
 * Listens for the browser's `beforeinstallprompt` event (Android Chrome / Edge).
 * Exposes `canInstall` (true when install prompt is available) and
 * `triggerInstall()` to show the native "Add to Home Screen" dialog.
 *
 * iOS Safari does NOT fire this event — the banner will simply not appear on iOS.
 */
export function usePwaInstall(): UsePwaInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If app is already installed, clear the prompt
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const triggerInstall = async (): Promise<void> => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return {
    canInstall: deferredPrompt !== null,
    triggerInstall,
  };
}
