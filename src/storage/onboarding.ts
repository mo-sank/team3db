import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LanguageCode } from '../i18n/translations';

const KEYS = {
  selectedLanguage: 'onboarding.selectedLanguage',
  hasOnboarded: 'onboarding.hasOnboarded',
  answers: 'onboarding.answers',
} as const;

export type OnboardingAnswers = {
  money?: string;
  kids?: string;
  married?: string;
  savings?: string;
};

export async function getSelectedLanguage(): Promise<LanguageCode | null> {
  const code = await AsyncStorage.getItem(KEYS.selectedLanguage);
  return (code as LanguageCode) ?? null;
}

export async function setSelectedLanguage(code: LanguageCode): Promise<void> {
  await AsyncStorage.setItem(KEYS.selectedLanguage, code);
}

export async function getHasOnboarded(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.hasOnboarded);
  return v === 'true';
}

export async function setHasOnboarded(v: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.hasOnboarded, v ? 'true' : 'false');
}

export async function getAnswers(): Promise<OnboardingAnswers> {
  const raw = await AsyncStorage.getItem(KEYS.answers);
  return raw ? (JSON.parse(raw) as OnboardingAnswers) : {};
}

export async function setAnswers(answers: OnboardingAnswers): Promise<void> {
  await AsyncStorage.setItem(KEYS.answers, JSON.stringify(answers));
}
