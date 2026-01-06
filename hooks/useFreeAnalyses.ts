import { useState, useEffect } from 'react';

const MAX_FREE_ANALYSES = 2;
const STORAGE_KEY = 'life-decoder-free-analyses-remaining';

export function useFreeAnalyses() {
  const [remaining, setRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : MAX_FREE_ANALYSES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, remaining.toString());
  }, [remaining]);

  const consumeAnalysis = () => {
    if (remaining > 0) {
      setRemaining(prev => prev - 1);
      return true;
    }
    return false;
  };

  const resetCounter = () => {
    setRemaining(MAX_FREE_ANALYSES);
  };

  const hasRemainingAnalyses = remaining > 0;

  return {
    remaining,
    hasRemainingAnalyses,
    consumeAnalysis,
    resetCounter,
    maxFree: MAX_FREE_ANALYSES
  };
}
