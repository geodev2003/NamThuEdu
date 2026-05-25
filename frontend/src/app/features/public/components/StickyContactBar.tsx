import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { MessageCircle, PhoneCall, X, Facebook, UserPlus } from "lucide-react";

type StickyContactBarProps = {
  onRegisterConsult: () => void;
};

export function StickyContactBar({ onRegisterConsult }: StickyContactBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hiddenByMenu, setHiddenByMenu] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('openContactFAB', handler);
    return () => window.removeEventListener('openContactFAB', handler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const open = (e as CustomEvent<{ open: boolean }>).detail.open;
      setHiddenByMenu(open);
    };
    window.addEventListener('mobileMenuChange', handler);
    return () => window.removeEventListener('mobileMenuChange', handler);
  }, []);

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
    <>
      {/* Backdrop — click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}

    <div
      className="fixed bottom-24 right-6 z-50 transition-all duration-300"
      style={hiddenByMenu ? { opacity: 0, pointerEvents: 'none', transform: 'scale(0.8)' } : { opacity: 1, pointerEvents: 'auto', transform: 'scale(1)' }}
    >
      {/* Options Menu - Appears when open */}
      {isOpen && (
        <>
          {/* Option 1: Hotline via Zalo - Top */}
          <a
            href="https://zalo.me/0776818160"
            target="_blank"
            rel="noreferrer"
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

          {/* Option 2: Facebook - Middle Left */}
          <a
            href="https://www.facebook.com/profile.php?id=61573591333617"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-10 right-16 flex items-center gap-3 cursor-pointer transition-all duration-300"
            onClick={handleClose}
            style={{
              animation: isClosing ? 'scaleOut 0.3s ease-in 0.05s forwards' : 'scaleIn 0.3s ease-out 0.1s both',
            }}
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-lg whitespace-nowrap">
              Facebook
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-transform hover:scale-110">
              <Facebook className="h-6 w-6 text-white" />
            </div>
          </a>

          {/* Option 3: Login - Bottom Left */}
          <button
            type="button"
            onClick={() => {
              handleClose();
              setTimeout(() => navigate('/dang-nhap'), 300);
            }}
            className="absolute -bottom-6 right-20 flex items-center gap-3 cursor-pointer transition-all duration-300"
            style={{
              animation: isClosing ? 'scaleOut 0.3s ease-in 0.1s forwards' : 'scaleIn 0.3s ease-out 0.15s both',
            }}
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-lg whitespace-nowrap">
              Đăng ký ngay
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg transition-transform hover:scale-110">
              <UserPlus className="h-6 w-6 text-white" />
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
    </>
  );
}
