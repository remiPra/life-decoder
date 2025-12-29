import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { AppStep, DecisionType, DecisionInput, DecisionResult } from './decision-types';
import { NumerologyProfile } from './types';
import { analyzeDecision } from './decisionEngine';
import { saveDecision } from './storageUtils';
import { saveAnalysis } from './services/analysisService';

import Welcome from './Welcome';
import ProfileForm from './ProfileForm';
import DecisionTypeSelector from './DecisionTypeSelector';
import DecisionCanvas from './DecisionCanvas';
import ResultsView from './ResultsView';
import AuthGate from './components/AuthGate';
import LoginPrompt from './components/LoginPrompt';

function AppContent() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load from localStorage on mount
  const [prenom, setPrenom] = useState(() => {
    return localStorage.getItem('life-decoder-v2-prenom') || '';
  });
  const [dateNaissance, setDateNaissance] = useState(() => {
    return localStorage.getItem('life-decoder-v2-dateNaissance') || '';
  });

  // Save to localStorage when they change
  useEffect(() => {
    if (prenom) localStorage.setItem('life-decoder-v2-prenom', prenom);
  }, [prenom]);

  useEffect(() => {
    if (dateNaissance) localStorage.setItem('life-decoder-v2-dateNaissance', dateNaissance);
  }, [dateNaissance]);

  // Restaurer l'analyse en attente après connexion
  useEffect(() => {
    if (user && isSignedIn) {
      const pending = sessionStorage.getItem('life-decoder-pending-analysis');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          if (data.type === 'rational') {
            // Afficher l'analyse immédiatement
            setResult(data.result);
            setStep(AppStep.RESULTS);

            // Sauvegarder dans Firebase
            saveAnalysis({
              userId: user.id,
              type: data.type,
              prenom: data.prenom,
              dateNaissance: data.dateNaissance,
              input: data.decisionInput,
              output: data.result
            }).then(() => {
              console.log('[App-V2] Pending analysis saved to Firebase after login');
              sessionStorage.removeItem('life-decoder-pending-analysis');
            }).catch(err => {
              console.error('[App-V2] Error saving pending analysis:', err);
            });
          }
        } catch (err) {
          console.error('[App-V2] Error parsing pending analysis:', err);
        }
      }
    }
  }, [user, isSignedIn]);

  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [decisionType, setDecisionType] = useState<DecisionType | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStep(AppStep.PROFILE);
  };

  const handleProfileSubmit = (newPrenom: string, newDateNaissance: string, newProfile: NumerologyProfile) => {
    setPrenom(newPrenom);
    setDateNaissance(newDateNaissance);
    setProfile(newProfile);
    setStep(AppStep.DECISION_TYPE);
  };

  const handleDecisionTypeSelect = (type: DecisionType) => {
    setDecisionType(type);
    setStep(AppStep.DECISION_CANVAS);
  };

  const handleDecisionComplete = async (data: {
    situation: string;
    decision: string;
    echeance?: string;
    importance: number;
  }) => {
    if (!profile || !decisionType) return;

    setLoading(true);
    setError(null);
    setStep(AppStep.RESULTS);

    const decisionInput: DecisionInput = {
      id: crypto.randomUUID(),
      prenom,
      dateNaissance,
      anneePerso: profile.personalYear,
      moisPerso: profile.personalMonth,
      jourPerso: profile.personalDay,
      typeDecision: decisionType,
      situation: data.situation,
      decision: data.decision,
      echeance: data.echeance,
      importance: data.importance,
      createdAt: new Date()
    };

    try {
      const analysis = await analyzeDecision(decisionInput);

      const fullResult: DecisionResult = {
        id: decisionInput.id,
        ...analysis,
        createdAt: new Date()
      };

      setResult(fullResult);
      saveDecision(fullResult);

      // Si utilisateur non connecté, incrémenter le compteur et sauvegarder temporairement
      if (!isSignedIn) {
        const freeCount = parseInt(localStorage.getItem('life-decoder-free-count') || '0');
        const newCount = freeCount + 1;
        localStorage.setItem('life-decoder-free-count', newCount.toString());

        // Sauvegarder l'analyse en sessionStorage pour la récupérer après login
        const pendingAnalysis = {
          type: 'rational',
          prenom,
          dateNaissance,
          decisionInput: data,
          result: fullResult,
          createdAt: new Date().toISOString()
        };
        sessionStorage.setItem('life-decoder-pending-analysis', JSON.stringify(pendingAnalysis));

        // Si c'est la 2ème analyse (dernière gratuite), afficher le prompt
        if (newCount >= 2) {
          setTimeout(() => {
            setShowLoginPrompt(true);
          }, 3000);
        }
      }

      // Sauvegarder dans Firebase si connecté
      if (user) {
        try {
          await saveAnalysis({
            userId: user.id,
            type: 'rational',
            prenom,
            dateNaissance,
            input: data,
            output: fullResult
          });
          console.log('[App-V2] Analysis saved to Firebase');
        } catch (firebaseError) {
          console.error('[App-V2] Error saving to Firebase:', firebaseError);
          // Ne pas bloquer l'affichage des résultats si Firebase échoue
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error analyzing decision:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDecision = () => {
    setStep(AppStep.WELCOME);
    setPrenom('');
    setDateNaissance('');
    setProfile(null);
    setDecisionType(null);
    setResult(null);
    setError(null);
  };

  const handleBackFromCanvas = () => {
    setStep(AppStep.DECISION_TYPE);
  };

  const handleFeedback = (feedback: 'positive' | 'neutral' | 'negative') => {
    if (result) {
      const updatedResult = { ...result, feedback };
      setResult(updatedResult);
      saveDecision(updatedResult);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 font-sans overflow-x-hidden">
      {step === AppStep.WELCOME && (
        <Welcome onStart={handleStart} />
      )}

      {step === AppStep.PROFILE && (
        <ProfileForm onSubmit={handleProfileSubmit} />
      )}

      {step === AppStep.DECISION_TYPE && (
        <DecisionTypeSelector onSelect={handleDecisionTypeSelect} />
      )}

      {step === AppStep.DECISION_CANVAS && decisionType && (
        <DecisionCanvas
          decisionType={decisionType}
          onComplete={handleDecisionComplete}
          onBack={handleBackFromCanvas}
        />
      )}

      {step === AppStep.RESULTS && (
        <>
          {loading && (
            <div className="fixed inset-0 bg-black/98 flex flex-col items-center justify-center z-50">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-[1px] border-stone-900 rounded-full"></div>
                <div className="absolute inset-0 border-t-[2px] border-[#C5A059] rounded-full animate-spin"></div>
                <div className="absolute inset-8 border-[1px] border-stone-900 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[12px] text-[#C5A059] font-serif tracking-[0.6em] uppercase gold-glow animate-pulse text-center leading-loose">
                    Analyse<br />En Cours
                  </span>
                </div>
              </div>
              <p className="mt-16 text-stone-600 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">
                Life Decoder analyse ta situation...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="max-w-2xl mx-auto mt-20 fade-in px-6">
              <div className="glass p-10 rounded-[2.5rem] border-2 border-red-500/30 text-center">
                <p className="text-red-400 mb-6">❌ {error}</p>
                <button
                  onClick={() => setStep(AppStep.DECISION_CANVAS)}
                  className="px-8 py-4 bg-[#C5A059] text-black font-bold rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {result && !loading && !error && (
            <ResultsView
              result={result}
              prenom={prenom}
              onNewDecision={handleNewDecision}
              onFeedback={handleFeedback}
            />
          )}
        </>
      )}

      {/* Login Prompt après analyse gratuite */}
      {showLoginPrompt && !isSignedIn && <LoginPrompt />}
    </div>
  );
}

export default function App() {
  // Check if user has less than 2 free analyses left
  const freeCount = parseInt(localStorage.getItem('life-decoder-free-count') || '0');
  const allowFreeAccess = freeCount < 2;

  return (
    <AuthGate allowFreeAccess={allowFreeAccess}>
      <AppContent />
    </AuthGate>
  );
}
