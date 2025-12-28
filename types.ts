
export type AnalysisModule = 
  | 'BLUEPRINT' | 'SOUL_PURPOSE' | 'EXPRESSION' | 'CAREER' 
  | 'RELATIONSHIP' | 'WEALTH' | 'TIMING_ORACLE' | 'TIMELINE_5Y';

export interface UserIdentity {
  firstName: string;
  birthDate: string;
}

export interface TimingContext {
  actionDate: string;
  actionTime: string;
  category: 'DECISION' | 'LOVE' | 'MONEY' | 'CAREER' | 'SPIRITUAL';
  context: string;
}

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  hiddenForce: number;
  realization: number;
  personalYear: number;
}

export interface AIResponse {
  title: string;
  sections: { subtitle: string; content: string }[];
  strategicAdvice: string[];
  timingVerdict?: 'GO' | 'WAIT' | 'ADJUST';
  anchor: string;
}

export enum AppStep {
  INITIATION = 'INITIATION',
  NEXUS = 'NEXUS',
  TIMING_SETUP = 'TIMING_SETUP',
  CONSULTATION = 'CONSULTATION'
}
