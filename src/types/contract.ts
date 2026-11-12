export type RiskLevel = 'High Risk' | 'Medium Risk' | 'Compliant';

export type ClauseCategory = 
  | 'Indemnification'
  | 'Data Privacy'
  | 'Termination'
  | 'Payment Terms'
  | 'Liability & Warranties'
  | 'General';

export interface ClauseAnalysis {
  id: string;
  sectionNumber: string;
  title: string;
  category: ClauseCategory;
  riskLevel: RiskLevel;
  exactQuote: string;
  startIndex?: number;
  endIndex?: number;
  explanation: string;
  marketStandard: string;
  suggestedCounterClause: string;
  negotiationTip?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'customized';
  customCounterClause?: string;
}

export interface ContractDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  wordCount: number;
  overallRiskScore: number; // 0 - 100
  riskSummary: {
    high: number;
    medium: number;
    compliant: number;
    total: number;
  };
  categoryBreakdown: Record<ClauseCategory, { high: number; medium: number; compliant: number }>;
  executiveSummary: string;
  content: string;
  clauses: ClauseAnalysis[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: {
    clauseId?: string;
    sectionNumber: string;
    quote: string;
  }[];
}

export interface RedlineExportOptions {
  includeOriginal: boolean;
  includeExplanation: boolean;
  includeMarketBenchmark: boolean;
  filterRiskLevel: 'All' | 'High Risk' | 'Medium and High';
  format: 'markdown' | 'docx' | 'html';
  reviewerName: string;
  companyName: string;
  notes: string;
}
