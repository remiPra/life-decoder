import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="max-w-3xl mx-auto mt-20 fade-in text-center px-6">
      <h1 className="text-7xl font-serif gold-glow mb-6 text-white tracking-tighter">
        LIFE DECODER
      </h1>
      <p className="text-3xl font-serif text-[#C5A059] mb-12">
        Prends de meilleures décisions, au bon moment.
      </p>
      <p className="text-xl text-stone-300 mb-16 leading-relaxed max-w-2xl mx-auto">
        Life Decoder combine numérologie et intelligence artificielle
        pour t'aider à voir plus clair dans tes choix importants.
      </p>
      <button
        onClick={onStart}
        className="px-12 py-6 bg-[#C5A059] text-black text-lg font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4AF37] transition-all shadow-2xl shadow-[#C5A059]/20 active:scale-95"
      >
        Commencer une décision
      </button>
      <p className="text-stone-600 text-sm mt-8">
        Gratuit · Aucune donnée stockée · Résultat immédiat
      </p>
    </div>
  );
}
