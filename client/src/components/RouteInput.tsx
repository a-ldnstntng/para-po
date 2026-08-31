import { useState } from 'react';
import { ArrowRight, RotateCcw, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import VoiceButton from './VoiceButton';

interface RouteInputProps {
  onSubmit: (text: string) => void;
  onClear?: () => void;
  isExtracting: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
}

const SAMPLE_PROMPTS = [
  { label: 'Cubao ➔ Antipolo', prompt: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons Antipolo.' },
  { label: 'SM North ➔ Baclaran', prompt: 'From SM North EDSA, take MRT-3 to Taft Avenue, then jeep to Baclaran Redemptorist.' },
  { label: 'Shaw ➔ Kapitolyo', prompt: 'Mula Shaw MRT Station, mag-trike papuntang Kapitolyo Pasig tapos lakad sa Commons.' },
  { label: 'SJDM ➔ PUP Sta. Mesa', prompt: 'Galing SJDM Bulacan, sakay ng bus pa-Cubao, tapos LRT-2 to Pureza, then trike to PUP Sta Mesa.' },
];

export default function RouteInput({
  onSubmit,
  onClear,
  isExtracting,
  isCollapsed = false,
  onExpand,
}: RouteInputProps) {
  const [text, setText] = useState('');
  const [showExamples, setShowExamples] = useState(false);

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

  // -------------------------------------------------------------------------
  // 1. COLLAPSED STATE (After route generated — frees up screen space)
  // -------------------------------------------------------------------------
  if (isCollapsed && text.trim()) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-utility font-semibold text-slate-400 uppercase tracking-wider block">
            Hinanap na Byahe:
          </span>
          <p className="text-xs sm:text-sm font-body text-slate-800 font-medium truncate">
            "{text}"
          </p>
        </div>
        <button
          onClick={onExpand}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-utility font-bold transition-all cursor-pointer flex-shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Baguhin</span>
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. EXPANDED PRIMARY TASK INPUT STATE
  // -------------------------------------------------------------------------
  return (
    <section className="w-full">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="route-input"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-wide uppercase"
            >
              Saan ang byahe mo?
            </label>
            <span className="text-[11px] font-utility text-slate-400 hidden sm:inline">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">Ctrl+Enter</kbd>
            </span>
          </div>

          {/* Text input area */}
          <div className="relative w-full">
            <textarea
              id="route-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Halimbawa: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons.'"
              rows={3}
              disabled={isExtracting}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl p-3.5 sm:p-4 pr-12
                text-slate-900 font-body text-sm sm:text-base placeholder:text-slate-400
                focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800
                disabled:opacity-50 resize-none transition-all"
            />
            {/* Voice Button */}
            <div className="absolute bottom-3 right-3">
              <VoiceButton
                onTranscript={(transcript) => setText((prev) => (prev ? prev + ' ' + transcript : transcript))}
                disabled={isExtracting}
              />
            </div>
          </div>

          {/* Progressive Disclosure: Examples Accordion Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs font-utility text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showExamples ? 'Itago ang mga halimbawa' : 'Subukan ang halimbawa'}</span>
              {showExamples ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showExamples && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                {SAMPLE_PROMPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(sample.prompt)}
                    disabled={isExtracting}
                    className="suggestion-pill text-xs py-1 px-2.5"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!text.trim() || isExtracting}
              className="btn-sakay-primary"
            >
              {isExtracting ? (
                <>
                  <span className="spinner-ring" />
                  <span>Naghahanap...</span>
                </>
              ) : (
                <>
                  <span>Sakay!</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {(text.trim() || isExtracting) && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-transit-secondary"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Burahin</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
