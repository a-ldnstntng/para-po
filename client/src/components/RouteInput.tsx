import { useState } from 'react';
import VoiceButton from './VoiceButton';

interface RouteInputProps {
  onSubmit: (text: string) => void;
  onClear?: () => void;
  isExtracting: boolean;
}

const SAMPLE_PROMPTS = [
  { label: '🚌 Cubao ➔ Antipolo', prompt: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons Antipolo.' },
  { label: '🚈 SM North ➔ Baclaran', prompt: 'From SM North EDSA, take MRT-3 to Taft Avenue, then jeep to Baclaran Redemptorist.' },
  { label: '🛺 Shaw ➔ Kapitolyo', prompt: 'Mula Shaw MRT Station, mag-trike papuntang Kapitolyo Pasig tapos lakad sa Commons.' },
  { label: '🚐 SJDM ➔ PUP Sta. Mesa', prompt: 'Galing SJDM Bulacan, sakay ng bus pa-Cubao, tapos LRT-2 to Pureza, then trike to PUP Sta Mesa.' },
];

export default function RouteInput({ onSubmit, onClear, isExtracting }: RouteInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isExtracting) {
      onSubmit(text.trim());
    }
  };

  const handleClear = () => {
    setText('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="w-full pb-4">
      <div className="transit-panel p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <label htmlFor="route-input" className="font-display text-lg sm:text-xl font-bold text-amber-400 tracking-wide uppercase flex items-center gap-2">
              <span className="bg-rose-600 text-white px-2 py-0.5 text-xs font-mono font-bold rounded">ROUTE INPUT</span>
              <span>I-describe ang iyong commute:</span>
            </label>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-400 font-mono">Ctrl+Enter</kbd>
            </span>
          </div>

          {/* Text input area */}
          <div className="relative w-full">
            <textarea
              id="route-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Halimbawa: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons. Tapos lakad papuntang SM.'"
              rows={4}
              disabled={isExtracting}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-4 pr-16
                text-slate-100 font-body text-sm sm:text-base placeholder:text-slate-500
                focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30
                disabled:opacity-50 resize-none transition-all shadow-inner"
            />
            {/* Voice Button */}
            <div className="absolute bottom-3.5 right-3.5">
              <VoiceButton
                onTranscript={(transcript) => setText((prev) => (prev ? prev + ' ' + transcript : transcript))}
                disabled={isExtracting}
              />
            </div>
          </div>

          {/* Sample Route Pills */}
          <div className="pt-1">
            <div className="text-xs font-medium text-slate-400 mb-2">
              Subukan ang mga sample na ruta:
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(sample.prompt)}
                  disabled={isExtracting}
                  className="sample-pill"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={!text.trim() || isExtracting}
              className="btn-jeep-primary"
            >
              {isExtracting ? (
                <>
                  <span className="spinner-ring" />
                  <span>Ine-extract ang ruta...</span>
                </>
              ) : (
                <>
                  <span>🚐</span>
                  <span>Extract Route</span>
                </>
              )}
            </button>

            {(text.trim() || isExtracting) && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-jeep-secondary"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
