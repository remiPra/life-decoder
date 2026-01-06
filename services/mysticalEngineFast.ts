import { NumerologyProfile, AIResponse } from "../types";

// Prompt simplifié pour version gratuite/rapide (uniquement Chemin de Vie + Expression)
const FAST_SYSTEM_PROMPT = `Tu es un numérologue expérimenté qui fournit des analyses RAPIDES et CONCISES.
Reste mystique mais DIRECT. Réponds en 300-400 mots maximum.`;

export const buildFastNumerologyPrompt = (profile: NumerologyProfile): string => {
  return `Analyse numérologique RAPIDE pour :

NOM : ${profile.fullName}
DATE : ${profile.birthDay}/${profile.birthMonth}/${profile.birthYear}

NOMBRES CLÉS :
• Chemin de Vie : ${profile.lifePath}${[11, 22, 33].includes(profile.lifePath) ? ' (Maître !)' : ''}
• Expression : ${profile.expression}${[11, 22, 33].includes(profile.expression) ? ' (Maître !)' : ''}

Fournis une analyse CONCISE en 3 sections courtes :

1. **Essence** - Qui tu es vraiment (2-3 phrases)
2. **Forces** - Tes talents naturels (2-3 phrases)
3. **Mission** - Ton objectif de vie (2-3 phrases)

Sois personnel, mystique, et BREF. Utilise "tu".`;
};

export const runFastAnalysis = async (
  profile: NumerologyProfile
): Promise<AIResponse> => {
  const prompt = buildFastNumerologyPrompt(profile);

  // Appel endpoint rapide (Gemini Flash)
  const response = await fetch('/api/analyze-fast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: FAST_SYSTEM_PROMPT,
      prompt
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    analysis: data.choices[0].message.content || "Aucune réponse reçue."
  };
};
