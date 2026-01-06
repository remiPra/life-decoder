import React from 'react';

interface LandingPageProps {
  onStartMode: (mode: 'mystique' | 'zeri' | 'runes') => void;
  onLogin: () => void;
  isSignedIn: boolean;
}

export default function LandingPage({ onStartMode, onLogin, isSignedIn }: LandingPageProps) {
  const services = [
    {
      id: 'mystique' as const,
      icon: '🔮',
      title: 'Mode Mystique',
      subtitle: 'Numérologie & Oracle',
      description: 'Découvre ton Chemin de Vie, ton Expression et ton Âge de Personnel. Des analyses personnalisées basées sur ta date de naissance.',
      features: [
        'Analyse du Chemin de Vie',
        'Nombre d\'Expression et d\'Âme',
        'Oracle de Décision',
        'Alignement Cosmique Journalier',
        'Timeline Temporelle'
      ],
      gradient: 'from-purple-900/30 to-indigo-900/30'
    },
    {
      id: 'zeri' as const,
      icon: '🌙',
      title: '择日 - Dates Favorables',
      subtitle: 'Calendrier Lunaire Chinois',
      description: 'Trouve les moments propices pour tes actions grâce au calendrier traditionnel 择日. Analyse du Wu Xing (5 éléments).',
      features: [
        'Calendrier Lunaire Interactif',
        'Analyse des Éléments (Wu Xing)',
        'Dates Propices',
        'Heures Bénies',
        'Harmonie Énergétique'
      ],
      gradient: 'from-slate-800/40 to-zinc-900/40'
    },
    {
      id: 'runes' as const,
      icon: 'ᚱ',
      title: 'Runes Investisseur',
      subtitle: 'Divination Financière',
      description: 'Les runes nordiques pour éclairer tes décisions financières. Une approche mystique des marchés et investissements.',
      features: [
        'Tirage de Runes Nordiques',
        'Analyse de Momentum',
        'Timing d\'Investissement',
        'Interprétation Symbolique',
        'Guidance Financière'
      ],
      gradient: 'from-amber-900/30 to-orange-900/30'
    }
  ];

  const analyses = [
    { name: 'Life Decoder Blueprint', icon: '📊', desc: 'Ton profil complet' },
    { name: 'Carrière & Vocation', icon: '⚔️', desc: 'Ta voie professionnelle' },
    { name: 'Relations & Compatibilité', icon: '💫', desc: 'Dynamiques relationnelles' },
    { name: 'Décision Timing', icon: '⏳', desc: 'Le bon moment pour agir' },
    { name: 'Alignement Quotidien', icon: '☀️', desc: 'Guidance du jour' },
    { name: 'Cycles de Vie', icon: '🔄', desc: 'Comprendre tes cycles' }
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#050505]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Logo & Title */}
          <div className="animate-slide-up">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-2xl glass gold-border flex items-center justify-center animate-pulse-subtle">
                <span className="text-6xl">✧</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white gold-glow mb-6 tracking-tighter">
              LIFE DECODER
            </h1>
            <p className="text-xl md:text-2xl text-[#C5A059] font-serif mb-4 tracking-wide">
              Architecture de la Destinée
            </p>
            <p className="text-lg md:text-xl text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Clarifie tes décisions importantes grâce à l'union de la numérologie, de l'astrologie chinoise et des runes nordiques.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => onStartMode('mystique')}
              className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] transition-all shadow-lg shadow-[#C5A059]/20 active:scale-95"
            >
              Commencer Gratuitement
            </button>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 glass gold-border text-white rounded-xl hover:bg-white/5 transition-all"
            >
              Découvrir les Services
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-stone-500 text-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-2">
              <span>✓</span> Gratuit & Illimité
            </span>
            <span className="flex items-center gap-2">
              <span>✓</span> Aucune inscription requise
            </span>
            <span className="flex items-center gap-2">
              <span>✓</span> Analyses IA personnalisées
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#C5A059]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#C5A059] text-sm uppercase tracking-[0.4em] mb-4">Nos Services</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white gold-glow mb-6">
              Trois Voies, Une Destinée
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
              Chaque mode offre une perspective unique pour éclairer ton chemin. Choisis celui qui résonne avec ta question du moment.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                <div className="absolute inset-0 glass gold-border opacity-80"></div>

                {/* Card Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl glass gold-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">{service.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif text-white mb-1">{service.title}</h3>
                  <p className="text-[#C5A059] text-sm mb-4">{service.subtitle}</p>

                  {/* Description */}
                  <p className="text-stone-400 text-sm mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-stone-300 text-sm">
                        <span className="text-[#C5A059]">✦</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => onStartMode(service.id)}
                    className="w-full py-3 glass gold-border text-[#C5A059] rounded-xl hover:bg-[#C5A059] hover:text-black transition-all font-medium"
                  >
                    Explorer ce mode
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analyses Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-[#050505]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-[#C5A059] text-sm uppercase tracking-[0.4em] mb-4">Analyses Disponibles</p>
              <h2 className="text-4xl font-serif text-white gold-glow mb-6">
                Des Analyses pour Chaque Aspect de ta Vie
              </h2>
              <p className="text-stone-400 mb-8">
                Que tu sois face à un choix de carrière, une décision amoureuse ou un moment de doute, nos analyses te donnent des clés pour avancer.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {analyses.map((analysis, i) => (
                  <div
                    key={i}
                    className="glass gold-border rounded-xl p-4 flex items-center gap-3 hover:border-[#C5A059]/50 transition-all cursor-pointer"
                    onClick={() => onStartMode('mystique')}
                  >
                    <span className="text-2xl">{analysis.icon}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{analysis.name}</div>
                      <div className="text-stone-500 text-xs">{analysis.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Feature Highlight */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-3xl blur-3xl"></div>
              <div className="relative glass gold-border rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full glass gold-border flex items-center justify-center mb-4 animate-pulse-glow">
                    <span className="text-4xl">🌟</span>
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-2">Propulsé par l'IA</h3>
                  <p className="text-stone-400 text-sm">
                    Des analyses profondes générées par Claude, personnalisées selon tes données uniques.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Analyses générées', value: '10,000+' },
                    { label: 'Modes disponibles', value: '3' },
                    { label: 'Satisfaction', value: '4.8/5' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-stone-400 text-sm">{stat.label}</span>
                      <span className="text-[#C5A059] font-serif text-lg">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onStartMode('mystique')}
                  className="w-full mt-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] transition-all"
                >
                  Essayer Maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C5A059] text-sm uppercase tracking-[0.4em] mb-4">Comment ça marche</p>
            <h2 className="text-4xl font-serif text-white gold-glow mb-6">
              Trois Épes vers la Clarté
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Partage tes Infos',
                desc: 'Ton prénom et ta date de naissance suffisent pour révéler ton profil unique.',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Choisis ton Analyse',
                desc: 'Sélectionne le type d\'analyse qui correspond à ta question actuelle.',
                icon: '🎯'
              },
              {
                step: '03',
                title: 'Reçois ta Guidance',
                desc: 'Une analyse personnalisée générée par IA avec des actions concrètes.',
                icon: '✨'
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="relative mb-6">
                  <div className="text-7xl font-serif text-[#C5A059]/10 absolute -top-4 left-1/2 -translate-x-1/2">
                    {item.step}
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-2xl glass gold-border flex items-center justify-center relative z-10">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                <p className="text-stone-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-[#050505]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="glass gold-border rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-serif text-white gold-glow mb-6">
              Prêt à Découvrir ta Destinée?
            </h2>
            <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
              Commence ton voyage gratuitement. Aucune carte bancaire requise.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onStartMode('mystique')}
                className="px-10 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] transition-all shadow-lg shadow-[#C5A059]/20"
              >
                Commencer Maintenant
              </button>
              {!isSignedIn && (
                <button
                  onClick={onLogin}
                  className="px-10 py-4 glass gold-border text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  Créer un Compte
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-stone-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-serif text-[#C5A059] mb-2">LIFE DECODER</h3>
              <p className="text-stone-600 text-sm">Architecture de la Destinée</p>
            </div>
            <div className="flex gap-8 text-stone-500 text-sm">
              <a href="#" className="hover:text-[#C5A059] transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-[#C5A059] transition-colors">CGU</a>
              <a href="#" className="hover:text-[#C5A059] transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-stone-700 text-xs">
            © 2025 Life Decoder. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
