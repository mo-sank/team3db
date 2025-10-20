import { Platform } from 'react-native';

// Lazy import to avoid Jest/Node issues if AsyncStorage is missing in tests
let AsyncStorage: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

const memoryStore = new Map<string, string>();

export async function setItem(key: string, value: string): Promise<void> {
  if (AsyncStorage) {
    await AsyncStorage.setItem(key, value);
    return;
  }
  memoryStore.set(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (AsyncStorage) {
    return AsyncStorage.getItem(key);
  }
  return memoryStore.has(key) ? (memoryStore.get(key) as string) : null;
}

export async function removeItem(key: string): Promise<void> {
  if (AsyncStorage) {
    await AsyncStorage.removeItem(key);
    return;
  }
  memoryStore.delete(key);
}

export const STORAGE_KEYS = {
  hasCompletedOnboarding: 'hasCompletedOnboarding',
  userProfile: 'userProfile',
} as const;
