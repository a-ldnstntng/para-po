import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already launched as installed standalone PWA
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isAppStandalone) {
      setIsStandalone(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    
    // Detect In-App WebViews (Facebook, Messenger, Instagram, Line, TikTok)
    const inApp = /fban|fbav|messenger|instagram|line|musical_ly|bytedance/i.test(ua);
    setIsInAppBrowser(inApp);

    // Detect iOS
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert('Para i-install sa iPhone:\n1. I-tap ang Share button sa ibaba\n2. Piliin ang "Add to Home Screen"\n3. I-tap ang "Add" sa kanang itaas.');
    } else {
      alert('Para i-install sa Android:\n1. I-tap ang 3 dots (⋮) sa kanang itaas ng Chrome\n2. Piliin ang "Install app" o "Add to Home screen".');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  // 1. IN-APP BROWSER NOTICE (Messenger / FB / Instagram)
  if (isInAppBrowser) {
    return (
      <div className="w-full max-w-xl mx-auto px-1 py-1">
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md border border-slate-700">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 text-white font-display font-extrabold text-xs">
              PO!
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate font-display">
                Buksan sa Chrome o Safari
              </div>
              <p className="text-[11px] font-body text-slate-300 leading-tight">
                Nasa loob ka ng Messenger. I-tap ang <strong>3 dots (⋮ o •••)</strong> sa itaas ➔ <strong>"Open in Chrome"</strong> para ma-install.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors flex-shrink-0"
            title="Isara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. STANDARD BROWSER INSTALL BANNER (Android Chrome / iOS Safari / Desktop)
  return (
    <div className="w-full max-w-xl mx-auto px-1 py-1">
      <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-md border border-slate-700">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 text-white font-display font-extrabold text-xs shadow-xs">
            PO!
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate font-display tracking-tight">
              I-install ang PARA PO! App
            </div>
            <p className="text-[11px] font-body text-slate-300 line-clamp-1">
              {isIOS
                ? 'I-tap ang Share ➔ "Add to Home Screen"'
                : 'Mabilis na commute pass kahit walang signal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-display text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
            title="Isara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
