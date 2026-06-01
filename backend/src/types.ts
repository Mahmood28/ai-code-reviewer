export type Severity = 'critical' | 'warning' | 'info' | 'good';
export type Category =
  | 'security'
  | 'bug'
  | 'readability'
  | 'structure'
  | 'maintainability'
  | 'performance'
  | 'convention';

export interface Finding {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  snippet: string;
  fix: string;
}

export interface ReviewScores {
  overall: number;
  readability: number;
  structure: number;
  maintainability: number;
  security: number;
}

export interface ReviewResult {
  scores: ReviewScores;
  summary: string;
  findings: Finding[];
  topPriorities: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ReviewRequest {
  code: string;
  language: string;
}

export interface ChatRequest {
  question: string;
  code: string;
  language: string;
  summary: string;
  history: ChatMessage[];
}
