
import React, { useState, useEffect } from 'react';
import { AppStep, UserIdentity, NumerologyProfile, TimingContext, AnalysisModule, AIResponse } from './types';
import { calculateFullProfile, ARCHETYPES } from './utils/numerology';
import { consultOracle } from './services/geminiService';

const InputField = ({ label, value, onChange, placeholder, type = "text", maxLength }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-bold text-stone-600 uppercase tracking-[0.2em] block">{label}</label>
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

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INITIATION);
  const [identity, setIdentity] = useState({ firstName: '', day: '', month: '', year: '' });
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [timing, setTiming] = useState({ day: '', month: '', year: '', actionTime: '', category: 'DECISION' as any, context: '' });
  const [analysis, setAnalysis] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const startInitiation = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, day, month, year } = identity;
    if (!firstName || !day || !month || !year) return;
    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const prof = calculateFullProfile(firstName, birthDate);
    setProfile(prof as any);
    setStep(AppStep.NEXUS);
  };

  const runAnalysis = async (mod: AnalysisModule) => {
    if (!profile) return;
    setLoading(true);
    try {
      const timingCtx: TimingContext | undefined = (mod === 'TIMING_ORACLE') ? {
        actionDate: `${timing.year}-${timing.month.padStart(2, '0')}-${timing.day.padStart(2, '0')}`,
        actionTime: timing.actionTime,
        category: timing.category,
        context: timing.context
      } : undefined;

      const res = await consultOracle(profile, identity.firstName, mod, timingCtx);
      setAnalysis(res);
      setStep(AppStep.CONSULTATION);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 font-sans p-6 md:p-12 overflow-x-hidden">
      
      {step === AppStep.INITIATION && (
        <div className="max-w-xl mx-auto mt-12 fade-in text-center">
          <h1 className="text-6xl font-serif gold-glow mb-4 text-white tracking-tighter">LIFE DECODER</h1>
          <p className="text-[#C5A059] text-[10px] tracking-[0.6em] mb-16 uppercase opacity-80">Architecture de la Destinée</p>
          
          <form onSubmit={startInitiation} className="space-y-10 glass p-10 md:p-14 rounded-[3rem] gold-border text-left">
            <div>
              <InputField label="Votre Prénom" value={identity.firstName} onChange={(v:any) => setIdentity({...identity, firstName: v})} placeholder="Ex: Jean" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block text-center">Coordonnées Temporelles de Naissance</label>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Jour" value={identity.day} onChange={(v:any) => setIdentity({...identity, day: v})} placeholder="01" maxLength={2} />
                <InputField label="Mois" value={identity.month} onChange={(v:any) => setIdentity({...identity, month: v})} placeholder="01" maxLength={2} />
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
              <h2 className="text-6xl font-serif text-white uppercase tracking-tighter gold-glow">{identity.firstName}</h2>
          </header>

          <div className="mb-20">
            <button 
              onClick={() => setStep(AppStep.TIMING_SETUP)} 
              className="w-full group relative overflow-hidden glass p-1 gap-1 flex flex-col items-center justify-center rounded-[3rem] gold-border hover:border-[#C5A059]/60 transition-all active:scale-[0.98] shadow-2xl shadow-[#C5A059]/5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/10 to-[#C5A059]/0 group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="p-16 text-center space-y-4">
                <span className="text-5xl block group-hover:scale-125 transition-transform duration-500">⌛</span>
                <h3 className="text-4xl font-serif text-white uppercase tracking-[0.25em] gold-glow">MOMENT JUSTE™</h3>
                <p className="text-[11px] text-[#C5A059] uppercase tracking-[0.5em] font-bold opacity-80">Oracle du Timing Décisionnel</p>
              </div>
            </button>
          </div>

          <div className="mb-20">
            <h3 className="text-[10px] uppercase tracking-[0.6em] text-stone-600 mb-10 text-center">Les Pièces du Puzzle (Identité)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { label: 'Chemin de Vie', val: profile.lifePath },
                { label: 'Expression', val: profile.expression },
                { label: 'Âme', val: profile.soulUrge },
                { label: 'Personnalité', val: profile.personality },
                { label: 'Force Cachée', val: profile.hiddenForce },
                { label: 'Réalisation', val: profile.realization },
                { label: 'Année Perso', val: profile.personalYear },
              ].map((n, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedPiece(n.val)}
                  className={`glass p-6 rounded-3xl gold-border text-center transition-all group relative border-t-2 ${selectedPiece === n.val ? 'bg-stone-900 border-[#C5A059]' : 'hover:border-[#C5A059]/40'}`}
                >
                  <span className="text-4xl font-serif text-[#C5A059] block mb-2 gold-glow">{n.val}</span>
                  <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-stone-500 block h-8 flex items-center justify-center leading-tight">{n.label}</span>
                </button>
              ))}
            </div>

            {selectedPiece && (
              <div className="mt-8 glass p-10 rounded-[2.5rem] gold-border fade-in border-l-4 border-l-[#C5A059]">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-serif text-[#C5A059]">{ARCHETYPES[selectedPiece]?.title || "L'Énergie"} ({selectedPiece})</h4>
                  <button onClick={() => setSelectedPiece(null)} className="text-stone-600 hover:text-white text-xs uppercase tracking-widest">Fermer</button>
                </div>
                <p className="text-stone-300 font-serif italic text-lg leading-relaxed">
                  "{ARCHETYPES[selectedPiece]?.concrete || "Cette vibration favorise une approche spécifique de votre réalité physique."}"
                </p>
              </div>
            )}
          </div>

          <h3 className="text-[10px] uppercase tracking-[0.6em] text-stone-600 mb-10 text-center">Analyses Introspectives (IA)</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: 'BLUEPRINT', title: 'Destiny Blueprint', icon: '◈', sub: 'Analyse intégrale de votre mission' },
              { id: 'SOUL_PURPOSE', title: 'Soul Purpose', icon: '✧', sub: 'Décodage des désirs profonds' },
              { id: 'CAREER', title: 'Strategic Destiny', icon: '⚙', sub: 'Alignement professionnel' },
              { id: 'WEALTH', title: 'Abundance Map', icon: '❂', sub: 'Cycles de prospérité' },
              { id: 'RELATIONSHIP', title: 'Mirror Soul', icon: '⚭', sub: 'Dynamiques relationnelles' },
              { id: 'TIMELINE_5Y', title: '5-Year Cycle', icon: '⏳', sub: 'Projection des cycles majeurs' },
            ].map((m) => (
              <button key={m.id} onClick={() => runAnalysis(m.id as AnalysisModule)} className="glass p-10 rounded-[2.5rem] gold-border text-left hover:border-[#C5A059]/60 transition-all flex flex-col justify-between h-64 group relative overflow-hidden shadow-xl hover:shadow-[#C5A059]/5">
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

      {step === AppStep.TIMING_SETUP && (
        <div className="max-w-3xl mx-auto mt-10 fade-in">
           <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-white gold-glow mb-4 uppercase tracking-widest">MOMENT JUSTE™</h2>
            <p className="text-stone-500 text-[10px] uppercase tracking-[0.4em]">Oracle du Timing Décisionnel</p>
           </div>

           <div className="glass p-12 rounded-[3.5rem] gold-border space-y-12 shadow-2xl">
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.4em] block text-center">Réglages Temporels</label>
                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Jour" value={timing.day} onChange={(v:any) => setTiming({...timing, day: v})} placeholder="01" maxLength={2} />
                  <InputField label="Mois" value={timing.month} onChange={(v:any) => setTiming({...timing, month: v})} placeholder="01" maxLength={2} />
                  <InputField label="Année" value={timing.year} onChange={(v:any) => setTiming({...timing, year: v})} placeholder="2024" maxLength={4} />
                  <InputField label="Heure" value={timing.actionTime} onChange={(v:any) => setTiming({...timing, actionTime: v})} placeholder="14:00" type="time" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-4 text-center">Secteur de l'Action</label>
                  <select className="w-full bg-stone-900/30 border border-stone-800 p-5 rounded-2xl text-white outline-none focus:border-[#C5A059]/50 font-serif text-lg" value={timing.category} onChange={e => setTiming({...timing, category: e.target.value as any})}>
                    <option value="DECISION">Décision Stratégique</option>
                    <option value="LOVE">Union / Relation</option>
                    <option value="MONEY">Transaction Financière</option>
                    <option value="CAREER">Mouvement Professionnel</option>
                    <option value="SPIRITUAL">Alignement Intérieur</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-4 text-center">Description</label>
                   <textarea className="w-full bg-stone-900/30 border border-stone-800 p-5 rounded-2xl text-white min-h-[100px] resize-none focus:border-[#C5A059]/50 outline-none" placeholder="Quelle action souhaitez-vous synchroniser ?" value={timing.context} onChange={e => setTiming({...timing, context: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-6">
                <button onClick={() => setStep(AppStep.NEXUS)} className="flex-1 py-6 border border-stone-800 text-stone-600 rounded-2xl uppercase tracking-widest text-xs hover:text-stone-300 font-bold transition-all">Retour</button>
                <button onClick={() => runAnalysis('TIMING_ORACLE')} className="flex-[2] py-6 bg-[#C5A059] text-black font-bold uppercase tracking-[0.4em] rounded-2xl hover:bg-[#D4AF37] shadow-2xl shadow-[#C5A059]/20 transition-all active:scale-[0.98]">Consulter l'Oracle</button>
              </div>
           </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/98 flex flex-col items-center justify-center z-50">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 border-[1px] border-stone-900 rounded-full"></div>
            <div className="absolute inset-0 border-t-[2px] border-[#C5A059] rounded-full animate-spin"></div>
            <div className="absolute inset-8 border-[1px] border-stone-900 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] text-[#C5A059] font-serif tracking-[0.6em] uppercase gold-glow animate-pulse text-center leading-loose">Synchronisation<br/>Temporelle</span>
            </div>
          </div>
          <p className="mt-16 text-stone-600 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">Consultation du MOMENT JUSTE™...</p>
        </div>
      )}

      {step === AppStep.CONSULTATION && analysis && (
        <div className="max-w-4xl mx-auto fade-in space-y-12 pb-32">
          <header className="text-center">
             <h2 className="text-5xl font-serif text-white gold-glow mb-6 uppercase tracking-tighter">{analysis.title}</h2>
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mx-auto"></div>
          </header>

          {analysis.timingVerdict && (
            <div className={`p-16 rounded-[4rem] text-center border-2 shadow-2xl transition-all ${
              analysis.timingVerdict === 'ALIGNÉ' ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' : 
              analysis.timingVerdict === 'NEUTRE' ? 'bg-stone-900/40 border-stone-700/50 text-stone-400 shadow-stone-500/5' : 
              'bg-amber-950/10 border-amber-500/30 text-amber-400 shadow-amber-500/10'
            }`}>
               <span className="text-[10px] uppercase tracking-[1em] block mb-8 font-bold opacity-60">Verdict de l'Oracle</span>
               <span className="text-8xl font-serif tracking-[0.2em] gold-glow">{analysis.timingVerdict}</span>
            </div>
          )}

          <div className="grid gap-10">
            {analysis.sections.map((sec, i) => (
              <section key={i} className="glass p-12 rounded-[3.5rem] gold-border relative hover:bg-stone-900/20 transition-all group">
                <div className="absolute -left-2 top-12 w-1.5 h-12 bg-[#C5A059] rounded-full gold-glow group-hover:h-16 transition-all"></div>
                <h3 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.4em] mb-8">{sec.subtitle}</h3>
                <p className="text-xl text-stone-200 leading-relaxed font-serif italic opacity-95">"{sec.content}"</p>
              </section>
            ))}
          </div>

          <section className="bg-stone-900/40 p-12 rounded-[3.5rem] border border-stone-800 shadow-inner">
            <h3 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.4em] mb-12 text-center">Directives Stratégiques</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {analysis.strategicAdvice.map((adv, i) => (
                <div key={i} className="p-10 bg-black/60 rounded-3xl border border-[#C5A059]/10 text-stone-300 font-serif text-lg leading-relaxed italic text-center hover:border-[#C5A059]/40 transition-all">
                   {adv}
                </div>
              ))}
            </div>
          </section>

          <div className="text-center pt-16 space-y-16">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-[9px] uppercase tracking-[0.5em] text-stone-600 block">Message d'Ancrage</span>
              <p className="text-4xl font-serif text-[#C5A059] italic gold-glow leading-tight">"{analysis.anchor}"</p>
            </div>
            <button onClick={() => setStep(AppStep.NEXUS)} className="px-20 py-6 bg-stone-100 text-black font-bold uppercase tracking-[0.4em] rounded-3xl hover:bg-white transition-all shadow-2xl active:scale-95">Retour au Nexus</button>
          </div>
        </div>
      )}

    </div>
  );
}
