import React, { useState } from 'react';
import AppV1 from './App';
import AppV2 from './App-V2';

export default function AppRouter() {
  const [mode, setMode] = useState<'rational' | 'mystique'>('rational');

  return (
    <div className="relative">
      {/* Toggle en haut à droite */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 glass px-4 py-2 rounded-full gold-border">
        <button
          onClick={() => setMode('rational')}
          className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider transition-all ${
            mode === 'rational'
              ? 'bg-[#C5A059] text-black'
              : 'text-stone-400 hover:text-[#C5A059]'
          }`}
        >
          ✨ Rationnel
        </button>
        <button
          onClick={() => setMode('mystique')}
          className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider transition-all ${
            mode === 'mystique'
              ? 'bg-[#C5A059] text-black'
              : 'text-stone-400 hover:text-[#C5A059]'
          }`}
        >
          🔮 Mystique
        </button>
      </div>

      {/* Render le bon composant */}
      {mode === 'rational' ? <AppV2 /> : <AppV1 />}
    </div>
  );
}
