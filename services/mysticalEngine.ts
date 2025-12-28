import { NumerologyProfile, TemporalNumbers, AIResponse, AnalysisModule, TimingContext } from "../types";
import { calculateDayNumber, calculateHourNumber } from "../utils/numerology";
import { buildAnalysisPrompt, SYSTEM_PROMPT } from "./analysisPrompts";

export const runAnalysis = async (
  analysisType: AnalysisModule,
  profile: NumerologyProfile,
  timingContext: TimingContext = {}
): Promise<AIResponse> => {
  // Calculate temporal numbers
  const temporal: TemporalNumbers = {};

  if (timingContext.questionDate) {
    temporal.questionDay = calculateDayNumber(timingContext.questionDate);
  }
  if (timingContext.questionTime) {
    temporal.questionHour = calculateHourNumber(timingContext.questionTime);
  }
  if (timingContext.actionDate) {
    temporal.actionDay = calculateDayNumber(timingContext.actionDate);
  }
  if (timingContext.actionTime) {
    temporal.actionHour = calculateHourNumber(timingContext.actionTime);
  }

  const prompt = buildAnalysisPrompt(analysisType, profile, temporal, timingContext);

  // Call secure API endpoint instead of client-side OpenRouter
  const response = await fetch('/api/analyze-mystical', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
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
