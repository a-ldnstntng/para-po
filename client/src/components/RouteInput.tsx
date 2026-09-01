import { useState } from 'react';
import { ArrowRight, RotateCcw, ChevronDown, ChevronUp, Edit3, Sparkles } from 'lucide-react';
import VoiceButton from './VoiceButton';

interface RouteInputProps {
  onSubmit: (text: string) => void;
  onClear?: () => void;
  isExtracting: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
}

const SAMPLE_PROMPTS = [
  { label: 'Cubao ➔ Antipolo', prompt: 'Cubao papuntang Antipolo Simbahan' },
  { label: 'Monumento ➔ BGC', prompt: 'Paano magcommute mula Monumento hanggang BGC Taguig?' },
  { label: 'SM North ➔ Baclaran', prompt: 'SM North EDSA to Baclaran via MRT o Carousel' },
  { label: 'PUP ➔ QC Circle', prompt: 'Pano pumunta ng Quezon City Circle galing PUP Sta Mesa?' },
  { label: 'Buendia ➔ Intramuros', prompt: 'Buendia Makati papuntang Intramuros Manila' },
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
  // 1. COLLAPSED SUMMARY STATE (iOS Clean Activity Card)
  // -------------------------------------------------------------------------
  if (isCollapsed && text.trim()) {
    return (
      <div className="w-full ios-card p-4 sm:p-4.5 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider block">
            Kasalukuyang Byahe
          </span>
          <p className="text-sm font-body text-slate-800 font-semibold truncate mt-0.5">
            "{text}"
          </p>
        </div>
        <button
          onClick={onExpand}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-body font-bold transition-all cursor-pointer flex-shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>I-edit</span>
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. EXPANDED PRIMARY INPUT STATE
  // -------------------------------------------------------------------------
  return (
    <section className="w-full">
      <div className="ios-card p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Saan ang byahe mo?
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                I-type ang origin at destination
              </p>
            </div>
            <span className="text-[10px] font-body text-slate-400 hidden sm:inline bg-slate-100 px-2 py-1 rounded-md">
              Ctrl+Enter
            </span>
          </div>

          {/* Text input area */}
          <div className="relative w-full">
            <textarea
              id="route-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Halimbawa: 'Cubao to Antipolo' o 'Paano pumunta ng BGC galing Monumento?'"
              rows={3}
              disabled={isExtracting}
              className="w-full bg-slate-50/90 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 pr-12
                text-slate-900 font-body text-sm placeholder:text-slate-400
                focus:outline-none focus:border-orange-500/50 focus:bg-white focus:ring-3 focus:ring-orange-500/10
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

          {/* Progressive Disclosure: Examples Accordion */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>{showExamples ? 'Itago ang mga halimbawa' : 'Subukan ang halimbawa'}</span>
              {showExamples ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showExamples && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100">
                {SAMPLE_PROMPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(sample.prompt)}
                    disabled={isExtracting}
                    className="suggestion-pill text-xs py-1.5 px-3"
                  >
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Button Row */}
          <div className="flex items-center gap-3 pt-1">
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
