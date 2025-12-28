# 📋 SPÉCIFICATIONS COMPLÈTES — LIFE DECODER V2

> Package complet pour développement - À transmettre tel quel au codeur + agent IA

---

## 🎯 VISION PRODUIT

### Le Problème
Les apps de numérologie actuelles donnent des profils statiques et des prévisions vagues, sans aide concrète pour agir.

### La Solution
**Life Decoder** = Assistant IA de clarification décisionnelle basé sur la numérologie.

### Promesse
> **Life Decoder ne te dit pas quoi croire. Il t'aide à décider.**

---

## 🧩 ARCHITECTURE TECHNIQUE

### Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (design system existant)
- **IA**: Claude Opus 4.5 via OpenRouter API
- **Déploiement**: Vercel
- **State**: React hooks (pas de Redux pour MVP)

### Structure de fichiers
```
life-decoder/
├── App.tsx                 # App principale avec nouveau flow
├── index.tsx              # Entry point
├── index.html             # HTML de base
├── types.ts               # Types TypeScript
├── utils/
│   └── numerology.ts      # Calculs numérologiques
├── services/
│   └── decisionEngine.ts  # Nouveau service IA
└── components/
    ├── DecisionCanvas.tsx # Interface chat guidé
    └── ResultsView.tsx    # Affichage résultats structurés
```

---

## 🎨 PARCOURS UTILISATEUR — MVP

### ÉCRAN 1 : Welcome
**Objectif**: Positionnement clair, non-ésotérique

```tsx
<header>
  <h1>Prends de meilleures décisions, au bon moment.</h1>
  <p>Life Decoder combine numérologie et IA pour t'aider à voir plus clair.</p>
  <button>Commencer une décision</button>
</header>
```

