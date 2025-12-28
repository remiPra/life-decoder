
export type AnalysisModule =
  | 'life-decoder' | 'soul-purpose' | 'expression-profile' | 'career-destiny'
  | 'relationship-map' | 'wealth-code' | 'complete-chart'
  | 'decision-oracle' | 'daily-alignment' | 'future-timeline';

export interface UserIdentity {
  firstName: string;
  lastName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

export interface TimingContext {
  questionDate?: string;
  questionTime?: string;
  actionDate?: string;
  actionTime?: string;
  questionType?: string;
  context?: string;
}

export interface NumerologyProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  realization: number;
  hiddenPower: number;
  personalYear: number;
  birthMonth: number;
  birthDay: number;
  birthYear: number;
}

export interface TemporalNumbers {
  questionDay?: number;
  questionHour?: number;
  actionDay?: number;
  actionHour?: number;
}

export interface AIResponse {
  analysis: string;
}

export enum AppStep {
  INITIATION = 'INITIATION',
  NEXUS = 'NEXUS',
  CONSULTATION = 'CONSULTATION'
}
