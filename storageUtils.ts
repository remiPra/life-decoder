import { DecisionResult } from './decision-types';

const DECISIONS_KEY = 'life_decoder_decisions';
const FREE_LIMIT_KEY = 'life_decoder_free_count';
const FREE_LIMIT = 1; // 1 décision gratuite

export function saveDecision(decision: DecisionResult): void {
  const decisions = getDecisions();
  decisions.push(decision);
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));

  // Incrémenter le compteur gratuit
  incrementFreeCount();
}

export function getDecisions(): DecisionResult[] {
  const data = localStorage.getItem(DECISIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getFreeCount(): number {
  const count = localStorage.getItem(FREE_LIMIT_KEY);
  return count ? parseInt(count) : 0;
}

function incrementFreeCount(): void {
  const current = getFreeCount();
  localStorage.setItem(FREE_LIMIT_KEY, (current + 1).toString());
}

export function hasReachedFreeLimit(): boolean {
  return getFreeCount() >= FREE_LIMIT;
}

export function clearDecisions(): void {
  localStorage.removeItem(DECISIONS_KEY);
  localStorage.removeItem(FREE_LIMIT_KEY);
}
