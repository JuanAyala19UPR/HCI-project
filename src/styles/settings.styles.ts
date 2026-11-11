import { StyleSheet } from 'react-native';

export const createSettingsStyles = (dark: boolean) => StyleSheet.create({
  helpModal: { height: '90%', minHeight: 0 },
  modalScroll: { flexShrink: 1, minHeight: 0 },
  screen: { flex: 1, backgroundColor: dark ? '#0A0A0A' : '#FFFFFF' }, content: { paddingBottom: 24 }, header: { backgroundColor: dark ? '#101010' : '#819D34', padding: 24 }, title: { color: dark ? '#FFFFFF' : '#FFFFFF', fontSize: 30, fontWeight: '700' },
  body: { padding: 16, gap: 16 }, card: { borderWidth: 1, borderColor: dark ? '#404040' : '#E5E7EB', borderRadius: 16, padding: 24, backgroundColor: dark ? '#0A0A0A' : '#FFFFFF' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: dark ? '#FFFFFF' : '#111827', marginBottom: 12 }, description: { fontSize: 14, lineHeight: 20, color: dark ? '#FFFFFF' : '#788092', marginBottom: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 }, avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#5279FF', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: dark ? '#FFFFFF' : '#FFFFFF', fontSize: 20 },
  flex: { flex: 1, minWidth: 0 }, profileName: { fontSize: 18, fontWeight: '700', color: dark ? '#FFFFFF' : '#111827', marginBottom: 4 }, small: { color: dark ? '#FFFFFF' : '#788092', fontSize: 12, lineHeight: 17 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }, rowText: { color: dark ? '#FFFFFF' : '#1F2937', fontSize: 14 }, separator: { height: 1, backgroundColor: dark ? '#404040' : '#E5E7EB', marginVertical: 8 },
  edit: { minHeight: 44, paddingHorizontal: 12, borderWidth: 1, borderColor: dark ? '#404040' : '#E5E7EB', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, editText: { color: dark ? '#FFFFFF' : '#111827', fontSize: 12 },
  logout: { borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, logoutText: { fontSize: 14, color: dark ? '#FFFFFF' : '#EF233C' }, version: { textAlign: 'center', color: dark ? '#FFFFFF' : '#788092', fontSize: 12, padding: 20 }, disabled: { opacity: 0.75 },
  overlay: { flex: 1, backgroundColor: '#000000AA' }, modalArea: { flex: 1, padding: 20, justifyContent: 'center' }, modal: { width: '100%', maxWidth: 448, maxHeight: '100%', alignSelf: 'center', backgroundColor: dark ? '#0A0A0A' : '#FFFFFF', borderRadius: 20, overflow: 'hidden' }, modalContent: { padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 }, modalTitle: { flex: 1, fontSize: 22, fontWeight: '700', color: dark ? '#FFFFFF' : '#242B3B' }, iconButton: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: dark ? '#FFFFFF' : '#424D62', marginTop: 20, marginBottom: 8 }, input: { minHeight: 48, borderWidth: 1, borderColor: '#CBD0D8', borderRadius: 9, padding: 12, color: dark ? '#FFFFFF' : '#242B3B', fontSize: 16 }, paragraph: { fontSize: 14, lineHeight: 22, color: dark ? '#FFFFFF' : '#606A7C', marginTop: 12 },
  primary: { minHeight: 44, borderRadius: 8, backgroundColor: '#6B8E23', padding: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 }, primaryText: { color: dark ? '#FFFFFF' : '#FFFFFF', fontSize: 14, fontWeight: '600' }, footer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 12 }, error: { color: dark ? '#FFFFFF' : '#B91C1C', fontSize: 14, marginTop: 12 },
});
