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

  const handleVoiceTranscript = (transcript: string) => {
    setText((prev) => (prev ? prev + ' ' + transcript : transcript));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="w-full pb-6">
      <div className="glass-panel p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="route-input" className="text-xs sm:text-sm font-display uppercase tracking-wider text-jeep-yellow font-bold flex items-center gap-1.5">
              <span>🗣️</span>
              <span>I-describe ang iyong commute / route:</span>
            </label>
            <span className="text-xs text-jeep-text-dim hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-400 font-mono">Ctrl+Enter</kbd> to extract
            </span>
          </div>

          <div className="relative w-full">
            <textarea
              id="route-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I-type o magsalita sa Taglish/English! &#10;&#10;Halimbawa: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons. Tapos lakad papuntang SM.'"
              rows={4}
              disabled={isExtracting}
              className="w-full bg-slate-900/90 border-2 border-slate-700 rounded-xl p-4 pr-16
                text-slate-100 font-body text-base placeholder:text-slate-500
                focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                disabled:opacity-50 resize-none transition-all shadow-inner"
            />
            {/* Voice button inside textarea */}
            <div className="absolute bottom-3.5 right-3.5">
              <VoiceButton
                onTranscript={handleVoiceTranscript}
                disabled={isExtracting}
              />
            </div>
          </div>

          {/* Quick sample prompt pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Subukan ang sample:</span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(sample.prompt)}
                disabled={isExtracting}
                className="prompt-pill"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!text.trim() || isExtracting}
              className="btn-primary flex items-center gap-2.5"
            >
              {isExtracting ? (
                <>
                  <span className="loading-wheel !w-5 !h-5 !border-2" />
                  <span>Ine-extract ang Route...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🚐</span>
                  <span>Extract Route</span>
                </>
              )}
            </button>

            {(text.trim() || isExtracting) && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary text-sm"
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
