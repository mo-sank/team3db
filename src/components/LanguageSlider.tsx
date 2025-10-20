import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { LanguageCode } from '../i18n/translations';
import { languages } from '../i18n/translations';

const { width } = Dimensions.get('window');

export function LanguageSlider({
  initial,
  onChange,
}: {
  initial?: LanguageCode;
  onChange: (code: LanguageCode) => void;
}) {
  const initialIndex = useMemo(() => {
    if (!initial) return 0;
    const idx = languages.findIndex(l => l.code === initial);
    return idx >= 0 ? idx : 0;
  }, [initial]);
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(x / width);
    setCurrentIndex(nextIndex);
    const code = languages[nextIndex]?.code ?? languages[0].code;
    onChange(code);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={languages}
        keyExtractor={item => item.code}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}> 
            <Text style={styles.hello}>{item.hello}</Text>
            <Text style={styles.langName}>{item.name}</Text>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />
      <View style={styles.dots}>
        {languages.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hello: { fontSize: 48, fontWeight: '700' },
  langName: { marginTop: 8, fontSize: 18, color: '#666' },
  dots: { flexDirection: 'row', gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#333' },
});
