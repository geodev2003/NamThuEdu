import { useState, useCallback } from "react";
import { ToastType } from "../components/ui/Toast";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, message, duration };
      
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => showToast("success", message, duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => showToast("error", message, duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => showToast("warning", message, duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => showToast("info", message, duration),
    [showToast]
  );

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
