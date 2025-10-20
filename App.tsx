/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MentorScreen from './src/screens/MentorScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Mentor" component={MentorScreen} />
      <Tab.Screen name="Lessons" component={LessonsScreen} />
      <Tab.Screen name="Local" component={RecommendationsScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [initialRoute, setInitialRoute] = React.useState<'Onboarding' | 'Main'>('Onboarding');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkOnboarded = async () => {
      try {
        const stored = await AsyncStorage.getItem('masari.userProfile');
        setInitialRoute(stored ? 'Main' : 'Onboarding');
      } catch (e) {
        setInitialRoute('Onboarding');
      } finally {
        setLoading(false);
      }
    };
    checkOnboarded();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
