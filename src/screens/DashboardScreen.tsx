import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const [profile, setProfile] = React.useState<any>(null);
  const [savingsProgress, setSavingsProgress] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('masari.userProfile');
      if (stored) {
        const p = JSON.parse(stored);
        setProfile(p);
        const target = extractTargetAmount(p.goal);
        if (target) {
          const current = Math.min(target, Math.round(target * 0.35));
          setSavingsProgress(Math.round((current / target) * 100));
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Masari Family</Text>
      {profile && (
        <View style={styles.card}>
          <Text style={styles.title}>Hi{profile?.familySize ? ` (Family of ${profile.familySize})` : ''}!</Text>
          <Text style={styles.text}>Goal: {profile.goal}</Text>
          <Text style={styles.text}>Location: {profile.location}</Text>
          <Text style={styles.text}>Income: {profile.incomeRange}</Text>
          <Text style={styles.progress}>Savings Goal Tracker: {savingsProgress}%</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Tip</Text>
        <Text style={styles.text}>
          Families nearby saved 15% by switching to FreshMart grocery.
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>See grocery deals</Text>
        </Pressable>
      </View>
    </View>
  );
}

function extractTargetAmount(goal: string): number | null {
  const match = goal?.match(/\$?(\d+[\d,]*)/);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ''));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    gap: 6,
  },
  title: {
    fontWeight: '700',
  },
  text: {
    color: '#333',
  },
  progress: {
    marginTop: 6,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0a7',
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
});
