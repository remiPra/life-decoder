import React from 'react';
import { DecisionType } from './decision-types';

interface DecisionTypeSelectorProps {
  onSelect: (type: DecisionType) => void;
}

export default function DecisionTypeSelector({ onSelect }: DecisionTypeSelectorProps) {
  const types = [
    {
      id: 'career' as DecisionType,
      icon: '💼',
      label: 'Carrière / Travail',
      desc: 'Changement de poste, reconversion, négociation'
    },
    {
      id: 'project' as DecisionType,
      icon: '🚀',
      label: 'Projet personnel',
      desc: 'Lancement, création, investissement'
    },
    {
      id: 'relationship' as DecisionType,
      icon: '💕',
      label: 'Relation',
      desc: 'Amour, amitié, famille'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-16 fade-in px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-white mb-4">Quelle décision hésites-tu à prendre ?</h2>
        <p className="text-stone-400">Choisis le domaine qui correspond le mieux</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="glass p-8 rounded-[2rem] gold-border hover:border-[#C5A059] transition-all text-left group active:scale-95"
          >
            <div className="text-5xl mb-4">{type.icon}</div>
            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C5A059] transition-colors">
              {type.label}
            </h3>
            <p className="text-sm text-stone-500">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
