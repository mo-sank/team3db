import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Recommendation { id: string; category: 'Grocery' | 'Daycare' | 'Transport' | 'Bank'; name: string; price?: string; note?: string }

const STATIC_RECS: Recommendation[] = [
  { id: 'r1', category: 'Grocery', name: 'FreshMart - Weekly Deals', price: '$$', note: 'Save 10-15% with app coupons' },
  { id: 'r2', category: 'Daycare', name: 'Little Steps Daycare', price: '$$', note: 'Sliding-scale fees for families' },
  { id: 'r3', category: 'Transport', name: 'City Bus Pass', price: '$', note: 'Monthly pass cheaper than rideshare' },
  { id: 'r4', category: 'Bank', name: 'Community Bank Low-Fee Account', note: 'No minimum, low remittance fees' },
];

export default function RecommendationsScreen() {
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('masari.userProfile');
      if (stored) setProfile(JSON.parse(stored));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Local Recommendations</Text>
      {profile && <Text style={styles.subheader}>For {profile.location}</Text>}
      <FlatList
        data={STATIC_RECS}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.category}: {item.name}</Text>
            {item.price ? <Text style={styles.text}>Price: {item.price}</Text> : null}
            {item.note ? <Text style={styles.text}>{item.note}</Text> : null}
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
  text: { color: '#333' },
});
