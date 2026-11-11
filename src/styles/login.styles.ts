import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
  signUpLink: { fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#87a96b' },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 448, backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 28, paddingVertical: 32, alignItems: 'center', shadowColor: '#263818', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.24, shadowRadius: 24, elevation: 8 },
  logo: { width: 144, height: 96, marginBottom: 24 },
  title: { fontSize: 30, fontWeight: '700', color: '#242B3B', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#606A7C', marginTop: 8, marginBottom: 32, textAlign: 'center' },
  field: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#424D62', marginBottom: 6 },
  input: { width: '100%', minHeight: 48, backgroundColor: '#F3F3F5', borderRadius: 9, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#242B3B' },
  forgot: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', marginBottom: 12 },
  link: { fontSize: 14, color: '#385DE0' },
  error: { color: '#B42318', marginBottom: 12, alignSelf: 'stretch', fontSize: 14 },
  button: { width: '100%', minHeight: 48, backgroundColor: '#5078FF', borderRadius: 8, padding: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  signUpRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  signUpText: { fontSize: 14, color: '#606A7C' },
  linkButton: { minHeight: 44, justifyContent: 'center' },
});
