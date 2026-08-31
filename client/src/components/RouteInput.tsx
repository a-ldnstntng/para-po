import { useState } from 'react';
import VoiceButton from './VoiceButton';

interface RouteInputProps {
  onSubmit: (text: string) => void;
  onClear?: () => void;
  isExtracting: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'CUBAO ➔ ANTIPOLO', prompt: 'Galing Cubao, sumakay ng jeep na Antipolo. Baba sa Robinsons Antipolo.' },
  { label: 'SM NORTH ➔ BACLARAN', prompt: 'From SM North EDSA, take MRT-3 to Taft Avenue, then jeep to Baclaran Redemptorist.' },
  { label: 'SHAW ➔ KAPITOLYO', prompt: 'Mula Shaw MRT Station, mag-trike papuntang Kapitolyo Pasig tapos lakad sa Commons.' },
  { label: 'SJDM ➔ PUP STA. MESA', prompt: 'Galing SJDM Bulacan, sakay ng bus pa-Cubao, tapos LRT-2 to Pureza, then trike to PUP Sta Mesa.' },
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
      <div className="bg-[#111111] border-4 border-[#FFFFFF] shadow-[6px_6px_0px_#FF0000] p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Header row */}
          <div className="flex items-center justify-between border-b-2 border-[#333333] pb-2">
            <label htmlFor="route-input" className="font-display text-xl sm:text-2xl font-black text-[#FFD700] tracking-wider uppercase flex items-center gap-2">
              <span className="bg-[#FF0000] text-white px-2 py-0.5 text-sm font-mono font-bold">ROUTE INPUT</span>
              <span>ISULAT O SABIHIN ANG BYAHE:</span>
            </label>
            <span className="text-xs font-mono text-[#CCCCCC] hidden sm:inline">
              [CTRL+ENTER TO SUBMIT]
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
              className="w-full bg-[#000000] border-3 border-[#FFD700] p-3 sm:p-4 pr-16
                text-[#FFFFFF] font-mono text-sm sm:text-base placeholder:text-[#666666]
                focus:outline-none focus:border-[#FFFFFF] focus:bg-[#050505]
                disabled:opacity-50 resize-none transition-none"
            />
            {/* Square Voice Button */}
            <div className="absolute bottom-3 right-3">
              <VoiceButton
                onTranscript={(transcript) => setText((prev) => (prev ? prev + ' ' + transcript : transcript))}
                disabled={isExtracting}
              />
            </div>
          </div>

          {/* Sample Route Chips */}
          <div className="pt-1">
            <div className="text-xs font-mono font-bold text-[#FFD700] uppercase mb-2">
              MGA SAMPLE NA RUTA:
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(sample.prompt)}
                  disabled={isExtracting}
                  className="sign-chip"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t-2 border-[#333333]">
            <button
              type="submit"
              disabled={!text.trim() || isExtracting}
              className="brutalist-btn brutalist-btn-red text-lg sm:text-xl py-2 px-6"
            >
              {isExtracting ? (
                <>
                  <span className="loading-square" />
                  <span>INE-EXTRACT ANG RUTA...</span>
                </>
              ) : (
                <>
                  <span>EXTRACT ROUTE</span>
                  <span>➔</span>
                </>
              )}
            </button>

            {(text.trim() || isExtracting) && (
              <button
                type="button"
                onClick={handleClear}
                className="brutalist-btn brutalist-btn-dark text-base py-2 px-4"
              >
                BURAHIN / CLEAR
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
