import { DecisionInput, DecisionResult, TimingScore } from './decision-types';

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
  const typeLabels = {
    career: 'Carrière / Travail',
    project: 'Projet personnel',
    relationship: 'Relation'
  };

  return template
    .replace('{{prenom}}', input.prenom)
    .replace('{{date_naissance}}', input.dateNaissance)
    .replace('{{annee_perso}}', input.anneePerso.toString())
    .replace('{{mois_perso}}', input.moisPerso.toString())
    .replace('{{jour_perso}}', input.jourPerso.toString())
    .replace('{{type_decision}}', typeLabels[input.typeDecision])
    .replace('{{situation}}', input.situation)
    .replace('{{decision}}', input.decision)
    .replace('{{echeance}}', input.echeance || 'Non spécifiée')
    .replace('{{importance}}', input.importance.toString());
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: L\'analyse prend trop de temps. Réessaie.');
    }
    throw error;
  }
}

async function parseAndValidateResult(content: string): Promise<any> {
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
}

export async function analyzeDecision(input: DecisionInput): Promise<Omit<DecisionResult, 'id' | 'createdAt' | 'feedback'>> {
  const prompt = fillPromptTemplate(DECISION_ENGINE_PROMPT, input);
  const maxRetries = 1; // Retry 1 fois si échec

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 🔒 SÉCURISÉ : Appel via Vercel Serverless Function avec timeout 30s
      const response = await fetchWithTimeout('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      }, 30000);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content || '{}';

      // Parser et valider le résultat
      const result = await parseAndValidateResult(content);

      // ✅ Succès
      return result;

    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      // Si JSON invalide et pas le dernier essai → retry
      if (error instanceof SyntaxError && !isLastAttempt) {
        console.warn(`Attempt ${attempt + 1} failed (JSON parse error), retrying...`);
        continue;
      }

      // Si timeout ou dernière tentative → throw
      console.error('Decision Engine Error:', error);

      if (isLastAttempt) {
        throw new Error('Impossible d\'analyser ta décision pour le moment. Réessaie dans quelques instants.');
      }
    }
  }

  // Fallback (ne devrait jamais arriver)
  throw new Error('Erreur inattendue lors de l\'analyse.');
}
