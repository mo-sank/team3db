import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function MentorScreen() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('masari.userProfile');
      if (stored) setProfile(JSON.parse(stored));
      setMessages([
        {
          id: 'intro',
          role: 'assistant',
          text: 'Hi! I\'m your Masari Mentor. Ask me about budgeting, groceries, or daycare near you.',
        },
      ]);
    })();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: input.trim() };
    const replyText = generateReply(input.trim(), profile);
    const botMsg: Message = { id: String(Date.now() + 1), role: 'assistant', text: replyText };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ gap: 8, padding: 12 }}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message" />
        <Pressable style={styles.send} onPress={handleSend}><Text style={styles.sendText}>Send</Text></Pressable>
      </View>
    </View>
  );
}

function generateReply(query: string, profile: any): string {
  const q = query.toLowerCase();
  if (q.includes('grocery') || q.includes('food')) {
    return 'Try FreshMart on 3rd St — weekly deals save ~10-15%. Set a list before shopping.';
  }
  if (q.includes('daycare') || q.includes('childcare')) {
    return 'Little Steps Daycare near your area offers sliding-scale fees. Call to ask about discounts.';
  }
  if (q.includes('bank') || q.includes('fees')) {
    return 'Consider low-fee community bank accounts and avoid ATM out-of-network fees when possible.';
  }
  if (q.includes('budget') || q.includes('save')) {
    const fm = profile?.familySize ? `for your family of ${profile.familySize}` : 'for your family';
    return `Set weekly envelopes ${fm}. Start with food, transport, and a small savings bucket.`;
  }
  return 'I can help with budgeting, groceries, daycare, and safe banking. What do you need?';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0a7',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  bubbleText: { color: '#111' },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  send: {
    backgroundColor: '#0a7',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  sendText: { color: 'white', fontWeight: '700' },
});
