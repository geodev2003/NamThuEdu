import { useCallback, useRef } from "react";

const LS_KEY = "notification_sound_enabled";
const DEBOUNCE_MS = 2000; // Minimum gap between two sounds

/**
 * Custom hook to manage notification sounds.
 *
 * Features:
 * - Plays `/sounds/notification.mp3` via the Web Audio API
 * - Respects a localStorage toggle (`notification_sound_enabled`)
 * - Debounces rapid-fire calls so the sound doesn't spam
 * - Gracefully handles browsers that block autoplay
 *
 * Usage:
 *   const { playSound, isSoundEnabled, toggleSound } = useNotificationSound();
 *   // When a new notification arrives:
 *   playSound();
 */
export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);

  /** Get or create the Audio element (lazy init) */
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.volume = 0.6;
      audioRef.current.preload = "auto";
    }
    return audioRef.current;
  }, []);

  /** Whether sound is currently enabled (reads localStorage) */
  const isSoundEnabled = useCallback((): boolean => {
    try {
      const val = localStorage.getItem(LS_KEY);
      // Default to enabled when key is absent
      return val === null ? true : val === "true";
    } catch {
      return true;
    }
  }, []);

  /** Toggle the sound on/off and persist to localStorage */
  const toggleSound = useCallback((): boolean => {
    const next = !isSoundEnabled();
    try {
      localStorage.setItem(LS_KEY, String(next));
    } catch {
      /* ignore */
    }
    return next;
  }, [isSoundEnabled]);

  /** Set sound enabled state explicitly */
  const setSoundEnabled = useCallback((enabled: boolean) => {
    try {
      localStorage.setItem(LS_KEY, String(enabled));
    } catch {
      /* ignore */
    }
  }, []);

  /**
   * Play the notification sound (debounced).
   * Silently swallows autoplay-blocked errors.
   */
  const playSound = useCallback(() => {
    if (!isSoundEnabled()) return;

    const now = Date.now();
    if (now - lastPlayedRef.current < DEBOUNCE_MS) return;
    lastPlayedRef.current = now;

    const audio = getAudio();
    // Reset to beginning in case it's still playing
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browser may block autoplay before user interaction — silently fail.
      // Sound will work after the first click/tap on the page.
    });
  }, [getAudio, isSoundEnabled]);

  return { playSound, isSoundEnabled, toggleSound, setSoundEnabled };
}
