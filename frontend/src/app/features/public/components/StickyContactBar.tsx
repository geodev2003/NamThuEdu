import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, PhoneCall, X, Headphones } from "lucide-react";

type StickyContactBarProps = {
  onRegisterConsult: () => void;
};

export function StickyContactBar({ onRegisterConsult }: StickyContactBarProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Options Menu - Appears when open */}
      {isOpen && (
        <>
          {/* Option 1: Hotline - Top */}
          <a
            href="tel:0776818160"
            className="absolute bottom-24 right-4 flex items-center gap-3 cursor-pointer transition-all duration-300"
            onClick={handleClose}
            style={{
              animation: isClosing ? 'scaleOut 0.3s ease-in forwards' : 'scaleIn 0.3s ease-out 0.05s both',
            }}
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg whitespace-nowrap">
              Hotline 0776.818.160
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-600 shadow-lg transition-transform hover:scale-110">
              <PhoneCall className="h-6 w-6 text-white" />
            </div>
          </a>

          {/* Option 2: Zalo - Middle Left */}
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-10 right-16 flex items-center gap-3 cursor-pointer transition-all duration-300"
            onClick={handleClose}
            style={{
              animation: isClosing ? 'scaleOut 0.3s ease-in 0.05s forwards' : 'scaleIn 0.3s ease-out 0.1s both',
            }}
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-600 shadow-lg whitespace-nowrap">
              {t("landing.guest.stickyContact.zalo")}
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 shadow-lg transition-transform hover:scale-110">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </a>

          {/* Option 3: Register - Bottom Left */}
          <button
            type="button"
            onClick={() => {
              handleClose();
              setTimeout(() => onRegisterConsult(), 300);
            }}
            className="absolute -bottom-6 right-20 flex items-center gap-3 cursor-pointer transition-all duration-300"
            style={{
              animation: isClosing ? 'scaleOut 0.3s ease-in 0.1s forwards' : 'scaleIn 0.3s ease-out 0.15s both',
            }}
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-lg whitespace-nowrap">
              {t("landing.guest.stickyContact.register")}
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg transition-transform hover:scale-110">
              <Headphones className="h-6 w-6 text-white" />
            </div>
          </button>
        </>
      )}

      {/* Main FAB Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        style={{
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <MessageCircle className="h-7 w-7 text-white" />
        )}
      </button>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0) translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
