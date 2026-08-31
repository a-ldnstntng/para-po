type SpeechCallback = (transcript: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;

let recognition: SpeechRecognition | null = null;

export function isSpeechSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function startListening(
  onResult: SpeechCallback,
  onError: ErrorCallback,
  onEnd: () => void
): void {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'fil-PH'; // Filipino/Tagalog - also understands English
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    if (finalTranscript) {
      onResult(finalTranscript, true);
    } else if (interimTranscript) {
      onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    const errorMessages: Record<string, string> = {
      'no-speech': 'Walang narinig. Subukan ulit.',
      'audio-capture': 'Hindi mahanap ang microphone.',
      'not-allowed': 'I-allow ang microphone access sa browser.',
      'network': 'Network error. Check ang internet connection.',
    };
    onError(errorMessages[event.error] || `Error: ${event.error}`);
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.start();
}

export function stopListening(): void {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}
