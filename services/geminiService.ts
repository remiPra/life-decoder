
import OpenAI from "openai";
import { NumerologyProfile, TemporalNumbers, AIResponse, AnalysisModule, TimingContext } from "../types";
import { calculateDayNumber, calculateHourNumber } from "../utils/numerology";
import { buildAnalysisPrompt, SYSTEM_PROMPT } from "./analysisPrompts";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  dangerouslyAllowBrowser: true
});

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

  const response = await openai.chat.completions.create({
    model: "openai/gpt-5.1",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    max_tokens: 4000,
    temperature: 0.8
  });

  return {
    analysis: response.choices[0].message.content || "Aucune réponse reçue."
  };
};
