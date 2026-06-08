import { useState } from 'react';
import { Smartphone, X } from 'lucide-react';
import { UsePwaInstallReturn } from '../hooks/usePwaInstall';

interface Props {
  pwa: UsePwaInstallReturn;
}

const DISMISS_KEY = 'pwa-install-dismissed';

export function PwaInstallBanner({ pwa }: Props) {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  if (!pwa.canInstall || dismissed) return null;

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  const handleInstall = async () => {
    await pwa.triggerInstall();
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-auto px-4">
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg shadow-indigo-100/40 p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
          <Smartphone className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">Thêm vào màn hình chính</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Truy cập NamThuEdu nhanh hơn — không cần mở trình duyệt.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Thêm ngay
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
