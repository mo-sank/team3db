import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LanguageSlider } from '../components/LanguageSlider';
import { LanguageCode, t } from '../i18n/translations';

export function OnboardingLanguageScreen({
  initialLanguage,
  onContinue,
}: {
  initialLanguage?: LanguageCode;
  onContinue: (lang: LanguageCode) => void;
}) {
  const [selected, setSelected] = useState<LanguageCode>(initialLanguage ?? 'en');

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.subtitle}>{t(selected, 'selectLanguageInstruction')}</Text>
      </View>
      <View style={styles.sliderArea}>
        <LanguageSlider initial={initialLanguage} onChange={setSelected} />
      </View>
      <View style={styles.footerArea}>
        <TouchableOpacity style={styles.button} onPress={() => onContinue(selected)}>
          <Text style={styles.buttonText}>{t(selected, 'continue')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  headerArea: { alignItems: 'center', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#666' },
  sliderArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footerArea: { paddingBottom: 24 },
  button: {
    backgroundColor: '#1f6feb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
