/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useState } from 'react';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import { getItem, setItem, STORAGE_KEYS } from './src/services/storage';
import type { UserProfile } from './src/types';

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
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const storedFlag = await getItem(STORAGE_KEYS.hasCompletedOnboarding);
      setHasCompletedOnboarding(storedFlag === 'true');
    })();
  }, []);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    await setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
    await setItem(STORAGE_KEYS.hasCompletedOnboarding, 'true');
    setHasCompletedOnboarding(true);
  };

  if (hasCompletedOnboarding === null) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {hasCompletedOnboarding ? (
        <HomeScreen />
      ) : (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
