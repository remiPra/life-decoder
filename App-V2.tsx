import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { NumerologyProfile } from './types';
import { calculateNumerology } from './utils/numerology';
import { saveAnalysis } from './services/analysisService';
import AuthGate from './components/AuthGate';
import { useFreeAnalyses } from './hooks/useFreeAnalyses';

type AppStep = 'welcome' | 'form' | 'loading' | 'results';

function AppContent() {
  const { user } = useUser();
  const { consumeAnalysis } = useFreeAnalyses();
  const [step, setStep] = useState<AppStep>('welcome');

  // Load from localStorage on mount
  const [prenom, setPrenom] = useState(() => {
    return localStorage.getItem('life-decoder-v2-prenom') || '';
  });
  const [dateNaissance, setDateNaissance] = useState(() => {
    return localStorage.getItem('life-decoder-v2-dateNaissance') || '';
  });
  const [dateAction, setDateAction] = useState('');
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage when they change
  useEffect(() => {
    if (prenom) localStorage.setItem('life-decoder-v2-prenom', prenom);
  }, [prenom]);

  useEffect(() => {
    if (dateNaissance) localStorage.setItem('life-decoder-v2-dateNaissance', dateNaissance);
  }, [dateNaissance]);

  const handleStart = () => {
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prenom || !dateNaissance || !dateAction || !question) {
      setError('Merci de remplir tous les champs');
      return;
    }

    setStep('loading');
    setError(null);

    // Consommer une analyse gratuite si non connecté
    if (!user) {
      consumeAnalysis();
    }

    try {
      // Calculer la numérologie
      const profile = calculateNumerology(prenom, dateNaissance);
      const actionProfile = calculateNumerology(prenom, dateAction);

      // Appeler l'API d'analyse
      const prompt = `Tu es Life Decoder, un expert en numérologie et aide à la décision.

PROFIL DE LA PERSONNE:
- Prénom: ${prenom}
- Date de naissance: ${dateNaissance}
- Chemin de vie: ${profile.lifePath}
- Nombre d'expression: ${profile.expression}
- Année personnelle actuelle: ${profile.personalYear}

DATE DE L'ACTION ENVISAGÉE:
- Date: ${dateAction}
- Année personnelle: ${actionProfile.personalYear}
- Mois personnel: ${actionProfile.personalMonth}
- Jour personnel: ${actionProfile.personalDay}

QUESTION/ACTION:
${question}

MISSION:
Analyse cette situation et donne:
1. **Alignement numérologique** - Est-ce que cette date est favorable pour cette personne?
2. **Points forts** - Pourquoi cette période peut être bénéfique
3. **Points de vigilance** - Ce à quoi faire attention
4. **Conseil pratique** - Une recommandation concrète

Ton analyse doit être:
- Claire et directe
- Basée sur la numérologie
- Positive mais honnête
- Avec des conseils actionnables

Format de réponse en HTML avec des balises simples (h2, p, strong, em, ul, li).`;

      const apiEndpoint = user ? '/api/analyze-mystical' : '/api/analyze-fast';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: 'Tu es Life Decoder, expert en numérologie et aide à la décision.',
          prompt
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const analysisResult = data.choices[0].message.content || 'Aucune analyse reçue.';

      setAnalysis(analysisResult);
      setStep('results');

      // Sauvegarder dans Firebase si connecté
      if (user) {
        try {
          await saveAnalysis({
            userId: user.id,
            type: 'rational',
            prenom,
            dateNaissance,
            input: {
              dateAction,
              question
            },
            output: analysisResult
          });
          console.log('[App-V2] Analysis saved to Firebase');
        } catch (firebaseError) {
          console.error('[App-V2] Error saving to Firebase:', firebaseError);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error analyzing:', err);
      setStep('form');
    }
  };

  const handleNewAnalysis = () => {
    setStep('welcome');
    setDateAction('');
    setQuestion('');
    setAnalysis('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 font-sans overflow-x-hidden">

      {/* WELCOME */}
      {step === 'welcome' && (
        <div className="max-w-3xl mx-auto mt-32 fade-in px-6 text-center">
          <h1 className="text-6xl font-serif text-white mb-6 gold-glow">Life Decoder</h1>
          <p className="text-xl text-stone-400 mb-12">Mode Rationnel - Analyse de timing</p>
          <button
            onClick={handleStart}
            className="px-12 py-5 bg-[#C5A059] text-black font-bold text-lg rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95 gold-glow"
          >
            Commencer l'analyse
          </button>
        </div>
      )}

      {/* FORM */}
      {step === 'form' && (
        <div className="max-w-2xl mx-auto mt-20 fade-in px-6">
          <div className="glass p-10 rounded-[2.5rem] gold-border">
            <h2 className="text-3xl font-serif text-white mb-8 text-center">Ton profil</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-stone-400 mb-2">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full bg-black/50 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none"
                  placeholder="Ton prénom"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-2">Date de naissance</label>
                <input
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="w-full bg-black/50 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-2">Date de l'action envisagée</label>
                <input
                  type="date"
                  value={dateAction}
                  onChange={(e) => setDateAction(e.target.value)}
                  className="w-full bg-black/50 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-2">Que veux-tu faire ?</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-black/50 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none min-h-[120px]"
                  placeholder="Ex: Lancer mon projet, démissionner, demander une augmentation..."
                  required
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full px-8 py-4 bg-[#C5A059] text-black font-bold rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95"
              >
                Analyser le timing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOADING */}
      {step === 'loading' && (
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
            Life Decoder analyse ton timing...
          </p>
        </div>
      )}

      {/* RESULTS */}
      {step === 'results' && (
        <div className="max-w-4xl mx-auto mt-20 fade-in px-6 pb-20">
          <div className="glass p-10 rounded-[2.5rem] gold-border">
            <h2 className="text-3xl font-serif text-white mb-8 text-center">Ton analyse</h2>

            <div className="prose prose-invert prose-stone max-w-none">
              <div dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleNewAnalysis}
                className="px-8 py-4 bg-[#C5A059] text-black font-bold rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95"
              >
                Nouvelle analyse
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthGate allowFreeAccess={true} showCounter={true}>
      <AppContent />
    </AuthGate>
  );
}
