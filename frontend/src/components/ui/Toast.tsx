import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-l-green-500",
      progressBg: "bg-green-500",
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      borderColor: "border-l-red-500",
      progressBg: "bg-red-500",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-l-orange-500",
      progressBg: "bg-orange-500",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-l-blue-500",
      progressBg: "bg-blue-500",
    },
  };

  const style = config[type];

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white border-l-4 ${style.borderColor}
        rounded-lg shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        min-w-[320px] max-w-[400px]
        ${isExiting ? 'animate-slide-out-right opacity-0' : 'animate-slide-in-right'}
      `}
    >
      {/* Progress bar */}
      <div 
        className={`absolute top-0 left-0 h-1 ${style.progressBg} opacity-30`}
        style={{
          animation: `shrink ${duration}ms linear forwards`
        }}
      />
      
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`${style.iconBg} ${style.iconColor} rounded-full p-2 flex-shrink-0`}>
          {style.icon}
        </div>
        
        {/* Message */}
        <p className="text-gray-800 flex-1 text-sm font-medium leading-relaxed pt-1">
          {message}
        </p>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 hover:bg-gray-100 rounded"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
