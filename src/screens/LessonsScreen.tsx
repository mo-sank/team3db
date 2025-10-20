import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Lesson { id: string; title: string; points: number; done?: boolean }

const LESSONS: Lesson[] = [
  { id: 'l1', title: 'Budget as a single parent', points: 20 },
  { id: 'l2', title: 'Use banking apps safely', points: 15 },
  { id: 'l3', title: 'Avoid common scam messages', points: 15 },
];

export default function LessonsScreen() {
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});
  const [xp, setXp] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('masari.userProfile');
      if (stored) {
        const p = JSON.parse(stored);
        setXp(p.xp || 0);
      }
    })();
  }, []);

  const handleComplete = async (lesson: Lesson) => {
    if (completed[lesson.id]) return;
    const newCompleted = { ...completed, [lesson.id]: true };
    setCompleted(newCompleted);
    const newXp = xp + lesson.points;
    setXp(newXp);
    const stored = await AsyncStorage.getItem('masari.userProfile');
    if (stored) {
      const p = JSON.parse(stored);
      await AsyncStorage.setItem('masari.userProfile', JSON.stringify({ ...p, xp: newXp }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lessons</Text>
      <Text style={styles.subheader}>Your XP: {xp}</Text>
      <FlatList
        data={LESSONS}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.points}>+{item.points} XP</Text>
            <Pressable
              style={[styles.button, completed[item.id] && styles.buttonDisabled]}
              onPress={() => handleComplete(item)}
              disabled={!!completed[item.id]}
            >
              <Text style={styles.buttonText}>{completed[item.id] ? 'Completed' : 'Start Lesson'}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { fontSize: 20, fontWeight: '700' },
  subheader: { color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee', gap: 6 },
  title: { fontWeight: '700' },
  points: { color: '#0a7' },
  button: { marginTop: 8, backgroundColor: '#0a7', padding: 12, alignItems: 'center', borderRadius: 10 },
  buttonDisabled: { backgroundColor: '#a8e6cf' },
  buttonText: { color: 'white', fontWeight: '700' },
});
