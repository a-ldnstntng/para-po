import { useState, useCallback } from 'react';
import { isSpeechSupported, startListening, stopListening } from '../lib/speech';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceButton({ onTranscript, disabled = false }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = isSpeechSupported();

  const handleToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setError(null);
      setIsListening(true);
      startListening(
        (transcript, isFinal) => {
          if (isFinal) {
            onTranscript(transcript);
          }
        },
        (errMsg) => {
          setError(errMsg);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  }, [isListening, onTranscript]);

  if (!supported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={disabled}
        type="button"
        className={`
          w-11 h-11 rounded-xl flex items-center justify-center
          transition-all duration-150 border
          ${
            isListening
              ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/50 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-amber-400 hover:text-amber-300 shadow-md'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isListening ? 'Tumigil sa pakikinig' : 'Magsalita ng commute route'}
      >
        {isListening ? (
          <span className="w-3.5 h-3.5 rounded-sm bg-white block" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        )}
      </button>
      {error && (
        <div className="absolute top-full mt-1.5 right-0 whitespace-nowrap text-xs font-mono bg-rose-900 text-rose-200 px-2.5 py-1 rounded-lg border border-rose-700 z-20 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
