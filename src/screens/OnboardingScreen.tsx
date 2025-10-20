import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ConversationTurn, UserProfile } from '../types';
import { generateNextQuestion } from '../services/aiAgent';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const initialProfile: UserProfile = {
  fullName: '',
  countryOfOrigin: '',
  yearsInUS: '',
  goals: '',
  monthlyIncome: '',
  monthlyExpenses: '',
  riskTolerance: '',
  timeHorizon: '',
};

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [profile, setProfile] = useState<UserProfile>({ ...initialProfile });
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [userInput, setUserInput] = useState('');

  const canFinish = useMemo(() => {
    return (
      profile.fullName.trim().length > 0 &&
      profile.countryOfOrigin.trim().length > 0 &&
      profile.yearsInUS.trim().length > 0
    );
  }, [profile]);

  useEffect(() => {
    // Seed the conversation with an initial assistant question
    if (conversation.length === 0) {
      const q = generateNextQuestion([], profile);
      setConversation([{ role: 'assistant', content: q }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendUserMessage = () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;
    const nextConv = [...conversation, { role: 'user', content: trimmed }];
    const nextQuestion = generateNextQuestion(nextConv, profile);
    setConversation([...nextConv, { role: 'assistant', content: nextQuestion }]);
    setUserInput('');
  };

  const updateProfile = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Welcome</Text>
        <Text style={styles.subheader}>
          Let's get to know you so we can tailor financial guidance for your US journey.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About you</Text>
          <LabeledInput
            label="Full name"
            value={profile.fullName}
            onChangeText={t => updateProfile('fullName', t)}
            placeholder="e.g., Ana Gomez"
          />
          <LabeledInput
            label="Country of origin"
            value={profile.countryOfOrigin}
            onChangeText={t => updateProfile('countryOfOrigin', t)}
            placeholder="e.g., Mexico"
          />
          <LabeledInput
            label="Years in the US"
            value={profile.yearsInUS}
            onChangeText={t => updateProfile('yearsInUS', t.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="e.g., 2"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals and finances</Text>
          <LabeledInput
            label="Your top financial goal"
            value={profile.goals}
            onChangeText={t => updateProfile('goals', t)}
            placeholder="e.g., build emergency fund, invest, buy a car"
            multiline
          />
          <LabeledInput
            label="Monthly income (USD)"
            value={profile.monthlyIncome}
            onChangeText={t => updateProfile('monthlyIncome', t.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="e.g., 3500"
          />
          <LabeledInput
            label="Monthly expenses (USD)"
            value={profile.monthlyExpenses}
            onChangeText={t => updateProfile('monthlyExpenses', t.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="e.g., 2200"
          />

          <Text style={styles.label}>Risk tolerance</Text>
          <Segmented
            options={['low', 'medium', 'high']}
            value={profile.riskTolerance}
            onChange={v => updateProfile('riskTolerance', v as UserProfile['riskTolerance'])}
          />

          <Text style={styles.label}>Time horizon</Text>
          <Segmented
            options={['short', 'medium', 'long']}
            value={profile.timeHorizon}
            onChange={v => updateProfile('timeHorizon', v as UserProfile['timeHorizon'])}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI helper</Text>
          <Text style={styles.helperText}>
            This helper asks leading questions to clarify your goals. You can replace it later with a
            real AI service.
          </Text>

          <View style={styles.chatBox}>
            {conversation.map((turn, idx) => (
              <View
                key={idx}
                style={[styles.bubble, turn.role === 'assistant' ? styles.assistant : styles.user]}
              >
                <Text style={styles.bubbleRole}>{turn.role === 'assistant' ? 'Advisor' : 'You'}</Text>
                <Text style={styles.bubbleText}>{turn.content}</Text>
              </View>
            ))}
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex]}
              placeholder="Type your reply"
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={sendUserMessage}
              returnKeyType="send"
            />
            <Pressable style={styles.primaryButton} onPress={sendUserMessage}>
              <Text style={styles.primaryButtonText}>Send</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.primaryButton, !canFinish && styles.buttonDisabled]}
          onPress={() => canFinish && onComplete(profile)}
          disabled={!canFinish}
        >
          <Text style={styles.primaryButtonText}>Save and continue</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LabeledInput(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
}) {
  const { label, value, onChangeText, placeholder, keyboardType, multiline } = props;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

function Segmented(props: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { options, value, onChange } = props;
  return (
    <View style={styles.segmented}>
      {options.map(opt => {
        const selected = value === opt;
        return (
          <Pressable
            key={opt}
            style={[styles.segment, selected && styles.segmentSelected]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    gap: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
  },
  subheader: {
    fontSize: 15,
    color: '#666',
  },
  section: {
    paddingVertical: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  segmentSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#e5edff',
  },
  segmentText: {
    color: '#333',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: '#1e40af',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
  },
  chatBox: {
    gap: 8,
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '92%',
  },
  assistant: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-end',
  },
  bubbleRole: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
