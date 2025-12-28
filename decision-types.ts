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
