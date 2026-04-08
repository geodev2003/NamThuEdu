import type { CSSProperties } from 'react';

export type ToastId = string | number;

type ToastAction = {
  label: string;
  onClick: () => void;
};

type ToastOptions = {
  duration?: number;
  position?: string;
  icon?: string;
  action?: ToastAction;
  style?: CSSProperties;
};

let nextToastId = 1;

function notify(message: string, _options?: ToastOptions): ToastId {
  if (import.meta.env.DEV) {
    console.info('[toast]', message);
  }
  return nextToastId++;
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions) => notify(message, options),
  {
    error: (message: string, options?: ToastOptions) => notify(message, options),
    success: (message: string, options?: ToastOptions) => notify(message, options),
    loading: (message: string, options?: ToastOptions) => notify(message, options),
    dismiss: (_id?: ToastId) => undefined,
  },
);
