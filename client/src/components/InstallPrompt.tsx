import { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isAppStandalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for Android / Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // On iOS Safari, check if prompt was dismissed previously
    if (isIOSDevice && !localStorage.getItem('para_po_ios_dismissed')) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('para_po_ios_dismissed', 'true');
    }
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto px-2">
      <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-lg border border-slate-700">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-display font-black text-xs">
            PO!
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate font-display tracking-wide uppercase">
              I-install ang PARA PO! App
            </div>
            <p className="text-[11px] font-body text-slate-300 line-clamp-1">
              {isIOS
                ? 'I-tap ang Share button ➔ "Add to Home Screen"'
                : 'Mabilis na commute pass kahit offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              type="button"
              className="btn-sakay-primary !py-1.5 !px-3 !text-xs !font-utility"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          {isIOS && (
            <div className="text-[10px] font-utility bg-slate-800 text-amber-400 px-2 py-1 rounded border border-slate-700 flex items-center gap-1">
              <Share className="w-3 h-3" />
              <span>Share</span>
            </div>
          )}

          <button
            onClick={handleDismiss}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title="Isara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
