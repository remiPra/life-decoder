
import { GoogleGenAI, Type } from "@google/genai";
import { NumerologyProfile, TimingContext, AIResponse, AnalysisModule } from "../types";
import { calculateMomentVibrations } from "../utils/numerology";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const GLOBAL_INSTRUCTIONS = `
Tu es le "LIFE DECODER", un guide symbolique expert en numérologie introspective.
TON TON : Bienveillant, apaisant, clair, sans jamais être prédictif.
RÈGLES ABSOLUES :
- AUCUNE prédiction ("Tu vas réussir", "Il est certain que").
- AUCUN vocabulaire médical ou anxiogène ("Attention", "Risque", "Danger", "Échec").
- AUCUN impératif ("Tu dois").
- Respecte toujours le LIBRE ARBITRE.
`;

export const consultOracle = async (
  profile: any,
  name: string,
  module: AnalysisModule,
  timing?: TimingContext
): Promise<AIResponse> => {
  
  let specificPrompt = "";

  if (module === 'TIMING_ORACLE' && timing) {
    const vibs = calculateMomentVibrations(profile, timing.actionDate, timing.actionTime);
    
    specificPrompt = `
      MODULE : MOMENT JUSTE™ (DÉCISION & TIMING)
      RÔLE : Guide symbolique du temps et du rythme.
      
      DONNÉES IDENTITAIRES :
      - Chemin de vie : ${profile.lifePath}
      
      CYCLE ACTUEL AU MOMENT DE L'ACTION :
      - Année personnelle : ${vibs.personalYear}
      - Mois personnel : ${vibs.personalMonth}
      - Jour personnel : ${vibs.personalDay}
      
      QUESTION DE L'UTILISATEUR :
      - Type : ${timing.category}
      - Contexte : ${timing.context}
      
      DÉTAILS DU MOMENT :
      - Date : ${timing.actionDate}
      - Heure : ${timing.actionTime}
      - Nombre du jour d'action : ${vibs.actionDayNumber}
      - Nombre de l'heure d'action : ${vibs.actionHourNumber}

      STRUCTURE DE SORTIE OBLIGATOIRE (JSON) :
      1. timingVerdict : Choisir UNIQUEMENT parmi ["ALIGNÉ", "NEUTRE", "À AJUSTER"].
      2. Lecture Symbolique : 4-5 phrases max sur la résonance du moment (utiliser "peut", "invite à", "favorise").
      3. Favorise : Liste de 3 points max.
      4. Douceur : Liste de 3 points max (ce qui demande patience/tempérance).
      5. Ajustement : UNE SEULE option suggérée (décaler, reformuler, etc.).
      6. Ancrage : Un paragraphe apaisant et responsabilisant.

      JSON FORMAT:
      {
        "title": "MOMENT JUSTE™",
        "timingVerdict": "ALIGNÉ",
        "sections": [
          { "subtitle": "Lecture Symbolique du Moment", "content": "..." },
          { "subtitle": "Ce que ce moment favorise", "content": "..." },
          { "subtitle": "Ce qui demande de la douceur", "content": "..." }
        ],
        "strategicAdvice": ["Ajustement Symbolique Proposé: ..."],
        "anchor": "..."
      }
    `;
  } else {
    specificPrompt = `
      MODULE : ${module}
      SUJET : ${name}
      DONNÉES : Chemin de vie ${profile.lifePath}, Expression ${profile.expression}, Année Perso ${profile.personalYear}.
      Mission : Guidance symbolique profonde. Pas de prédiction. 
      JSON structure : { "title": string, "sections": [{ "subtitle": string, "content": string }], "strategicAdvice": string[], "anchor": string }
    `;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: specificPrompt,
    config: { 
      systemInstruction: GLOBAL_INSTRUCTIONS, 
      responseMimeType: "application/json" 
    }
  });

  return JSON.parse(response.text || "{}") as AIResponse;
};
