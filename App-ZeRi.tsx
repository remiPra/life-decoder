import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { exportMysticalAnalysisToPDF } from './utils/pdfExport';
import { saveAnalysis } from './services/analysisService';
import AuthGate from './components/AuthGate';

type Step = 'input' | 'loading' | 'results';
type DecisionType = 'mariage' | 'business' | 'demenagement' | 'signature' | 'lancement';

interface ZeRiInput {
  prenom: string;
  dateNaissance: string;
  decisionType: DecisionType;
  periode: string; // ex: "mars 2025"
  details: string;
}

function AppZeRiContent() {
  const { user } = useUser();
  const [step, setStep] = useState<Step>('input');
  const [input, setInput] = useState<ZeRiInput>({
    prenom: '',
    dateNaissance: '',
    decisionType: 'business',
    periode: '',
    details: ''
  });
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const decisionTypes = {
    mariage: { icon: '💍', label: 'Mariage / Union', desc: 'Célébration et engagement' },
    business: { icon: '💼', label: 'Business / Carrière', desc: 'Signature, lancement, investissement' },
    demenagement: { icon: '🏠', label: 'Déménagement', desc: 'Changement de lieu de vie' },
    signature: { icon: '✍️', label: 'Contrat / Signature', desc: 'Engagement juridique ou financier' },
    lancement: { icon: '🚀', label: 'Lancement de projet', desc: 'Début d\'une nouvelle entreprise' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('loading');

    // Appel API pour 择日 analysis
    const prompt = `Tu es un expert en 择日 (Zé Rì), la sélection de dates favorables selon le calendrier lunaire chinois.

PROFIL:
- Prénom: ${input.prenom}
- Date de naissance: ${input.dateNaissance}
- Type de décision: ${decisionTypes[input.decisionType].label}
- Période souhaitée: ${input.periode}
- Détails: ${input.details}

MISSION:
Analyse selon le calendrier lunaire chinois et propose 3 à 5 dates favorables pour cette décision dans la période demandée.

Pour chaque date, donne:
1. La date exacte (jour/mois/année)
2. L'élément chinois dominant (Bois, Feu, Terre, Métal, Eau)
3. Pourquoi cette date est favorable
4. Une recommandation d'action spécifique

Ton analyse doit être:
- Structurée et claire
- Basée sur les principes Wu Xing (5 éléments)
- Respectueuse de la tradition 择日
- Pragmatique et utilisable

Format de réponse en HTML avec des balises simples (p, strong, em, ul, li).`;

    try {
      const response = await fetch('/api/analyze-mystical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: 'Tu es un expert en calendrier lunaire chinois et 择日.',
          prompt
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const analysisResult = data.choices[0].message.content || 'Aucune analyse reçue.';
      setAnalysis(analysisResult);
      setStep('results');

      // Save to Firebase
      if (user) {
        try {
          await saveAnalysis({
            userId: user.id,
            type: 'zeri',
            prenom: input.prenom,
            dateNaissance: input.dateNaissance,
            input: {
              decisionType: input.decisionType,
              periode: input.periode,
              details: input.details
            },
            output: analysisResult
          });
          console.log('[App-ZeRi] Analysis saved to Firebase');
        } catch (firebaseError) {
          console.error('[App-ZeRi] Error saving to Firebase:', firebaseError);
          // Don't block the user flow if Firebase fails
        }
      }
    } catch (error) {
      console.error(error);
      setAnalysis('Erreur lors de l\'analyse. Réessaie.');
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setAnalysis('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      {/* Header */}
      <header className="text-center mb-16 fade-in">
        <div className="inline-block mb-4">
          <span className="text-6xl">🌙</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-serif text-[#C5A059] gold-glow mb-4 uppercase tracking-tighter">
          择日
        </h1>
        <p className="text-xl text-stone-400 mb-2">Zé Rì</p>
        <p className="text-sm text-stone-500 uppercase tracking-widest">
          Sélection de Dates Favorables
        </p>
        <div className="h-px w-64 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mx-auto mt-8"></div>
      </header>

      {/* Input Form */}
      {step === 'input' && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 fade-in">
          {/* Prénom */}
          <div>
            <label className="text-stone-400 text-sm uppercase tracking-wider block mb-2">
              Prénom
            </label>
            <input
              type="text"
              required
              value={input.prenom}
              onChange={(e) => setInput({ ...input, prenom: e.target.value })}
              className="w-full glass p-4 rounded-xl border border-stone-700 focus:border-[#C5A059] outline-none text-white"
              placeholder="Ton prénom"
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label className="text-stone-400 text-sm uppercase tracking-wider block mb-2">
              Date de naissance
            </label>
            <input
              type="date"
              required
              value={input.dateNaissance}
              onChange={(e) => setInput({ ...input, dateNaissance: e.target.value })}
              className="w-full glass p-4 rounded-xl border border-stone-700 focus:border-[#C5A059] outline-none text-white"
            />
          </div>

          {/* Type de décision */}
          <div>
            <label className="text-stone-400 text-sm uppercase tracking-wider block mb-4">
              Type de décision
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(decisionTypes).map(([key, { icon, label, desc }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInput({ ...input, decisionType: key as DecisionType })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    input.decisionType === key
                      ? 'bg-[#C5A059]/20 border-2 border-[#C5A059]'
                      : 'glass border border-stone-700 hover:border-stone-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-white font-medium mb-1">{label}</div>
                  <div className="text-xs text-stone-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Période */}
          <div>
            <label className="text-stone-400 text-sm uppercase tracking-wider block mb-2">
              Période souhaitée
            </label>
            <input
              type="text"
              required
              value={input.periode}
              onChange={(e) => setInput({ ...input, periode: e.target.value })}
              className="w-full glass p-4 rounded-xl border border-stone-700 focus:border-[#C5A059] outline-none text-white"
              placeholder="ex: mars 2025, printemps 2025, prochaines semaines..."
            />
          </div>

          {/* Détails */}
          <div>
            <label className="text-stone-400 text-sm uppercase tracking-wider block mb-2">
              Détails (optionnel)
            </label>
            <textarea
              value={input.details}
              onChange={(e) => setInput({ ...input, details: e.target.value })}
              rows={4}
              className="w-full glass p-4 rounded-xl border border-stone-700 focus:border-[#C5A059] outline-none text-white resize-none"
              placeholder="Ajoute des précisions sur ta décision..."
            />
          </div>

          {/* Submit */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="px-12 py-5 bg-[#C5A059] text-black font-bold uppercase tracking-[0.3em] rounded-3xl hover:bg-[#D4AF37] transition-all shadow-2xl shadow-[#C5A059]/20 active:scale-95"
            >
              Consulter l'Oracle 择日
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {step === 'loading' && (
        <div className="fixed inset-0 bg-black/98 flex flex-col items-center justify-center z-50">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 border-[1px] border-stone-900 rounded-full"></div>
            <div className="absolute inset-0 border-t-[2px] border-[#C5A059] rounded-full animate-spin"></div>
            <div className="absolute inset-8 border-[1px] border-stone-900 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">🌙</span>
            </div>
          </div>
          <p className="mt-16 text-stone-600 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">
            L'Oracle consulte le calendrier lunaire...
          </p>
        </div>
      )}

      {/* Results */}
      {step === 'results' && (
        <div className="max-w-4xl mx-auto fade-in space-y-12 pb-32">
          <header className="text-center">
            <h2 className="text-5xl font-serif text-white gold-glow mb-6 uppercase tracking-tighter">
              Dates Favorables
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mx-auto"></div>
          </header>

          <div className="glass p-12 rounded-[3.5rem] gold-border relative">
            <div
              className="text-xl text-white leading-relaxed font-serif"
              dangerouslySetInnerHTML={{ __html: analysis }}
            />
          </div>

          <div className="text-center pt-16 space-y-4">
            <button
              onClick={() => exportMysticalAnalysisToPDF(analysis, null)}
              className="px-10 py-4 bg-[#C5A059]/10 border-2 border-[#C5A059] text-[#C5A059] font-bold uppercase tracking-[0.3em] rounded-3xl hover:bg-[#C5A059] hover:text-black transition-all shadow-lg active:scale-95"
            >
              📄 Télécharger PDF
            </button>
            <br />
            <button
              onClick={handleReset}
              className="px-20 py-6 bg-stone-100 text-black font-bold uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all shadow-2xl active:scale-95"
            >
              Nouvelle Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppZeRi() {
  return (
    <AuthGate>
      <AppZeRiContent />
    </AuthGate>
  );
}
