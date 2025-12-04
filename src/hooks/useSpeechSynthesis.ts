import { useCallback, useEffect, useState, useRef } from 'react';

interface UseSpeechSynthesisOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
}

export const useSpeechSynthesis = ({ 
  enabled = true, 
  rate = 1, 
  pitch = 1 
}: UseSpeechSynthesisOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const speak = useCallback((text: string) => {
    if (!isSupported || !enabled || prefersReducedMotion) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Try to find a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && v.name.includes('Natural')
    ) || voices.find(v => v.lang.startsWith('en-US'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, enabled, prefersReducedMotion, rate, pitch]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: isSupported && enabled && !prefersReducedMotion,
  };
};
