import { useState } from 'react';
import { ArrowRight, Bus, Train, Bike, RotateCcw } from 'lucide-react';
import VoiceButton from './VoiceButton';

interface RouteInputProps {
  onSubmit: (text: string) => void;
  onClear?: () => void;
  isExtracting: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'Cubao ➔ Antipolo', prompt: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons Antipolo.', icon: Bus },
  { label: 'SM North ➔ Baclaran', prompt: 'From SM North EDSA, take MRT-3 to Taft Avenue, then jeep to Baclaran Redemptorist.', icon: Train },
  { label: 'Shaw ➔ Kapitolyo', prompt: 'Mula Shaw MRT Station, mag-trike papuntang Kapitolyo Pasig tapos lakad sa Commons.', icon: Bike },
  { label: 'SJDM ➔ PUP Sta. Mesa', prompt: 'Galing SJDM Bulacan, sakay ng bus pa-Cubao, tapos LRT-2 to Pureza, then trike to PUP Sta Mesa.', icon: Bus },
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
    <section className="w-full">
      <div className="transit-panel p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
            <label htmlFor="route-input" className="font-display text-xl sm:text-2xl font-bold text-slate-100 tracking-wide uppercase flex items-center gap-2">
              <span>I-describe ang iyong byahe:</span>
            </label>
            <span className="text-xs font-utility text-slate-400">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400 font-utility text-[11px]">Ctrl+Enter</kbd>
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
              rows={3}
              disabled={isExtracting}
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl p-3.5 sm:p-4 pr-14
                text-slate-100 font-body text-sm sm:text-base placeholder:text-slate-500
                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30
                disabled:opacity-50 resize-none transition-all shadow-inner"
            />
            {/* Voice Button */}
            <div className="absolute bottom-3 right-3">
              <VoiceButton
                onTranscript={(transcript) => setText((prev) => (prev ? prev + ' ' + transcript : transcript))}
                disabled={isExtracting}
              />
            </div>
          </div>

          {/* Sample Route Pills */}
          <div className="pt-0.5">
            <div className="text-xs font-utility text-slate-400 uppercase tracking-wider mb-2">
              Mga Sample na Ruta:
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => {
                const IconComponent = sample.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(sample.prompt)}
                    disabled={isExtracting}
                    className="sample-pill"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{sample.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={!text.trim() || isExtracting}
              className="btn-sakay-primary"
            >
              {isExtracting ? (
                <>
                  <span className="spinner-ring !w-4 !h-4" />
                  <span>Naghahanap ng Ruta...</span>
                </>
              ) : (
                <>
                  <span>Sakay!</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {(text.trim() || isExtracting) && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-transit-secondary"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Burahin</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
