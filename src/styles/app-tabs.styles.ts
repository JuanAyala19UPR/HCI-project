import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: 'center', backgroundColor: '#87a96b' },
  tabs: { flex: 1, width: '100%', maxWidth: 448, backgroundColor: '#FFFFFF' },
  slot: { flex: 1 },
  bar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#ECEEF2', paddingTop: 4 },
  tab: { flex: 1, minHeight: 56, justifyContent: 'center', alignItems: 'center', gap: 4, paddingVertical: 6 },
  tabText: { fontSize: 11, fontWeight: '500', color: '#788092' },
  activeText: { color: '#5369FF' },
  pressed: { opacity: 0.65 },
  placeholder: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 28, fontWeight: '700', color: '#242B3B' },
  description: { color: '#606A7C', textAlign: 'center', fontSize: 16, lineHeight: 24 },
});