**Design**:
- Fond dark existant
- Titre en Cinzel
- CTA gold (#C5A059)

---

### ÉCRAN 2 : Profil Express
**Objectif**: Collecter données minimales (30 sec max)

```tsx
<form>
  <input label="Prénom" />
  <input type="date" label="Date de naissance" />
  <small>Aucune donnée n'est stockée</small>
  <button>Continuer</button>
</form>
```

**Calculs automatiques**:
- Année personnelle
- Mois personnel
- Jour personnel

---

### ÉCRAN 3 : Type de Décision
**Objectif**: Contextualiser l'analyse

```tsx
<section>
  <h2>Quelle décision hésites-tu à prendre ?</h2>
  <ButtonGroup>
    <Button icon="💼">Carrière / Travail</Button>
    <Button icon="🚀">Projet personnel</Button>
    <Button icon="💕">Relation</Button>
  </ButtonGroup>
</section>
```

---

### ÉCRAN 4 : Decision Canvas (CLEF DU PRODUIT)
**Objectif**: Chat guidé pour structurer la réflexion

Interface type conversation progressive:

```tsx
<ChatInterface>
  {/* Question 1 */}
  <Message from="ai">
    Décris ta situation actuelle en quelques mots.
  </Message>
  <Input user />

  {/* Question 2 */}
  <Message from="ai">
    Quelle décision hésites-tu à prendre exactement ?
  </Message>
  <TextArea user />

  {/* Question 3 */}
  <Message from="ai">
    Y a-t-il une échéance ou un timing important ?
  </Message>
  <Input type="date" optional />

  {/* Question 4 */}
  <Message from="ai">
    Sur une échelle de 1 à 5, à quel point cette décision est importante pour toi ?
  </Message>
  <Slider min={1} max={5} />

  {/* Validation */}
  <Message from="ai">
    Voici ce que j'ai compris : [reformulation]
    C'est correct ?
  </Message>
  <ButtonGroup>
    <Button>Oui, analyser</Button>
    <Button variant="ghost">Modifier</Button>
  </ButtonGroup>
</ChatInterface>
```

**UX Critique**:
- Une question à la fois
- Scroll smooth
- Validation avant analyse
- Loading state avec message inspirant

---

### ÉCRAN 5 : Résultat Life Decoder
**Objectif**: Livrer valeur maximum, lisible, actionnable

```tsx
<ResultsView>
  {/* 1. Reformulation */}
  <Section>
    <h3>Ta situation</h3>
    <p>{reformulation_ia}</p>
  </Section>

  {/* 2. Score de Timing */}
  <Section highlight>
    <ScoreIndicator
      value="Favorable|Neutre|Délicat"
      color={green|yellow|orange}
    />
    <p>{justification_timing}</p>
  </Section>

  {/* 3. Trois Scénarios */}
  <Section>
    <h3>3 scénarios possibles</h3>
    <ScenarioCard
      title="Agir maintenant"
      pros={[...]}
      cons={[...]}
    />
    <ScenarioCard
      title="Préparer"
      pros={[...]}
      cons={[...]}
    />
    <ScenarioCard
      title="Différer"
      pros={[...]}
      cons={[...]}
    />
  </Section>

  {/* 4. Micro-Actions (LE PLUS IMPORTANT) */}
  <Section action>
    <h3>3 actions cette semaine</h3>
    <ActionCard
      number={1}
      text="Action concrète 1"
      icon="✓"
    />
    <ActionCard
      number={2}
      text="Action concrète 2"
      icon="✓"
    />
    <ActionCard
      number={3}
      text="Action concrète 3"
      icon="✓"
    />
  </Section>

  {/* 5. CTA */}
  <Section>
    <Button>Nouvelle décision</Button>
    <Button variant="outline">Partager (V2)</Button>
  </Section>
</ResultsView>
```

---

### ÉCRAN 6 : Feedback Simple
**Objectif**: Mesurer satisfaction (MVP minimal)

```tsx
<FeedbackPrompt>
  <p>Cette analyse t'a-t-elle aidé ?</p>
  <ButtonGroup>
    <Button emoji="😊">Oui</Button>
    <Button emoji="😐">Moyen</Button>
    <Button emoji="😞">Non</Button>
  </ButtonGroup>
</FeedbackPrompt>
```

---

## 🤖 PROMPT CLAUDE — DECISION ENGINE™

**Fichier**: `services/decisionEngine.ts`

### Template de prompt exact

```typescript
export const DECISION_ENGINE_PROMPT = `Tu es Life Decoder, un assistant IA de clarification décisionnelle.

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
- Toujours proposer des actions concrètes

STRUCTURE DE LA RÉPONSE OBLIGATOIRE (FORMAT JSON) :

{
  "reformulation": "Résumé clair de la situation en 2-3 phrases",

  "timing": {
    "score": "Favorable|Neutre|Délicat",
    "explication": "Comment les cycles numérologiques actuels influencent cette décision (max 5 lignes)"
  },

  "scenarios": [
    {
      "titre": "Agir maintenant",
      "avantages": ["...", "...", "..."],
      "vigilance": ["...", "..."]
    },
    {
      "titre": "Préparer",
      "avantages": ["...", "...", "..."],
      "vigilance": ["...", "..."]
    },
    {
      "titre": "Différer",
      "avantages": ["...", "...", "..."],
      "vigilance": ["...", "..."]
    }
  ],

  "actions": [
    {
      "numero": 1,
      "texte": "Action concrète réalisable en 7 jours",
      "pourquoi": "Courte justification"
    },
    {
      "numero": 2,
      "texte": "Action concrète réalisable en 7 jours",
      "pourquoi": "Courte justification"
    },
    {
      "numero": 3,
      "texte": "Action concrète réalisable en 7 jours",
      "pourquoi": "Courte justification"
    }
  ]
}

STYLE :
- Langage simple
- Structuré
- Bienveillant
- Orienté clarté et autonomie
- Les actions doivent être ULTRA concrètes (pas "réfléchis", mais "écris 3 options sur papier")
`;
```

### Implémentation du service

```typescript
// services/decisionEngine.ts
import OpenAI from 'openai';

interface DecisionInput {
  prenom: string;
  dateNaissance: string;
  anneePerso: number;
  moisPerso: number;
  jourPerso: number;
  typeDecision: string;
  situation: string;
  decision: string;
  echeance?: string;
  importance: number;
}

interface DecisionResult {
  reformulation: string;
  timing: {
    score: 'Favorable' | 'Neutre' | 'Délicat';
    explication: string;
  };
  scenarios: Array<{
    titre: string;
    avantages: string[];
    vigilance: string[];
  }>;
  actions: Array<{
    numero: number;
    texte: string;
    pourquoi: string;
  }>;
}

export async function analyzeDecision(input: DecisionInput): Promise<DecisionResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const prompt = DECISION_ENGINE_PROMPT
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

  const response = await client.chat.completions.create({
    model: "anthropic/claude-opus-4.5",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '{}';

  // Parse JSON response
  const result: DecisionResult = JSON.parse(content);

  return result;
}
```

---

## 🎨 DESIGN SYSTEM

### Couleurs
```css
--gold: #C5A059;
--obsidian: #050505;
--card-bg: rgba(18, 18, 18, 0.8);
--favorable: #10b981;  /* Vert */
--neutre: #f59e0b;     /* Orange */
--delicat: #ef4444;    /* Rouge */
```

### Composants Clés

#### ScoreIndicator
```tsx
<div className={`
  relative w-32 h-32 rounded-full
  flex items-center justify-center
  ${score === 'Favorable' ? 'bg-green-500/20 border-green-500' : ''}
  ${score === 'Neutre' ? 'bg-yellow-500/20 border-yellow-500' : ''}
  ${score === 'Délicat' ? 'bg-red-500/20 border-red-500' : ''}
  border-2
`}>
  <span className="text-2xl font-serif">{score}</span>
</div>
```

#### ActionCard
```tsx
<div className="glass p-6 rounded-2xl gold-border flex gap-4">
  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center">
    <span className="text-black font-bold">{numero}</span>
  </div>
  <div>
    <p className="text-white font-medium mb-2">{texte}</p>
    <p className="text-stone-400 text-sm">{pourquoi}</p>
  </div>
</div>
```

---

## 📊 MÉTRIQUES DE SUCCÈS MVP

### KPIs Critiques
1. **Taux de complétion du flow** : >70%
2. **Temps moyen sur résultat** : >2 min
3. **Feedback positif** : >60% "Oui"
4. **Taux de retour** : >30% dans les 7 jours

### Analytics à implémenter (V2)
- Posthog ou Mixpanel
- Events: `decision_started`, `decision_completed`, `feedback_given`

---

## 💰 MONÉTISATION V1

### Modèle Freemium
- **Gratuit**: 1 décision / mois
- **Pay-per-decision**: 6,99€
- **Abonnement**: 19,99€/mois (illimité)

### Implémentation technique
- Stripe Payment Links (le plus simple pour MVP)
- Pas de backend complexe
- Cookie local pour tracking décisions gratuites

---

## 🚀 ROADMAP DÉVELOPPEMENT

### Phase 1 — MVP Core (2 semaines)
- [ ] Nouveau flow (6 écrans)
- [ ] Decision Engine intégré
- [ ] Design adapté
- [ ] Tests utilisateurs (5 personnes)

### Phase 2 — Optimisation (1 semaine)
- [ ] Analytics de base
- [ ] A/B test sur wording
- [ ] Optimisation mobile
- [ ] Feedback loop

### Phase 3 — Monétisation (1 semaine)
- [ ] Stripe intégration
- [ ] Paywall simple
- [ ] Email confirmation
- [ ] FAQ

---

## ⚠️ CE QUE LE CODEUR DOIT COMPRENDRE

### 🔥 POINTS CRITIQUES

1. **Le produit = le flow + le prompt**
   - Pas besoin de 50 features
   - La valeur est dans l'expérience conversationnelle

2. **Pas de compte utilisateur pour MVP**
   - Juste localStorage pour tracking
   - Pas de login/signup
   - Pas de base de données

3. **Le Decision Canvas est LE cœur du produit**
   - Doit être fluide, rassurant
   - Une question à la fois
   - Validation avant envoi à l'IA

4. **Les résultats doivent être ULTRA lisibles**
   - Hierarchy visuelle claire
   - Actions concrètes bien visibles
   - Design premium mais pas surchargé

5. **Performance IA critique**
   - Temps de réponse <10sec idéal
   - Loading state engageant
   - Gestion erreurs gracieuse

---

## 📁 FICHIERS À CRÉER/MODIFIER

### Nouveaux fichiers
```
components/
  ├── DecisionCanvas.tsx       # Chat guidé (écran 4)
  ├── ResultsView.tsx          # Affichage résultats (écran 5)
  ├── ScoreIndicator.tsx       # Score timing
  ├── ActionCard.tsx           # Cartes d'action
  └── ScenarioCard.tsx         # Cartes scénarios

services/
  └── decisionEngine.ts        # Service IA principal

types/
  └── decision.ts              # Types pour décisions
```

### Fichiers à modifier
```
App.tsx                         # Nouveau flow complet
types.ts                        # Ajout types décision
utils/numerology.ts            # Vérifier calculs cycles
```

---

## 🧪 TESTS UTILISATEURS OBLIGATOIRES

Avant lancement:

1. **5 personnes minimum** testent le flow complet
2. **Observer sans aider** (UX research classique)
3. **Questions post-test**:
   - "As-tu compris ce que fait Life Decoder ?"
   - "Les résultats t'ont-ils aidé ?"
   - "Paierais-tu pour ça ? Combien ?"

---

## 📞 SUPPORT DÉVELOPPEUR

### Questions fréquentes anticipées

**Q: Faut-il garder l'ancien système d'analyses ?**
R: NON. Pivot complet vers Decision Engine.

**Q: Doit-on stocker les décisions ?**
R: Pas pour MVP. LocalStorage suffit.

**Q: Comment gérer les limites de décisions gratuites ?**
R: Cookie + localStorage. Pas de backend pour MVP.

**Q: Quel format de réponse pour l'IA ?**
R: JSON structuré (voir prompt template).

---

## ✅ CHECKLIST FINALE PRÉ-LANCEMENT

- [ ] Flow complet fonctionne de A à Z
- [ ] Prompt IA testé sur 10+ cas réels
- [ ] Design cohérent sur mobile
- [ ] Temps de réponse IA <15sec
- [ ] Gestion erreurs OK
- [ ] Analytics de base installé
- [ ] Tests utilisateurs (5+) complétés
- [ ] Feedback positif >60%
- [ ] README mis à jour
- [ ] Variables d'env configurées Vercel

---

## 🎯 OBJECTIF FINAL

> Un utilisateur arrive → décrit sa décision → reçoit une analyse claire + 3 actions concrètes → se sent aidé.

**Si ce flow fonctionne bien = produit viable.**

Tout le reste est secondaire.

---

**Créé avec ❤️ pour transformer Life Decoder en vrai outil d'aide à la décision.**

*Code bien. Code simple. Code ce qui compte.*
