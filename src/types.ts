export type ConversationRole = 'user' | 'assistant';

export interface ConversationTurn {
  role: ConversationRole;
  content: string;
}

export interface UserProfile {
  fullName: string;
  countryOfOrigin: string;
  yearsInUS: string; // keep as string for TextInput compatibility
  goals: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  riskTolerance: 'low' | 'medium' | 'high' | '';
  timeHorizon: 'short' | 'medium' | 'long' | '';
}
