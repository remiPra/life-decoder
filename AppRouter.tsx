import React, { useState } from 'react';
import { UserButton, useAuth } from '@clerk/clerk-react';
import AppV1 from './App';
import AppV2 from './App-V2';
import AppZeRi from './App-ZeRi';
import HistoryPage from './components/HistoryPage';

export default function AppRouter() {
  const [mode, setMode] = useState<'rational' | 'mystique' | 'zeri' | 'history'>('mystique');
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const modes = [
    { id: 'mystique' as const, icon: '🔮', label: 'Mystique', desc: 'Numérologie & Oracle' },
    { id: 'zeri' as const, icon: '🌙', label: '择日', desc: 'Dates Favorables' },
    { id: 'rational' as const, icon: '✨', label: 'Rationnel', desc: 'Analyse Décision' }
  ];

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
    </div>
  );
}
