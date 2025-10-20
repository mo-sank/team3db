import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const [location, setLocation] = React.useState('');
  const [familySize, setFamilySize] = React.useState('');
  const [incomeRange, setIncomeRange] = React.useState('');
  const [goal, setGoal] = React.useState('');

  const canContinue = location && familySize && incomeRange && goal;

  const handleContinue = async () => {
    const profile = { location, familySize: Number(familySize), incomeRange, goal, xp: 0 };
    await AsyncStorage.setItem('masari.userProfile', JSON.stringify(profile));
    navigation.replace('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Local Financial Guide</Text>
      <Text style={styles.subtitle}>Let’s personalize your experience</Text>

      <Text style={styles.label}>Where do you live?</Text>
      <TextInput
        placeholder="City, neighborhood"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Text style={styles.label}>Family size</Text>
      <TextInput
        placeholder="e.g., 3"
        value={familySize}
        onChangeText={setFamilySize}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Monthly income range</Text>
      <TextInput
        placeholder="$1000 - $2000"
        value={incomeRange}
        onChangeText={setIncomeRange}
        style={styles.input}
      />

      <Text style={styles.label}>Biggest goal</Text>
      <TextInput
        placeholder="e.g., Save $200 for rent"
        value={goal}
        onChangeText={setGoal}
        style={styles.input}
      />

      <Pressable style={[styles.button, !canContinue && styles.buttonDisabled]} onPress={handleContinue} disabled={!canContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0a7',
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a8e6cf',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
});
