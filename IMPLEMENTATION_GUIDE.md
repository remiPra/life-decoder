# 🛠️ GUIDE D'IMPLÉMENTATION — LIFE DECODER V2

> Instructions pas-à-pas pour ton codeur

---

## 🎯 OBJECTIF

Transformer Life Decoder d'une app de lectures numérologie en **assistant IA de décision**.

**Temps estimé**: 2-3 semaines (1 dev full-time)

---

## 📋 PRÉREQUIS

- [ ] Node.js 18+
- [ ] Git
- [ ] Compte OpenRouter avec crédits
- [ ] Compte Vercel
- [ ] Éditeur (VS Code recommandé)

---

## 🗂️ STRUCTURE DU PROJET

### Arborescence finale
```
life-decoder/
├── public/
├── src/                      # À CRÉER
│   ├── components/
│   │   ├── Welcome.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── DecisionTypeSelector.tsx
│   │   ├── DecisionCanvas.tsx     # ⭐ CORE
│   │   ├── ResultsView.tsx        # ⭐ CORE
│   │   ├── ScoreIndicator.tsx
│   │   ├── ScenarioCard.tsx
│   │   ├── ActionCard.tsx
│   │   └── FeedbackPrompt.tsx
│   ├── services/
│   │   └── decisionEngine.ts      # ⭐ CORE
│   ├── utils/
│   │   ├── numerology.ts          # Existant
│   │   └── localStorage.ts        # Nouveau
│   ├── types/
│   │   ├── index.ts              # Existant
│   │   └── decision.ts           # Nouveau
│   ├── App.tsx                    # À REFAIRE
│   ├── index.tsx
│   └── main.css
├── index.html
├── vite.config.ts
├── package.json
└── .env.local
```

---

## 📦 ÉTAPE 1 — INSTALLATION & SETUP

### 1.1 Créer la structure src/
```bash
mkdir -p src/components
mkdir -p src/services
mkdir -p src/types
mkdir -p src/utils
```

### 1.2 Déplacer les fichiers existants
```bash
# Déplacer dans src/
mv App.tsx src/
mv index.tsx src/
mv types.ts src/types/index.ts
mv utils src/
mv services src/
```

### 1.3 Mettre à jour index.html
```html
<!-- Changer la ligne du script -->
<script type="module" src="/src/index.tsx"></script>
```

### 1.4 Installer dépendances supplémentaires
```bash
npm install uuid
npm install -D @types/uuid
```

---

## 🔧 ÉTAPE 2 — TYPES & INTERFACES

### Créer `src/types/decision.ts`

```typescript
export type DecisionType = 'career' | 'project' | 'relationship';

export type TimingScore = 'Favorable' | 'Neutre' | 'Délicat';

export interface DecisionInput {
  id: string;
  prenom: string;
  dateNaissance: string;
  anneePerso: number;
  moisPerso: number;
  jourPerso: number;
  typeDecision: DecisionType;
  situation: string;
  decision: string;
  echeance?: string;
  importance: number;
  createdAt: Date;
}

export interface Scenario {
  titre: string;
  avantages: string[];
  vigilance: string[];
}

export interface Action {
  numero: number;
  texte: string;
  pourquoi: string;
}

export interface DecisionResult {
  id: string;
  reformulation: string;
  timing: {
    score: TimingScore;
    explication: string;
  };
  scenarios: Scenario[];
  actions: Action[];
  feedback?: 'positive' | 'neutral' | 'negative';
  createdAt: Date;
}

export enum AppStep {
  WELCOME = 'welcome',
  PROFILE = 'profile',
  DECISION_TYPE = 'decision_type',
  DECISION_CANVAS = 'decision_canvas',
  RESULTS = 'results',
  FEEDBACK = 'feedback'
}
```

---

## 🤖 ÉTAPE 3 — SERVICE IA (CŒUR DU PRODUIT)

### Créer `src/services/decisionEngine.ts`

