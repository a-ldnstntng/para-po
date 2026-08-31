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
    return null; // Don't show button if speech not supported
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-200 border-2
          ${
            isListening
              ? 'bg-jeep-red border-jeep-red text-white voice-pulse'
              : 'bg-jeep-surface border-jeep-chrome-dark text-jeep-chrome-light hover:border-jeep-chrome hover:text-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isListening ? 'Tumigil sa pakikinig' : 'Magsalita ng route'}
      >
        {isListening ? (
          <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        )}
      </button>
      {error && (
        <p className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-jeep-red bg-jeep-dark px-2 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );
}
