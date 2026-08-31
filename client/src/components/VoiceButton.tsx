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
          w-8 h-8 rounded-lg flex items-center justify-center
          transition-all duration-150 border
          ${
            isListening
              ? 'bg-rose-600 border-rose-500 text-white shadow-sm animate-pulse'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 shadow-xs'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isListening ? 'Tumigil sa pakikinig' : 'Magsalita ng commute route'}
      >
        {isListening ? (
          <Square className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Mic className="w-3.5 h-3.5" />
        )}
      </button>
      {error && (
        <div className="absolute top-full mt-1.5 right-0 whitespace-nowrap text-xs font-utility bg-rose-50 text-rose-800 px-2.5 py-1 rounded border border-rose-300 z-20 shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
}
