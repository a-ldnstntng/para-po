import { useState, useCallback } from 'react';
import { Mic, Square } from 'lucide-react';
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
          w-10 h-10 rounded-lg flex items-center justify-center
          transition-all duration-150 border
          ${
            isListening
              ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/50 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-emerald-400 hover:text-emerald-300 shadow-sm'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isListening ? 'Tumigil sa pakikinig' : 'Magsalita ng commute route'}
      >
        {isListening ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
      {error && (
        <div className="absolute top-full mt-1.5 right-0 whitespace-nowrap text-xs font-utility bg-rose-950 text-rose-200 px-2.5 py-1 rounded border border-rose-700 z-20 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
