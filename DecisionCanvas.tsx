import React, { useState, useEffect, useRef } from 'react';
import { DecisionType } from './decision-types';

interface DecisionCanvasProps {
  decisionType: DecisionType;
  onComplete: (data: {
    situation: string;
    decision: string;
    echeance?: string;
    importance: number;
  }) => void;
  onBack: () => void;
}

type Step = 'situation' | 'decision' | 'echeance' | 'importance' | 'validation';

export default function DecisionCanvas({ decisionType, onComplete, onBack }: DecisionCanvasProps) {
  const [step, setStep] = useState<Step>('situation');
  const [situation, setSituation] = useState('');
  const [decision, setDecision] = useState('');
  const [echeance, setEcheance] = useState('');
  const [importance, setImportance] = useState(3);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when step changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step]);

  const handleNext = () => {
    if (step === 'situation' && situation.trim()) {
      setStep('decision');
    } else if (step === 'decision' && decision.trim()) {
      setStep('echeance');
    } else if (step === 'echeance') {
      setStep('importance');
    } else if (step === 'importance') {
      setStep('validation');
    }
  };

  const handleValidate = () => {
    onComplete({
      situation: situation.trim(),
      decision: decision.trim(),
      echeance: echeance || undefined,
      importance
    });
  };

  const typeLabels = {
    career: 'carrière',
    project: 'projet',
    relationship: 'relation'
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 fade-in px-6 pb-32">
      <button
        onClick={onBack}
        className="text-stone-500 hover:text-white mb-8 text-sm uppercase tracking-wider transition-colors"
      >
        ← Retour
      </button>

      <div ref={scrollRef} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        {/* Message d'intro */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
            <span className="text-[#C5A059]">✦</span>
          </div>
          <div className="glass p-6 rounded-2xl rounded-tl-none max-w-lg">
            <p className="text-stone-300 leading-relaxed">
              Super ! Parlons de ta décision concernant ta {typeLabels[decisionType]}.
              Je vais te poser quelques questions pour bien comprendre ta situation.
            </p>
          </div>
        </div>

        {/* Question 1 : Situation */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
            <span className="text-[#C5A059]">✦</span>
          </div>
          <div className="glass p-6 rounded-2xl rounded-tl-none max-w-lg">
            <p className="text-white font-medium mb-2">Décris ta situation actuelle en quelques mots.</p>
            <p className="text-stone-500 text-sm">Où en es-tu aujourd'hui ?</p>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && situation.trim()) {
                e.preventDefault();
                handleNext();
              }
            }}
            placeholder="Ex: Je suis dans mon poste actuel depuis 3 ans..."
            className="glass p-6 rounded-2xl rounded-tr-none max-w-lg w-full min-h-[120px] text-white placeholder-stone-700 outline-none focus:border focus:border-[#C5A059]/30 resize-none"
            autoFocus
          />
        </div>

        {situation.trim() && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={step !== 'situation'}
              className="px-6 py-3 bg-[#C5A059] text-black font-medium rounded-xl hover:bg-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Question 2 : Décision */}
        {(step !== 'situation') && (
          <>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                <span className="text-[#C5A059]">✦</span>
              </div>
              <div className="glass p-6 rounded-2xl rounded-tl-none max-w-lg">
                <p className="text-white font-medium mb-2">Quelle décision hésites-tu à prendre exactement ?</p>
                <p className="text-stone-500 text-sm">Sois le plus précis possible.</p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && decision.trim() && step === 'decision') {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder="Ex: Accepter une offre dans une startup ou rester..."
                className="glass p-6 rounded-2xl rounded-tr-none max-w-lg w-full min-h-[120px] text-white placeholder-stone-700 outline-none focus:border focus:border-[#C5A059]/30 resize-none"
                autoFocus={step === 'decision'}
              />
            </div>

            {decision.trim() && step === 'decision' && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#C5A059] text-black font-medium rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95"
                >
                  Continuer →
                </button>
              </div>
            )}
          </>
        )}

        {/* Question 3 : Échéance */}
        {(step !== 'situation' && step !== 'decision') && (
          <>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                <span className="text-[#C5A059]">✦</span>
              </div>
              <div className="glass p-6 rounded-2xl rounded-tl-none max-w-lg">
                <p className="text-white font-medium mb-2">Y a-t-il une échéance ou un timing important ?</p>
                <p className="text-stone-500 text-sm">Optionnel - laisse vide si non applicable</p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <input
                type="date"
                value={echeance}
                onChange={(e) => setEcheance(e.target.value)}
                className="glass p-4 rounded-2xl rounded-tr-none max-w-xs text-white outline-none focus:border focus:border-[#C5A059]/30"
                autoFocus={step === 'echeance'}
              />
            </div>

            {step === 'echeance' && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#C5A059] text-black font-medium rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95"
                >
                  Continuer →
                </button>
              </div>
            )}
          </>
        )}

        {/* Question 4 : Importance */}
        {step === 'importance' || step === 'validation' && (
          <>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                <span className="text-[#C5A059]">✦</span>
              </div>
              <div className="glass p-6 rounded-2xl rounded-tl-none max-w-lg">
                <p className="text-white font-medium mb-4">Sur une échelle de 1 à 5, à quel point cette décision est importante pour toi ?</p>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setImportance(value);
                        if (step === 'importance') {
                          setTimeout(() => setStep('validation'), 300);
                        }
                      }}
                      className={`w-12 h-12 rounded-xl font-bold transition-all ${
                        importance === value
                          ? 'bg-[#C5A059] text-black scale-110'
                          : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-stone-600 mt-2">
                  <span>Peu important</span>
                  <span>Très important</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Validation finale */}
        {step === 'validation' && (
          <>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                <span className="text-[#C5A059]">✦</span>
              </div>
              <div className="glass p-6 rounded-2xl rounded-tl-none max-w-lg">
                <p className="text-white font-medium mb-4">Voici ce que j'ai compris :</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-stone-500">Situation :</span>
                    <p className="text-stone-300 mt-1">{situation}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Décision :</span>
                    <p className="text-stone-300 mt-1">{decision}</p>
                  </div>
                  {echeance && (
                    <div>
                      <span className="text-stone-500">Échéance :</span>
                      <p className="text-stone-300 mt-1">{new Date(echeance).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-500">Importance :</span>
                    <p className="text-stone-300 mt-1">{importance}/5</p>
                  </div>
                </div>
                <p className="text-stone-400 mt-4 text-sm">C'est correct ?</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setStep('situation')}
                className="px-6 py-3 glass border border-stone-700 text-stone-300 font-medium rounded-xl hover:border-stone-600 transition-all active:scale-95"
              >
                Modifier
              </button>
              <button
                onClick={handleValidate}
                className="px-8 py-3 bg-[#C5A059] text-black font-bold rounded-xl hover:bg-[#D4AF37] transition-all shadow-lg shadow-[#C5A059]/20 active:scale-95"
              >
                Analyser ma décision →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