```typescript
import OpenAI from 'openai';
import { DecisionInput, DecisionResult } from '../types/decision';

const DECISION_ENGINE_PROMPT = `Tu es Life Decoder, un assistant IA de clarification décisionnelle.

RÔLE :
Aider l'utilisateur à prendre une décision éclairée en combinant numérologie personnelle et structuration rationnelle, sans jamais imposer de vérité absolue.

CONTEXTE UTILISATEUR :
- Prénom : {{prenom}}
- Date de naissance : {{date_naissance}}
- Année personnelle : {{annee_perso}}
- Mois personnel : {{mois_perso}}
- Jour personnel : {{jour_perso}}

TYPE DE DÉCISION :
{{type_decision}}

DÉCISION À ANALYSER :
Situation : {{situation}}
Décision : {{decision}}
Échéance : {{echeance}}
Importance : {{importance}}/5

CONTRAINTES IMPORTANTES :
- La numérologie est un cadre symbolique, pas une prédiction
- Ton clair, calme, moderne, non ésotérique
- Aucune promesse irréaliste
- Toujours proposer des actions concrètes et réalistes
- Les actions doivent être ULTRA précises (pas "réfléchis", mais "écris 3 options sur papier ce soir")

STRUCTURE DE LA RÉPONSE OBLIGATOIRE (FORMAT JSON STRICT) :

{
  "reformulation": "Résumé clair de la situation en 2-3 phrases",
  "timing": {
    "score": "Favorable|Neutre|Délicat",
    "explication": "Comment les cycles numérologiques actuels influencent cette décision (max 5 lignes)"
  },
  "scenarios": [
    {
      "titre": "Agir maintenant",
      "avantages": ["avantage 1", "avantage 2", "avantage 3"],
      "vigilance": ["point de vigilance 1", "point de vigilance 2"]
    },
    {
      "titre": "Préparer",
      "avantages": ["avantage 1", "avantage 2", "avantage 3"],
      "vigilance": ["point de vigilance 1", "point de vigilance 2"]
    },
    {
      "titre": "Différer",
      "avantages": ["avantage 1", "avantage 2", "avantage 3"],
      "vigilance": ["point de vigilance 1", "point de vigilance 2"]
    }
  ],
  "actions": [
    {
      "numero": 1,
      "texte": "Action concrète et précise réalisable en 7 jours",
      "pourquoi": "Courte justification de pourquoi cette action maintenant"
    },
    {
      "numero": 2,
      "texte": "Action concrète et précise réalisable en 7 jours",
      "pourquoi": "Courte justification de pourquoi cette action maintenant"
    },
    {
      "numero": 3,
      "texte": "Action concrète et précise réalisable en 7 jours",
      "pourquoi": "Courte justification de pourquoi cette action maintenant"
    }
  ]
}

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.

STYLE :
- Langage simple et direct
- Structuré et clair
- Bienveillant mais réaliste
- Orienté clarté et autonomie
`;

function fillPromptTemplate(template: string, input: DecisionInput): string {
  return template
    .replace('{{prenom}}', input.prenom)
    .replace('{{date_naissance}}', input.dateNaissance)
    .replace('{{annee_perso}}', input.anneePerso.toString())
    .replace('{{mois_perso}}', input.moisPerso.toString())
    .replace('{{jour_perso}}', input.jourPerso.toString())
    .replace('{{type_decision}}', input.typeDecision)
    .replace('{{situation}}', input.situation)
    .replace('{{decision}}', input.decision)
    .replace('{{echeance}}', input.echeance || 'Non spécifiée')
    .replace('{{importance}}', input.importance.toString());
}

export async function analyzeDecision(input: DecisionInput): Promise<Omit<DecisionResult, 'id' | 'createdAt' | 'feedback'>> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENROUTER_API_KEY is not defined');
  }

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": window.location.origin,
      "X-Title": "Life Decoder"
    }
  });

  const prompt = fillPromptTemplate(DECISION_ENGINE_PROMPT, input);

  try {
    const response = await client.chat.completions.create({
      model: "anthropic/claude-opus-4.5",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content || '{}';

    // Nettoyer le JSON si nécessaire (enlever markdown code blocks)
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const result = JSON.parse(cleanContent);

    // Validation basique
    if (!result.reformulation || !result.timing || !result.scenarios || !result.actions) {
      throw new Error('Invalid AI response format');
    }

    return result;

  } catch (error) {
    console.error('Decision Engine Error:', error);
    throw new Error('Impossible d\'analyser ta décision pour le moment. Réessaie dans quelques instants.');
  }
}
```

