import { StyleSheet } from 'react-native';

export const createOnboardingStyles = (dark: boolean) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000B3', justifyContent: 'center', alignItems: 'center' },
  container: { width: '100%', maxWidth: 448, maxHeight: '100%', padding: 16, justifyContent: 'center' },
  card: { backgroundColor: dark ? '#141414' : '#FFFFFF', borderRadius: 20, width: '100%', maxHeight: '100%', alignSelf: 'center', overflow: 'hidden' },
  content: { padding: 24 }, close: { alignSelf: 'flex-end', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: dark ? '#263523' : '#DCFCE7', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { color: dark ? '#FFFFFF' : '#111827', fontSize: 24, fontWeight: '700', textAlign: 'center' },
  description: { color: dark ? '#F0F0F0' : '#606A7C', fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 12, marginBottom: 24 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, small: { color: dark ? '#FFFFFF' : '#606A7C', fontSize: 13 },
  track: { height: 8, borderRadius: 4, backgroundColor: dark ? '#3A3A3A' : '#E5E7EB', overflow: 'hidden' }, fill: { height: 8, borderRadius: 4, backgroundColor: '#35C653' },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  secondary: { flexGrow: 1, minHeight: 44, borderWidth: 1, borderColor: dark ? '#555555' : '#D1D5DB', borderRadius: 8, padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }, secondaryText: { color: dark ? '#FFFFFF' : '#424D62', fontSize: 14, fontWeight: '600' },
  primary: { flexGrow: 1, minHeight: 44, borderRadius: 8, backgroundColor: '#248638', padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }, primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
