import type { ConversationTurn, UserProfile } from '../types';

/**
 * Very simple, deterministic "AI" agent that generates leading questions
 * based on minimal heuristics. Replace with a real LLM call later.
 */
export function generateNextQuestion(
  conversation: ConversationTurn[],
  profile?: Partial<UserProfile>
): string {
  const lastUserMsg = [...conversation].reverse().find(t => t.role === 'user');

  if (!conversation.length) {
    return 'Welcome! What is your top financial goal in the US right now?';
  }

  // Simple heuristics to vary prompts
  if (profile?.goals && !/timeline|when|horizon/i.test(lastUserMsg?.content || '')) {
    return `Great goal: "${profile.goals}". By when would you like to achieve it?`;
  }

  if (profile?.monthlyIncome && !profile?.monthlyExpenses) {
    return 'Thanks! About how much do you spend in a typical month?';
  }

  if (profile?.monthlyIncome && profile?.monthlyExpenses && !profile?.riskTolerance) {
    return 'How comfortable are you with investment risk: low, medium, or high?';
  }

  if (!profile?.timeHorizon) {
    return 'What investment time horizon feels right: short (<3y), medium (3-7y), or long (7y+)?';
  }

  const fallbackVariants = [
    'Could you tell me more about what success looks like for you financially?',
    'Are there any constraints I should know about (e.g., visa status, remittances)?',
    'Do you expect any major life events soon that could affect your finances?',
    'Would you like help prioritizing saving, investing, or building credit first?',
  ];
  const idx = Math.abs(hashString((lastUserMsg?.content || '') + JSON.stringify(profile || {}))) % fallbackVariants.length;
  return fallbackVariants[idx];
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h;
}
