import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundPattern } from '@/components/background-pattern';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  function handleLogin() {
    if (!email.trim() || !password) {
      setError('Ingresa tu correo electrónico y contraseña.');
      return;
    }
    setError('');
    // Demo only: connect an authentication service before production.
    router.replace('/(tabs)/home');
  }
  return (
    <View style={styles.container}>
      <BackgroundPattern />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <View style={styles.card}>
              <Image
                source={require('@/assets/images/kassaroomie.png')}
                accessibilityLabel="Kassa Roomie"
                style={styles.logo}
                contentFit="contain"
              />
              <Text role="heading" style={styles.title}>Bienvenido</Text>
              <Text style={styles.subtitle}>Gestiona tu hogar fácilmente</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput accessibilityLabel="Correo electrónico" style={styles.input} placeholder="tu@email.com" placeholderTextColor="#7C8191" autoCapitalize="none" autoCorrect={false} autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput accessibilityLabel="Contraseña" style={styles.input} placeholder="••••••••" placeholderTextColor="#7C8191" secureTextEntry autoCapitalize="none" autoComplete="current-password" returnKeyType="go" onSubmitEditing={handleLogin} value={password} onChangeText={setPassword} />
              </View>
              <Pressable accessibilityRole="button" style={styles.forgot} onPress={() => Alert.alert('Recuperar contraseña', 'La recuperación de contraseña estará disponible próximamente.')}>
                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
              {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
              <Pressable accessibilityRole="button" onPress={handleLogin} style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </Pressable>
              <View style={styles.signUpRow}>
                <Text style={styles.signUpText}>¿No tienes cuenta? </Text>
                <Pressable accessibilityRole="button" style={styles.linkButton} onPress={() => router.push('/register')}>
                  <Text style={[styles.link, { fontWeight: '600' }]}>Regístrate</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
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
