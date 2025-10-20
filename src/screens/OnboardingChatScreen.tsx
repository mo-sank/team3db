import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { LanguageCode, t } from '../i18n/translations';
import type { OnboardingAnswers } from '../storage/onboarding';

export type ChatMessage = { id: string; role: 'assistant' | 'user'; content: string };

export function OnboardingChatScreen({
  language,
  onComplete,
}: {
  language: LanguageCode;
  onComplete: (answers: OnboardingAnswers) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<number>(0);
  const answersRef = useRef<OnboardingAnswers>({});

  const steps = useMemo(
    () => [
      { key: 'money', text: t(language, 'questionMoney') },
      { key: 'kids', text: t(language, 'questionKids') },
      { key: 'married', text: t(language, 'questionMarried') },
      { key: 'savings', text: t(language, 'questionSavings') },
    ],
    [language],
  );

  useEffect(() => {
    // Reset when language changes
    setMessages([
      { id: 'intro-1', role: 'assistant', content: t(language, 'aiIntro') },
      { id: 'q-0', role: 'assistant', content: steps[0].text },
    ]);
    setStep(0);
  }, [language, steps]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const currentKey = steps[step].key as keyof OnboardingAnswers;

    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    answersRef.current[currentKey] = text;
    setInput('');

    const nextStep = step + 1;
    if (nextStep < steps.length) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: `q-${nextStep}`, role: 'assistant', content: steps[nextStep].text },
        ]);
        setStep(nextStep);
      }, 250);
    } else {
      // Finish and show summary
      setTimeout(() => {
        const a = answersRef.current;
        const summaryLines = [
          t(language, 'summaryTitle'),
          `${t(language, 'summaryMoney')}: ${a.money ?? ''}`.trim(),
          `${t(language, 'summaryKids')}: ${a.kids ?? ''}`.trim(),
          `${t(language, 'summaryMarried')}: ${a.married ?? ''}`.trim(),
          `${t(language, 'summarySavings')}: ${a.savings ?? ''}`.trim(),
        ];
        setMessages(prev => [
          ...prev,
          { id: 'summary', role: 'assistant', content: summaryLines.join('\n') },
        ]);
      }, 250);
    }
  };

  const handleFinish = () => {
    onComplete(answersRef.current);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={item.role === 'user' ? styles.userText : styles.assistantText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
        <View style={styles.inputRow}>
          <TextInput
            placeholder={steps[step]?.text}
            value={input}
            onChangeText={setInput}
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendText}>{t(language, 'start')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.finishRow}>
          <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
            <Text style={styles.finishText}>{t(language, 'finish')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  bubble: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: '80%',
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#1f6feb' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1' },
  userText: { color: 'white' },
  assistantText: { color: '#222' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8 },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
  },
  sendBtn: {
    backgroundColor: '#1f6feb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendText: { color: 'white', fontWeight: '600' },
  finishRow: { paddingHorizontal: 12, paddingBottom: 12 },
  finishBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishText: { color: 'white', fontWeight: '700' },
});