---

## 💾 ÉTAPE 4 — GESTION DU STOCKAGE LOCAL

### Créer `src/utils/localStorage.ts`

```typescript
import { DecisionResult } from '../types/decision';

const DECISIONS_KEY = 'life_decoder_decisions';
const FREE_LIMIT_KEY = 'life_decoder_free_count';
const FREE_LIMIT = 1; // 1 décision gratuite

export function saveDecision(decision: DecisionResult): void {
  const decisions = getDecisions();
  decisions.push(decision);
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));

  // Incrémenter le compteur gratuit
  incrementFreeCount();
}

export function getDecisions(): DecisionResult[] {
  const data = localStorage.getItem(DECISIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getFreeCount(): number {
  const count = localStorage.getItem(FREE_LIMIT_KEY);
  return count ? parseInt(count) : 0;
}

function incrementFreeCount(): void {
  const current = getFreeCount();
  localStorage.setItem(FREE_LIMIT_KEY, (current + 1).toString());
}

export function hasReachedFreeLimit(): boolean {
  return getFreeCount() >= FREE_LIMIT;
}

export function clearDecisions(): void {
  localStorage.removeItem(DECISIONS_KEY);
  localStorage.removeItem(FREE_LIMIT_KEY);
}
```

---

## 🎨 ÉTAPE 5 — COMPOSANTS UI

### 5.1 Welcome.tsx

```typescript
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="max-w-3xl mx-auto mt-20 fade-in text-center">
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
        className="px-12 py-6 bg-[#C5A059] text-black text-lg font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4AF37] transition-all shadow-2xl shadow-[#C5A059]/20"
      >
        Commencer une décision
      </button>
      <p className="text-stone-600 text-sm mt-8">
        Gratuit · Aucune donnée stockée · Résultat immédiat
      </p>
    </div>
  );
}
```

### 5.2 ProfileForm.tsx

```typescript
import React, { useState } from 'react';
import { calculateFullProfile } from '../utils/numerology';

interface ProfileFormProps {
  onSubmit: (prenom: string, profile: any) => void;
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

    onSubmit(prenom, profile);
  };

  return (
    <div className="max-w-xl mx-auto mt-16 fade-in">
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
            className="w-full bg-stone-900/30 border border-stone-800 p-4 rounded-xl outline-none focus:border-[#C5A059]/50 text-white text-lg"
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
          className="w-full py-5 bg-[#C5A059] text-black font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#D4AF37] transition-all"
        >
          Continuer
        </button>
      </form>
    </div>
  );
}
```

### 5.3 DecisionTypeSelector.tsx

```typescript
import React from 'react';
import { DecisionType } from '../types/decision';

interface DecisionTypeSelectorProps {
  onSelect: (type: DecisionType) => void;
}

export default function DecisionTypeSelector({ onSelect }: DecisionTypeSelectorProps) {
  const types = [
    { id: 'career' as DecisionType, icon: '💼', label: 'Carrière / Travail', desc: 'Changement de poste, reconversion, négociation' },
    { id: 'project' as DecisionType, icon: '🚀', label: 'Projet personnel', desc: 'Lancement, création, investissement' },
    { id: 'relationship' as DecisionType, icon: '💕', label: 'Relation', desc: 'Amour, amitié, famille' },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-16 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-white mb-4">Quelle décision hésites-tu à prendre ?</h2>
        <p className="text-stone-400">Choisis le domaine qui correspond le mieux</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="glass p-8 rounded-[2rem] gold-border hover:border-[#C5A059] transition-all text-left group"
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
```

Je continue avec les composants restants...

