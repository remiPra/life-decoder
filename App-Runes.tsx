import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import AuthGate from './components/AuthGate';
import { useFreeAnalyses } from './hooks/useFreeAnalyses';
import { saveAnalysis } from './services/analysisService';
import SEOHead from './components/SEOHead';

type AppStep = 'welcome' | 'form' | 'loading' | 'results';

type InvestmentType = 'crypto' | 'actions' | 'immobilier' | 'startup' | 'general';

const RUNES = [
  { name: 'Fehu', symbol: 'ᚠ', signification: 'Richesse, possession, gain matériel' },
  { name: 'Uruz', symbol: 'ᚢ', signification: 'Force, énergie brute, opportunité' },
  { name: 'Thurisaz', symbol: 'ᚦ', signification: 'Protection, défense, prudence' },
  { name: 'Ansuz', symbol: 'ᚨ', signification: 'Communication, sagesse, révélation' },
  { name: 'Raidho', symbol: 'ᚱ', signification: 'Voyage, mouvement, progression' },
  { name: 'Kenaz', symbol: 'ᚲ', signification: 'Connaissance, illumination, clarté' },
  { name: 'Gebo', symbol: 'ᚷ', signification: 'Partenariat, échange, équilibre' },
  { name: 'Wunjo', symbol: 'ᚹ', signification: 'Joie, harmonie, succès' },
  { name: 'Hagalaz', symbol: 'ᚺ', signification: 'Disruption, changement brutal, chaos' },
  { name: 'Nauthiz', symbol: 'ᚾ', signification: 'Nécessité, contrainte, limitation' },
  { name: 'Isa', symbol: 'ᛁ', signification: 'Stagnation, attente, patience' },
  { name: 'Jera', symbol: 'ᛃ', signification: 'Cycle, récolte, timing parfait' },
  { name: 'Eihwaz', symbol: 'ᛇ', signification: 'Endurance, transformation, défense' },
  { name: 'Perthro', symbol: 'ᛈ', signification: 'Destin, mystère, potentiel caché' },
  { name: 'Algiz', symbol: 'ᛉ', signification: 'Protection divine, intuition, alertness' },
  { name: 'Sowilo', symbol: 'ᛊ', signification: 'Victoire, succès, énergie solaire' },
  { name: 'Tiwaz', symbol: 'ᛏ', signification: 'Justice, victoire, courage' },
  { name: 'Berkano', symbol: 'ᛒ', signification: 'Croissance, naissance, fertilité' },
  { name: 'Ehwaz', symbol: 'ᛖ', signification: 'Mouvement, progrès, collaboration' },
  { name: 'Mannaz', symbol: 'ᛗ', signification: 'Humanité, réseau, intelligence collective' },
  { name: 'Laguz', symbol: 'ᛚ', signification: 'Flux, intuition, émotions' },
  { name: 'Ingwaz', symbol: 'ᛜ', signification: 'Fertilité, potentiel, gestation' },
  { name: 'Dagaz', symbol: 'ᛞ', signification: 'Percée, transformation, aube nouvelle' },
  { name: 'Othala', symbol: 'ᛟ', signification: 'Héritage, patrimoine, racines' }
];

const investmentTypes = {
  crypto: { icon: '₿', label: 'Cryptomonnaie', desc: 'Bitcoin, Ethereum, Altcoins' },
  actions: { icon: '📈', label: 'Actions / Bourse', desc: 'Trading, investissement long terme' },
  immobilier: { icon: '🏠', label: 'Immobilier', desc: 'Achat, vente, location' },
  startup: { icon: '🚀', label: 'Startup / Business', desc: 'Investissement entrepreneurial' },
  general: { icon: '💰', label: 'Général', desc: 'Stratégie financière globale' }
};

