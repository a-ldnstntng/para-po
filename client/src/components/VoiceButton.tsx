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
          w-12 h-12 flex items-center justify-center
          border-3 border-black font-display font-black text-lg
          transition-none
          ${
            isListening
              ? 'bg-[#FF0000] text-white shadow-[3px_3px_0px_#000000] animate-pulse'
              : 'bg-[#FFD700] text-black shadow-[3px_3px_0px_#000000] hover:bg-[#FFFFFF]'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isListening ? 'Tumigil sa pagsasalita' : 'Magsalita ng commute route'}
      >
        {isListening ? (
          <span className="w-4 h-4 bg-white block" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        )}
      </button>
      {error && (
        <div className="absolute top-full mt-1.5 right-0 whitespace-nowrap text-xs font-mono bg-[#FF0000] text-white px-2 py-1 border-2 border-black z-20">
          {error}
        </div>
      )}
    </div>
  );
}
