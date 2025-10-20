export type LanguageCode = 'en' | 'es' | 'am';

export type TranslationKeys =
  | 'hello'
  | 'selectLanguageInstruction'
  | 'continue'
  | 'start'
  | 'aiIntro'
  | 'questionMoney'
  | 'questionKids'
  | 'questionMarried'
  | 'questionSavings'
  | 'summaryTitle'
  | 'summaryMoney'
  | 'summaryKids'
  | 'summaryMarried'
  | 'summarySavings'
  | 'finish';

export type Translations = Record<LanguageCode, Partial<Record<TranslationKeys, string>>>;

export const languages: Array<{ code: LanguageCode; name: string; hello: string }> = [
  { code: 'en', name: 'English', hello: 'Hello' },
  { code: 'es', name: 'Español', hello: 'Hola' },
  { code: 'am', name: 'Amharic', hello: 'Selam' },
];

export const i18n: Translations = {
  en: {
    hello: 'Hello',
    selectLanguageInstruction: 'Swipe to choose your language',
    continue: 'Continue',
    start: 'Start',
    aiIntro: "Great! I'll ask a few questions to personalize your plan.",
    questionMoney: 'How much money do you have available each month?',
    questionKids: 'Do you have children?',
    questionMarried: 'Are you married?',
    questionSavings: 'How much do you have in savings?',
    summaryTitle: 'Thanks! Here is what I heard:',
    summaryMoney: 'Monthly available money',
    summaryKids: 'Children',
    summaryMarried: 'Married',
    summarySavings: 'Savings',
    finish: 'Finish',
  },
  es: {
    hello: 'Hola',
    selectLanguageInstruction: 'Desliza para elegir tu idioma',
    continue: 'Continuar',
    start: 'Comenzar',
    aiIntro: '¡Genial! Haré algunas preguntas para personalizar tu plan.',
    questionMoney: '¿Cuánto dinero tienes disponible cada mes?',
    questionKids: '¿Tienes hijos?',
    questionMarried: '¿Estás casado/a?',
    questionSavings: '¿Cuánto tienes en ahorros?',
    summaryTitle: '¡Gracias! Esto es lo que entendí:',
    summaryMoney: 'Dinero disponible al mes',
    summaryKids: 'Hijos',
    summaryMarried: 'Casado/a',
    summarySavings: 'Ahorros',
    finish: 'Finalizar',
  },
  am: {
    hello: 'Selam',
    // Amharic translations can be added; fallback to English for others.
  },
};

export function t(language: LanguageCode, key: TranslationKeys): string {
  const langTable = i18n[language] || {};
  return (langTable[key] as string) ?? (i18n.en[key] as string);
}

export function getLanguageName(code: LanguageCode): string {
  const lang = languages.find(l => l.code === code);
  return lang ? lang.name : code;
}
