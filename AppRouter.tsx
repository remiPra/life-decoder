import React, { useEffect, useState } from 'react';
import { UserButton, useAuth, SignIn } from '@clerk/clerk-react';
import AppV1 from './App';
import AppV2 from './App-V2';
import AppZeRi from './App-ZeRi';
import HistoryPage from './components/HistoryPage';
import TermsModal from './components/TermsModal';

export default function AppRouter() {
  const [mode, setMode] = useState<'rational' | 'mystique' | 'zeri' | 'history'>('mystique');
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showInlineAuth, setShowInlineAuth] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Track if user has done their free analysis
  const [hasUsedFreeAnalysis, setHasUsedFreeAnalysis] = useState(() => {
    return localStorage.getItem('life-decoder-free-used') === 'true';
  });

  const modes = [
    { id: 'mystique' as const, icon: '🔮', label: 'Mystique', desc: 'Numérologie & Oracle' },
    { id: 'zeri' as const, icon: '🌙', label: '择日', desc: 'Dates Favorables' },
    { id: 'rational' as const, icon: '✨', label: 'Rationnel', desc: 'Analyse Décision' }
  ];

  // Show a signup prompt a few seconds after landing if not authenticated
  useEffect(() => {
    if (isSignedIn) {
      setShowSignupPrompt(false);
      setShowInlineAuth(false);
      return;
    }
    const timer = setTimeout(() => setShowSignupPrompt(true), 5000);
    return () => clearTimeout(timer);
  }, [isSignedIn]);

  // Listen for auth-required events triggered from child apps (to replace alert)
  useEffect(() => {
    const handler = () => {
      setShowSignupPrompt(true);
      setShowInlineAuth(false);
    };
    window.addEventListener('life-decoder:require-auth', handler);
    return () => window.removeEventListener('life-decoder:require-auth', handler);
  }, []);

  return (
    <div className="relative">
      {/* Menu Drawer Button + User button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="glass px-4 py-3 rounded-full gold-border hover:bg-[#C5A059]/10 transition-all"
        >
          <svg className="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="fixed top-6 right-6 z-50">
        {isSignedIn && (
          <div className="glass px-3 py-2 rounded-full gold-border">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Menu Drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 animate-fade-in"
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 w-80 glass border-r border-[#C5A059]/30 z-50 p-8 animate-slide-in">
            <div className="mb-12">
              <h2 className="text-3xl font-serif text-[#C5A059] gold-glow mb-2">LIFE DECODER</h2>
              <p className="text-stone-500 text-xs uppercase tracking-wider">Choisis ton mode</p>
            </div>

            <div className="space-y-4">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    mode === m.id
                      ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                      : 'glass border border-stone-700 text-stone-300 hover:border-[#C5A059]/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{m.icon}</span>
                    <div>
                      <div className="font-serif text-lg mb-1">{m.label}</div>
                      <div className="text-xs opacity-70">{m.desc}</div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Historique Button */}
              <div className="pt-4 mt-4 border-t border-stone-800">
                <button
                  onClick={() => {
                    setMode('history');
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    mode === 'history'
                      ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                      : 'glass border border-stone-700 text-stone-300 hover:border-[#C5A059]/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📋</span>
                    <div>
                      <div className="font-serif text-lg mb-1">Historique</div>
                      <div className="text-xs opacity-70">Tes analyses sauvegardées</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mb-6"></div>
              <p className="text-stone-600 text-xs text-center">
                Architecture de la Destinée
              </p>
            </div>
          </div>
        </>
      )}

      {/* Render le bon composant */}
      {mode === 'rational' && <AppV2 />}
      {mode === 'mystique' && <AppV1 />}
      {mode === 'zeri' && <AppZeRi />}
      {mode === 'history' && <HistoryPage onClose={() => setMode('mystique')} />}

      {/* Delayed signup prompt for guests */}
      {!isSignedIn && showSignupPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full glass gold-border rounded-[2rem] p-8 relative">
            <button
              onClick={() => setShowSignupPrompt(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white"
              aria-label="Fermer"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <p className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-2">Accès complet</p>
              <h3 className="text-3xl font-serif text-white mb-2">Crée ton compte en 30s</h3>
              <p className="text-stone-400 text-sm">
                Sauvegarde automatique de tes analyses · Confidentialité · Synchronisation multi-appareils
              </p>
            </div>

            <div className="glass border border-stone-700 rounded-xl p-4 flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-[#C5A059] bg-transparent checked:bg-[#C5A059] cursor-pointer flex-shrink-0"
              />
              <div className="text-sm text-stone-300 text-left">
                J'accepte les{' '}
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#C5A059] hover:text-[#D4AF37] underline transition-colors font-medium"
                >
                  Conditions Générales d'Utilisation
                </button>
              </div>
            </div>

            {!showInlineAuth ? (
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => {
                    if (!termsAccepted) {
                      alert('Merci d’accepter les CGU avant de continuer.');
                      return;
                    }
                    setShowInlineAuth(true);
                  }}
                  className="px-6 py-3 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] transition-all"
                >
                  Connexion / Inscription
                </button>
                <button
                  onClick={() => setShowSignupPrompt(false)}
                  className="px-6 py-3 glass gold-border text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  Plus tard
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "glass gold-border rounded-3xl shadow-2xl",
                      headerTitle: "text-[#C5A059] font-serif",
                      headerSubtitle: "text-stone-400",
                      socialButtonsBlockButton: "glass gold-border hover:bg-[#C5A059]/10 transition-all",
                      formButtonPrimary: "bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold",
                      footerActionLink: "text-[#C5A059] hover:text-[#D4AF37]",
                      formFieldInput: "glass border-stone-700 focus:border-[#C5A059] text-white",
                      formFieldLabel: "text-stone-400",
                      dividerLine: "bg-stone-700",
                      dividerText: "text-stone-500",
                    },
                    variables: {
                      colorPrimary: "#C5A059",
                      colorBackground: "#121212",
                      colorText: "#e5e5e5",
                      colorInputBackground: "#1a1a1a",
                      colorInputText: "#e5e5e5",
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}
