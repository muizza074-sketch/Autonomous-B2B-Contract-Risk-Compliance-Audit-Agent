import { ClauseAnalysis } from '../types/contract';

export interface AnalysisResponse {
  overallRiskScore: number;
  executiveSummary: string;
  clauses: ClauseAnalysis[];
}

export interface AskResponse {
  answer: string;
  citations?: {
    clauseId?: string;
    sectionNumber: string;
    quote: string;
  }[];
}

export async function analyzeContract(text: string, title?: string): Promise<AnalysisResponse> {
  const response = await fetch('/api/analyze-contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, title }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export async function askContract(
  contractText: string,
  contractTitle: string,
  question: string,
  history?: Array<{ role: string; content: string }>
): Promise<AskResponse> {
  const response = await fetch('/api/ask-contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractText, contractTitle, question, history }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Query failed' }));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export async function generateAlternateCounter(
  clauseText: string,
  category: string,
  tone: 'aggressive' | 'balanced' | 'vendor_favorable'
): Promise<string> {
  const response = await fetch('/api/generate-alternate-counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clauseText, category, tone }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate alternate counter-clause');
  }

  const data = await response.json();
  return data.counterClause;
}
