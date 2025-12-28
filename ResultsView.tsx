import React from 'react';
import { DecisionResult, TimingScore } from './decision-types';

interface ResultsViewProps {
  result: DecisionResult;
  prenom: string;
  onNewDecision: () => void;
  onFeedback?: (feedback: 'positive' | 'neutral' | 'negative') => void;
}

function ScoreIndicator({ score }: { score: TimingScore }) {
  const colors = {
    'Favorable': { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-500' },
    'Neutre': { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-500' },
    'Délicat': { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-500' },
  };

  const color = colors[score];

  return (
    <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${color.bg} ${color.border} border-2`}>
      <span className={`text-lg font-serif ${color.text}`}>{score}</span>
    </div>
  );
}

export default function ResultsView({ result, prenom, onNewDecision, onFeedback }: ResultsViewProps) {
  const [feedbackGiven, setFeedbackGiven] = React.useState(false);

  const handleFeedback = (feedback: 'positive' | 'neutral' | 'negative') => {
    setFeedbackGiven(true);
    if (onFeedback) {
      onFeedback(feedback);
    }
  };

  return (
    <div className="max-w-4xl mx-auto fade-in space-y-8 pb-32 px-6">
      {/* Header */}
      <header className="text-center pt-12">
        <p className="text-[#C5A059] text-[10px] tracking-[0.6em] uppercase mb-4">Analyse Complète</p>
        <h2 className="text-5xl font-serif text-white gold-glow mb-4">{prenom}</h2>
        <p className="text-stone-500">Voici ton analyse de décision</p>
      </header>

      {/* 1. Reformulation */}
      <section className="glass p-8 rounded-[2.5rem] gold-border">
        <h3 className="text-sm uppercase tracking-[0.3em] text-stone-500 mb-4">Ta Situation</h3>
        <p className="text-stone-200 text-lg leading-relaxed font-serif">
          {result.reformulation}
        </p>
      </section>

      {/* 2. Score de Timing */}
      <section className="glass p-10 rounded-[2.5rem] border-2 border-[#C5A059]/30">
        <h3 className="text-sm uppercase tracking-[0.3em] text-[#C5A059] mb-6 text-center">Timing Numérologique</h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreIndicator score={result.timing.score} />
          </div>
          <div className="flex-1">
            <p className="text-stone-300 leading-relaxed">
              {result.timing.explication}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Trois Scénarios */}
      <section>
        <h3 className="text-sm uppercase tracking-[0.3em] text-stone-500 mb-6 text-center">3 Scénarios Possibles</h3>
        <div className="space-y-4">
          {result.scenarios.map((scenario, index) => (
            <div key={index} className="glass p-8 rounded-[2rem] gold-border">
              <h4 className="text-xl font-serif text-[#C5A059] mb-4">{scenario.titre}</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-green-500/70 mb-2">✓ Avantages</p>
                  <ul className="space-y-2">
                    {scenario.avantages.map((avantage, i) => (
                      <li key={i} className="text-stone-300 text-sm flex gap-2">
                        <span className="text-green-500">•</span>
                        <span>{avantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-orange-500/70 mb-2">⚠ Points de vigilance</p>
                  <ul className="space-y-2">
                    {scenario.vigilance.map((point, i) => (
                      <li key={i} className="text-stone-300 text-sm flex gap-2">
                        <span className="text-orange-500">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Micro-Actions (LE PLUS IMPORTANT) */}
      <section className="glass p-10 rounded-[2.5rem] border-2 border-[#C5A059]/50">
        <h3 className="text-sm uppercase tracking-[0.3em] text-[#C5A059] mb-2 text-center">Actions Concrètes</h3>
        <p className="text-stone-400 text-center mb-8">3 choses à faire cette semaine</p>
        <div className="space-y-4">
          {result.actions.map((action) => (
            <div key={action.numero} className="flex gap-4 items-start p-6 bg-stone-900/30 rounded-2xl border border-stone-800 hover:border-[#C5A059]/30 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center">
                <span className="text-black font-bold text-lg">{action.numero}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium mb-2 leading-relaxed">{action.texte}</p>
                <p className="text-stone-500 text-sm">{action.pourquoi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Feedback */}
      {!feedbackGiven && onFeedback && (
        <section className="glass p-8 rounded-[2rem] gold-border text-center">
          <p className="text-white mb-6">Cette analyse t'a-t-elle aidé ?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleFeedback('positive')}
              className="px-8 py-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-500/30 transition-all font-medium active:scale-95"
            >
              😊 Oui
            </button>
            <button
              onClick={() => handleFeedback('neutral')}
              className="px-8 py-4 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-all font-medium active:scale-95"
            >
              😐 Moyen
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              className="px-8 py-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition-all font-medium active:scale-95"
            >
              😞 Non
            </button>
          </div>
        </section>
      )}

      {feedbackGiven && (
        <section className="text-center">
          <p className="text-stone-500 mb-4">Merci pour ton retour ! 🙏</p>
        </section>
      )}

      {/* 6. CTA */}
      <section className="text-center pt-8">
        <button
          onClick={onNewDecision}
          className="px-12 py-5 bg-stone-100 text-black font-bold uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all shadow-2xl active:scale-95"
        >
          Nouvelle Décision
        </button>
      </section>
    </div>
  );
}