function AppContent() {
  const { user } = useUser();
  const { consumeAnalysis } = useFreeAnalyses();
  const [step, setStep] = useState<AppStep>('welcome');

  const [prenom, setPrenom] = useState(() => {
    return localStorage.getItem('life-decoder-runes-prenom') || '';
  });
  const [investmentType, setInvestmentType] = useState<InvestmentType>('crypto');
  const [question, setQuestion] = useState('');
  const [drawnRunes, setDrawnRunes] = useState<typeof RUNES>([]);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prenom) localStorage.setItem('life-decoder-runes-prenom', prenom);
  }, [prenom]);

  const handleStart = () => {
    setStep('form');
  };

  const drawThreeRunes = () => {
    const shuffled = [...RUNES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prenom || !question) {
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
      // Tirer 3 runes
      const runes = drawThreeRunes();
      setDrawnRunes(runes);

      // Appeler l'API d'analyse
      const prompt = `Tu es un expert en divination runique appliquée aux investissements et à la finance.

PROFIL:
- Prénom: ${prenom}
- Type d'investissement: ${investmentTypes[investmentType].label}
- Question: ${question}

TIRAGE DES 3 RUNES:
1. **${runes[0].name} (${runes[0].symbol})** - Passé/Contexte: ${runes[0].signification}
2. **${runes[1].name} (${runes[1].symbol})** - Présent/Situation: ${runes[1].signification}
3. **${runes[2].name} (${runes[2].symbol})** - Futur/Résultat: ${runes[2].signification}

MISSION:
Interprète ce tirage de runes dans le contexte de l'investissement et donne:

1. **Interprétation générale** - Que disent les runes sur cette situation d'investissement?
2. **Signal de marché** - Les runes indiquent-elles un moment favorable ou défavorable?
3. **Stratégie recommandée** - Quelle approche adopter? (Agressif, Prudent, Attendre, etc.)
4. **Points de vigilance** - Risques ou obstacles révélés par les runes
5. **Timing suggéré** - Quand agir selon l'énergie des runes?
6. **Conseil final** - Une recommandation concrète pour cet investissement

Ton analyse doit être:
- Mystique mais applicable au trading/investissement
- Basée sur la symbolique runique nordique
- Avec des conseils actionnables pour un investisseur
- Tonalité sérieuse et professionnelle (pas new age)

Format de réponse en HTML avec des balises simples (h2, p, strong, em, ul, li).`;

      const apiEndpoint = user ? '/api/analyze-mystical' : '/api/analyze-fast';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: 'Tu es un expert en divination runique appliquée aux investissements financiers.',
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
            type: 'runes',
            prenom,
            dateNaissance: '', // Pas de date de naissance pour les runes
            input: {
              investmentType,
              question,
              runes: runes.map(r => `${r.name} (${r.symbol})`)
            },
            output: analysisResult
          });
          console.log('[App-Runes] Analysis saved to Firebase');
        } catch (firebaseError) {
          console.error('[App-Runes] Error saving to Firebase:', firebaseError);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error analyzing:', err);
      setStep('form');
    }
  };

  const handleNewReading = () => {
    setStep('welcome');
    setQuestion('');
    setDrawnRunes([]);
    setAnalysis('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 font-sans overflow-x-hidden">

      <SEOHead
        title="Runes Investisseur — Divination Runique pour Crypto & Trading | Life Decoder"
        description="Oracle runique nordique pour traders crypto, investisseurs et entrepreneurs. Tirage des runes du Futhark Elder pour guider vos décisions financières."
        keywords="runes, divination, crypto, trading, investissement, bitcoin, ethereum, futhark, oracle financier, signaux trading"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Divination Runique pour Investisseurs",
          "provider": {
            "@type": "Organization",
            "name": "Life Decoder"
          },
          "description": "Tirage de runes nordiques appliqué aux investissements crypto, actions, immobilier et startups"
        }}
      />

      {/* WELCOME */}
      {step === 'welcome' && (
        <div className="max-w-3xl mx-auto mt-32 fade-in px-6 text-center">
          <div className="text-8xl mb-6">ᚱᚢᚾᛖᛋ</div>
          <h1 className="text-6xl font-serif text-white mb-6 gold-glow">Runes Investisseur</h1>
          <p className="text-xl text-stone-400 mb-4">Divination runique pour traders & investisseurs</p>
          <p className="text-sm text-stone-600 mb-12 max-w-xl mx-auto">
            Consulte les runes nordiques pour obtenir des signaux intuitifs sur tes investissements crypto, actions et opportunités financières.
          </p>
          <button
            onClick={handleStart}
            className="px-12 py-5 bg-[#C5A059] text-black font-bold text-lg rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95 gold-glow"
          >
            Consulter les runes
          </button>
        </div>
      )}

      {/* FORM */}
      {step === 'form' && (
        <div className="max-w-2xl mx-auto mt-20 fade-in px-6">
          <div className="glass p-10 rounded-[2.5rem] gold-border">
            <h2 className="text-3xl font-serif text-white mb-8 text-center">Prépare ton tirage</h2>

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
                <label className="block text-sm text-stone-400 mb-3">Type d'investissement</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(investmentTypes).map(([key, type]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setInvestmentType(key as InvestmentType)}
                      className={`p-4 rounded-xl transition-all text-left ${
                        investmentType === key
                          ? 'bg-[#C5A059] text-black'
                          : 'glass border border-stone-700 hover:border-[#C5A059]/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-semibold">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-2">Ta question d'investissement</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-black/50 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none min-h-[120px]"
                  placeholder="Ex: Dois-je acheter du Bitcoin maintenant? Est-ce le bon moment pour vendre mes actions Tesla? Faut-il investir dans cette startup?"
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
                Tirer les 3 runes sacrées
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
              <span className="text-[40px] text-[#C5A059] font-serif gold-glow animate-pulse">
                ᚱᚢᚾᛖᛋ
              </span>
            </div>
          </div>
          <p className="mt-16 text-stone-600 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">
            Les runes révèlent ton destin financier...
          </p>
        </div>
      )}

      {/* RESULTS */}
      {step === 'results' && (
        <div className="max-w-4xl mx-auto mt-20 fade-in px-6 pb-20">
          {/* Runes tirées */}
          <div className="mb-10">
            <h3 className="text-2xl font-serif text-center text-[#C5A059] mb-6">Tes 3 runes sacrées</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {drawnRunes.map((rune, idx) => (
                <div key={idx} className="glass p-6 rounded-xl gold-border text-center">
                  <div className="text-6xl mb-3 text-[#C5A059] gold-glow">{rune.symbol}</div>
                  <div className="text-lg font-serif text-white mb-2">{rune.name}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">
                    {idx === 0 ? 'Passé/Contexte' : idx === 1 ? 'Présent/Situation' : 'Futur/Résultat'}
                  </div>
                  <div className="text-sm text-stone-400">{rune.signification}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse */}
          <div className="glass p-10 rounded-[2.5rem] gold-border">
            <h2 className="text-3xl font-serif text-white mb-8 text-center">Interprétation runique</h2>

            <div className="prose prose-invert prose-stone max-w-none">
              <div dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleNewReading}
                className="px-8 py-4 bg-[#C5A059] text-black font-bold rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95"
              >
                Nouveau tirage
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
