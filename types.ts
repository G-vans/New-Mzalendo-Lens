
export interface ImpactCard {
  title: string;
  description: string;
  icon: string;
  category: 'Salary' | 'Fuel' | 'Food' | 'Business' | 'Digital' | 'Other';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BillAnalysis {
  summary: string;
  detailedSummary: string;
  impactCards: ImpactCard[];
  quiz: QuizQuestion[];
}

export interface FileData {
  base64: string;
  mimeType: string;
}

export enum AppState {
  START = 'START',
  ANALYZING = 'ANALYZING',
  BREAKDOWN = 'BREAKDOWN',
  QUIZ = 'QUIZ',
  SUMMARY = 'SUMMARY'
}
