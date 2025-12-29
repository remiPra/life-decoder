import { NumerologyProfile, TemporalNumbers, AIResponse, AnalysisModule, TimingContext } from "../types";
import { calculateDayNumber, calculateHourNumber } from "../utils/numerology";
import { buildAnalysisPrompt, SYSTEM_PROMPT } from "./analysisPrompts";
import { streamCompletion } from "../utils/streaming";

export const runAnalysis = async (
  analysisType: AnalysisModule,
  profile: NumerologyProfile,
  timingContext: TimingContext = {},
  onChunk?: (text: string) => void
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

  const content = await streamCompletion(
    '/api/analyze-mystical',
    { systemPrompt: SYSTEM_PROMPT, prompt },
    { onChunk }
  );

  return {
    analysis: content || "Aucune réponse reçue."
  };
};
