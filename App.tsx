import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { AppStep, NumerologyProfile, AnalysisModule, AIResponse, TimingContext } from './types';
import { calculateFullProfile, ARCHETYPES } from './utils/numerology';
import { runAnalysis } from './services/mysticalEngine';
import { exportMysticalAnalysisToPDF } from './utils/pdfExport';
import { saveAnalysis } from './services/analysisService';
import AuthGate from './components/AuthGate';
import LoginPrompt from './components/LoginPrompt';

const InputField = ({ label, value, onChange, placeholder, type = "text", maxLength }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-bold text-white uppercase tracking-[0.2em] block">{label}</label>
    <input
      type={type}
      maxLength={maxLength}
      placeholder={placeholder}
      className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl outline-none focus:border-[#C5A059]/50 text-white font-serif text-lg placeholder-stone-800 transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

function AppContent() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState<AppStep>(AppStep.INITIATION);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load from localStorage on mount
  const [identity, setIdentity] = useState(() => {
    const saved = localStorage.getItem('life-decoder-identity');
    return saved ? JSON.parse(saved) : { firstName: '', lastName: '', day: '', month: '', year: '' };
  });

  const [timing, setTiming] = useState({
    questionDate: new Date().toISOString().split('T')[0],
    questionTime: new Date().toTimeString().slice(0, 5),
    actionDate: '',
    actionTime: '',
    questionType: '',
    context: ''
  });
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [analysis, setAnalysis] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'start' | 'identity' | 'temporal'>('start');

  // Save to localStorage when identity changes
  useEffect(() => {
    if (identity.firstName || identity.day || identity.month || identity.year) {
      localStorage.setItem('life-decoder-identity', JSON.stringify(identity));
    }
  }, [identity]);

  const startInitiation = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, day, month, year } = identity;
    if (!firstName || !day || !month || !year) return;
    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const prof = calculateFullProfile(firstName, '', birthDate);
    setProfile(prof);
    setStep(AppStep.NEXUS);
  };

  const runAnalysisHandler = async (mod: AnalysisModule) => {
    if (!profile) return;
    setLoading(true);
    setStep(AppStep.CONSULTATION);

    try {
      const timingCtx: TimingContext = ['decision-oracle', 'daily-alignment', 'future-timeline'].includes(mod) ? {
        questionDate: timing.questionDate,
        questionTime: timing.questionTime,
        actionDate: timing.actionDate || undefined,
        actionTime: timing.actionTime || undefined,
        questionType: timing.questionType || undefined,
        context: timing.context || undefined
      } : {};

      const res = await runAnalysis(mod, profile, timingCtx);
      setAnalysis(res);

      // Si utilisateur non connecté et c'est sa première analyse gratuite
      if (!isSignedIn) {
        localStorage.setItem('life-decoder-free-used', 'true');
        // Afficher le prompt de connexion après un délai
        setTimeout(() => {
          setShowLoginPrompt(true);
        }, 3000); // 3 secondes après avoir vu le résultat
      }

      // Save to Firebase si connecté
      if (user) {
        try {
          await saveAnalysis({
            userId: user.id,
            type: 'mystique',
            prenom: profile.firstName,
            dateNaissance: `${identity.year}-${identity.month.padStart(2, '0')}-${identity.day.padStart(2, '0')}`,
            input: { module: mod, timing: timingCtx },
            output: res
          });
          console.log('[App] Analysis saved to Firebase');
        } catch (firebaseError) {
          console.error('[App] Error saving to Firebase:', firebaseError);
          // Don't block the user flow if Firebase fails
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'analyse: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Format markdown-like text to HTML
  const formatAnalysis = (text: string) => {
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ $1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#C5A059]">$1</strong>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ $1</h3>')
      .replace(/^## (.+)$/gm, '<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ $1</h3>')
      .replace(/^\* (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, '</p>');
  };

  const starterAnalyses = [
    { id: 'life-decoder', title: 'Life Decoder Blueprint', icon: '🧬', sub: 'Commence ici : Analyse complète de ta personnalité', recommended: true },
    { id: 'soul-purpose', title: 'Soul Purpose Finder', icon: '🔮', sub: 'Ta mission de vie et ton potentiel' },
    { id: 'complete-chart', title: 'Thème Complet', icon: '📊', sub: 'Vue exhaustive de tous tes nombres' },
  ];

  const identityAnalyses = [
    { id: 'expression-profile', title: 'Expression Profile', icon: '🎯', sub: 'Talents innés et capacités naturelles' },
    { id: 'career-destiny', title: 'Career Destiny Finder', icon: '💼', sub: 'Les 3 chemins de carrière optimaux' },
    { id: 'relationship-map', title: 'Relationship Destiny Map', icon: '💕', sub: 'Ton partenaire idéal et karma amoureux' },
    { id: 'wealth-code', title: 'Wealth & Abundance Code', icon: '💰', sub: 'Stratégie pour attirer l\'abondance' },
  ];

  const temporalAnalyses = [
    { id: 'decision-oracle', title: 'Decision Timing Oracle', icon: '⚡', sub: 'Le meilleur moment pour agir' },
    { id: 'daily-alignment', title: 'Daily Alignment Guide', icon: '🌅', sub: 'Énergie du jour et de l\'instant' },
    { id: 'future-timeline', title: 'Future Timeline Guide', icon: '📅', sub: 'Roadmap des 5 prochaines années' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 font-sans p-6 md:p-12 overflow-x-hidden">

      {step === AppStep.INITIATION && (
        <div className="max-w-xl mx-auto mt-12 fade-in text-center">
          <h1 className="text-6xl font-serif gold-glow mb-4 text-white tracking-tighter">LIFE DECODER</h1>
          <p className="text-[#C5A059] text-[10px] tracking-[0.6em] mb-16 uppercase opacity-80">Architecture de la Destinée</p>

          <form onSubmit={startInitiation} className="space-y-10 glass p-10 md:p-14 rounded-[3rem] gold-border text-left">
            <div>
              <InputField label="Prénom" value={identity.firstName} onChange={(v:any) => setIdentity({...identity, firstName: v})} placeholder="Marie" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest block text-center">Date de Naissance</label>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Jour" value={identity.day} onChange={(v:any) => setIdentity({...identity, day: v})} placeholder="15" maxLength={2} />
                <InputField label="Mois" value={identity.month} onChange={(v:any) => setIdentity({...identity, month: v})} placeholder="06" maxLength={2} />
                <InputField label="Année" value={identity.year} onChange={(v:any) => setIdentity({...identity, year: v})} placeholder="1990" maxLength={4} />
              </div>
            </div>

            <button className="w-full py-6 bg-[#C5A059] text-black font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4AF37] transition-all shadow-2xl shadow-[#C5A059]/20">
              Ouvrir le Nexus
            </button>
          </form>
        </div>
      )}

      {step === AppStep.NEXUS && profile && (
        <div className="max-w-6xl mx-auto fade-in">
          <header className="text-center mb-16">
              <p className="text-[#C5A059] text-[10px] tracking-[0.6em] uppercase mb-4">Système Life Decoder Actif</p>
              <h2 className="text-6xl font-serif text-white uppercase tracking-tighter gold-glow mb-3">{profile.firstName}</h2>
              <p className="text-stone-500 text-sm">Choisis l'analyse qui résonne avec toi</p>
          </header>

          {/* Navigation Tabs - Mobile First Layout */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-12 max-w-4xl mx-auto">
              {/* Débuter - Full width on mobile, auto on desktop */}
              <button
                onClick={() => setViewMode('start')}
                className={`w-full md:w-auto px-8 py-5 md:py-4 rounded-2xl font-serif uppercase tracking-[0.3em] text-base md:text-sm transition-all ${
                  viewMode === 'start'
                    ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                    : 'glass gold-border text-stone-400 hover:text-white'
                }`}
              >
                ✦ Débuter
              </button>

              {/* Two buttons side by side on mobile */}
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={() => setViewMode('identity')}
                  className={`flex-1 md:flex-none px-4 md:px-8 py-4 rounded-2xl font-serif uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm transition-all ${
                    viewMode === 'identity'
                      ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                      : 'glass gold-border text-stone-400 hover:text-white'
                  }`}
                >
                  Analyses Approfondies
                </button>
                <button
                  onClick={() => setViewMode('temporal')}
                  className={`flex-1 md:flex-none px-4 md:px-8 py-4 rounded-2xl font-serif uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm transition-all ${
                    viewMode === 'temporal'
                      ? 'bg-[#2dd4bf] text-black shadow-lg shadow-[#2dd4bf]/20'
                      : 'glass border border-[#2dd4bf]/30 text-stone-400 hover:text-white'
                  }`}
                >
                  Oracle Temporel
                </button>
              </div>
            </div>

            {/* START VIEW */}
            {viewMode === 'start' && (
              <div className="fade-in space-y-8">
                <div className="text-center mb-10 glass p-8 rounded-[2.5rem] gold-border">
                  <h3 className="text-2xl font-serif text-[#C5A059] mb-4">Par où commencer ?</h3>
                  <p className="text-stone-400 leading-relaxed max-w-2xl mx-auto">
                    Si c'est ta première fois, nous te recommandons de commencer par le <strong className="text-white">Life Decoder Blueprint</strong> pour découvrir l'essence de ton identité numérologique.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {starterAnalyses.map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => runAnalysisHandler(m.id as AnalysisModule)}
                      className={`glass p-10 rounded-[2.5rem] text-left transition-all flex flex-col justify-between h-72 group relative overflow-hidden shadow-xl ${
                        m.recommended
                          ? 'border-2 border-[#C5A059] hover:border-[#D4AF37]'
                          : 'gold-border hover:border-[#C5A059]/60'
                      }`}
                    >
                      {m.recommended && (
                        <div className="absolute top-4 right-4 bg-[#C5A059] text-black text-[8px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                          Recommandé
                        </div>
                      )}
                      <div className="absolute -right-4 -top-4 text-8xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity font-serif">{m.icon}</div>
                      <span className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity text-[#C5A059]">{m.icon}</span>
                      <div>
                        <span className="text-2xl font-serif text-white block mb-3">{m.title}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">{m.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* IDENTITY VIEW */}
            {viewMode === 'identity' && (
              <div className="fade-in">
                <h3 className="text-[10px] uppercase tracking-[0.6em] text-stone-600 mb-8 text-center">Analyses Spécialisées d'Identité</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {identityAnalyses.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => runAnalysisHandler(m.id as AnalysisModule)}
                      className="glass p-10 rounded-[2.5rem] gold-border text-left hover:border-[#C5A059]/60 transition-all flex flex-col justify-between h-64 group relative overflow-hidden shadow-xl hover:shadow-[#C5A059]/5"
                    >
                      <div className="absolute -right-4 -top-4 text-8xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity font-serif">{m.icon}</div>
                      <span className="text-3xl opacity-40 group-hover:opacity-100 transition-opacity text-[#C5A059]">{m.icon}</span>
                      <div>
                        <span className="text-2xl font-serif text-white block mb-2">{m.title}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest">{m.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TEMPORAL VIEW */}
            {viewMode === 'temporal' && (
              <div className="fade-in space-y-8">
                {/* Timing Input */}
                <div className="glass p-10 rounded-[3rem] border border-[#2dd4bf]/30">
                  <h3 className="text-[10px] uppercase tracking-[0.6em] text-[#2dd4bf] mb-8 text-center">Configure ton Oracle Temporel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField label="Date question" type="date" value={timing.questionDate} onChange={(v:any) => setTiming({...timing, questionDate: v})} />
                    <InputField label="Heure question" type="time" value={timing.questionTime} onChange={(v:any) => setTiming({...timing, questionTime: v})} />
                    <InputField label="Date action (optionnel)" type="date" value={timing.actionDate} onChange={(v:any) => setTiming({...timing, actionDate: v})} />
                    <InputField label="Heure action (optionnel)" type="time" value={timing.actionTime} onChange={(v:any) => setTiming({...timing, actionTime: v})} />
                  </div>
                  <select
                    className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl text-white mb-4"
                    value={timing.questionType}
                    onChange={e => setTiming({...timing, questionType: e.target.value})}
                  >
                    <option value="">Type de question...</option>
                    <option value="decision">🎯 Prise de décision</option>
                    <option value="project">🚀 Lancement de projet</option>
                    <option value="love">💕 Amour / Relation</option>
                    <option value="career">💼 Carrière / Travail</option>
                    <option value="money">💰 Argent / Investissement</option>
                  </select>
                  <textarea
                    className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl text-white min-h-[80px]"
                    placeholder="Contexte de ta question..."
                    value={timing.context}
                    onChange={e => setTiming({...timing, context: e.target.value})}
                  />
                </div>

                <h3 className="text-[10px] uppercase tracking-[0.6em] text-[#2dd4bf] mb-8 text-center">Choisis ton Analyse Temporelle</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {temporalAnalyses.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => runAnalysisHandler(m.id as AnalysisModule)}
                      className="glass p-10 rounded-[2.5rem] border border-[#2dd4bf]/30 text-left hover:border-[#2dd4bf]/60 transition-all flex flex-col justify-between h-64 group relative overflow-hidden shadow-xl hover:shadow-[#2dd4bf]/5"
                    >
                      <div className="absolute -right-4 -top-4 text-8xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity font-serif">{m.icon}</div>
                      <span className="text-3xl opacity-40 group-hover:opacity-100 transition-opacity text-[#2dd4bf]">{m.icon}</span>
                      <div>
                        <span className="text-2xl font-serif text-white block mb-2">{m.title}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest">{m.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === AppStep.CONSULTATION && (
        <div className="max-w-4xl mx-auto fade-in space-y-12 pb-32">
          {loading ? (
            <div className="fixed inset-0 bg-black/98 flex flex-col items-center justify-center z-50">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-[1px] border-stone-900 rounded-full"></div>
                <div className="absolute inset-0 border-t-[2px] border-[#C5A059] rounded-full animate-spin"></div>
                <div className="absolute inset-8 border-[1px] border-stone-900 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[12px] text-[#C5A059] font-serif tracking-[0.6em] uppercase gold-glow animate-pulse text-center leading-loose">Synchronisation<br/>Temporelle</span>
                </div>
              </div>
              <p className="mt-16 text-stone-600 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">L'Oracle consulte les astres...</p>
            </div>
          ) : analysis && (
            <>
              <header className="text-center">
                <h2 className="text-5xl font-serif text-white gold-glow mb-6 uppercase tracking-tighter">Analyse Complète</h2>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mx-auto"></div>
              </header>

              <div className="glass p-12 rounded-[3.5rem] gold-border relative">
                <div
                  className="text-xl text-white leading-relaxed font-serif"
                  dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis.analysis) }}
                />
              </div>

              <div className="text-center pt-16 space-y-4">
                <button
                  onClick={() => exportMysticalAnalysisToPDF(analysis.analysis, profile)}
                  className="px-10 py-4 bg-[#C5A059]/10 border-2 border-[#C5A059] text-[#C5A059] font-bold uppercase tracking-[0.3em] rounded-3xl hover:bg-[#C5A059] hover:text-black transition-all shadow-lg active:scale-95"
                >
                  📄 Télécharger PDF
                </button>
                <br />
                <button onClick={() => setStep(AppStep.NEXUS)} className="px-20 py-6 bg-stone-100 text-black font-bold uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all shadow-2xl active:scale-95">Retour au Nexus</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Login Prompt après analyse gratuite */}
      {showLoginPrompt && !isSignedIn && <LoginPrompt />}
    </div>
  );
}

export default function App() {
  // Check if user has used their free analysis
  const hasUsedFree = localStorage.getItem('life-decoder-free-used') === 'true';

  return (
    <AuthGate allowFreeAccess={!hasUsedFree}>
      <AppContent />
    </AuthGate>
  );
}
