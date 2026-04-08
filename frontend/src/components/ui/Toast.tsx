import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  };

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-600",
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-800",
      icon: "text-orange-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 mb-3 flex items-start gap-3 min-w-[320px] max-w-[420px] animate-slide-in-right`}
    >
      <div className={style.icon}>{icons[type]}</div>
      <p className={`${style.text} flex-1 text-sm font-medium`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.icon} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
