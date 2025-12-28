import React, { useState } from 'react';
import { calculateFullProfile } from './utils/numerology';
import { NumerologyProfile } from './types';

interface ProfileFormProps {
  onSubmit: (prenom: string, dateNaissance: string, profile: NumerologyProfile) => void;
}

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [prenom, setPrenom] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !day || !month || !year) return;

    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const profile = calculateFullProfile(prenom, '', birthDate);

    onSubmit(prenom, birthDate, profile);
  };

  return (
    <div className="max-w-xl mx-auto mt-16 fade-in px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-white mb-4">Pour commencer</h2>
        <p className="text-stone-400">Quelques infos pour personnaliser ton analyse</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-10 rounded-[3rem] gold-border space-y-8">
        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-3">
            Ton prénom
          </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Marie"
            className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl outline-none focus:border-[#C5A059]/50 text-white text-lg placeholder-stone-700"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-3 text-center">
            Ta date de naissance
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[8px] text-stone-600 uppercase block mb-2">Jour</label>
              <input
                type="text"
                maxLength={2}
                value={day}
                onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                placeholder="15"
                className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl text-white text-center"
                required
              />
            </div>
            <div>
              <label className="text-[8px] text-stone-600 uppercase block mb-2">Mois</label>
              <input
                type="text"
                maxLength={2}
                value={month}
                onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                placeholder="06"
                className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl text-white text-center"
                required
              />
            </div>
            <div>
              <label className="text-[8px] text-stone-600 uppercase block mb-2">Année</label>
              <input
                type="text"
                maxLength={4}
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                placeholder="1990"
                className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl text-white text-center"
                required
              />
            </div>
          </div>
        </div>

        <p className="text-stone-600 text-xs text-center">
          🔒 Aucune donnée n'est stockée sur nos serveurs
        </p>

        <button
          type="submit"
          className="w-full py-5 bg-[#C5A059] text-black font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4AF37] transition-all active:scale-95"
        >
          Continuer
        </button>
      </form>
    </div>
  );
}
