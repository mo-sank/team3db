/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, ActivityIndicator } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useState } from 'react';
import { OnboardingLanguageScreen } from './src/screens/OnboardingLanguageScreen';
import { OnboardingChatScreen } from './src/screens/OnboardingChatScreen';
import type { LanguageCode } from './src/i18n/translations';
import { getHasOnboarded, getSelectedLanguage, setAnswers, setHasOnboarded, setSelectedLanguage } from './src/storage/onboarding';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboardedState] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [route, setRoute] = useState<'language' | 'chat' | 'home'>('language');

  useEffect(() => {
    (async () => {
      try {
        const [storedLang, onboarded] = await Promise.all([
          getSelectedLanguage(),
          getHasOnboarded(),
        ]);
        if (storedLang) setLanguage(storedLang);
        setHasOnboardedState(onboarded);
        setRoute(onboarded ? 'home' : 'language');
      } finally {
        setLoading(true);
        // allow small delay for smoother transition
        setTimeout(() => setLoading(false), 50);
      }
    })();
  }, []);

  const handleLanguageContinue = async (lang: LanguageCode) => {
    setLanguage(lang);
    await setSelectedLanguage(lang);
    setRoute('chat');
  };

  const handleChatComplete = async (answers: {
    money?: string;
    kids?: string;
    married?: string;
    savings?: string;
  }) => {
    await setAnswers(answers);
    await setHasOnboarded(true);
    setHasOnboardedState(true);
    setRoute('home');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!hasOnboarded) {
    if (route === 'language') {
      return (
        <View style={styles.container}>
          <OnboardingLanguageScreen
            initialLanguage={language}
            onContinue={handleLanguageContinue}
          />
        </View>
      );
    }

    if (route === 'chat') {
      return (
        <View style={styles.container}>
          <OnboardingChatScreen language={language} onComplete={handleChatComplete} />
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
});

export default App;
