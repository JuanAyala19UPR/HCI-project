import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackgroundPattern } from '@/components/background-pattern';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const confirmationInput = useRef<TextInput>(null);

  function returnToLogin() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmation) {
      setError('Completa todos los campos.');
    } else if (!/^[^\s@]+@upr\.edu$/i.test(email.trim())) {
      setError('Usa tu correo institucional con el dominio @upr.edu.');
    } else if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
    } else if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
    } else {
      setError('');
      // Form validation only: connect an authentication service to create accounts.
      Alert.alert('Formulario validado', 'El registro de cuentas todavía no está conectado. No se ha creado una cuenta.');
    }
  }

  return (
    <View style={styles.container}>
      <BackgroundPattern />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <View style={styles.wrapper}>
              <Pressable accessibilityRole="button" accessibilityLabel="Volver al inicio de sesión" onPress={returnToLogin} style={styles.back}>
                <Text style={styles.backText}>←  Volver</Text>
              </Pressable>
              <View style={styles.card}>
                <Image source={require('@/assets/images/kassaroomie.png')} accessibilityLabel="Kassa Roomie" contentFit="contain" style={styles.logo} />
                <Text role="heading" style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Únete y organiza tu hogar</Text>

                <View style={styles.field}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput accessibilityLabel="Nombre completo" style={styles.input} placeholder="Juan Pérez" placeholderTextColor="#7C8191" autoComplete="name" autoCapitalize="words" value={name} onChangeText={setName} returnKeyType="next" onSubmitEditing={() => emailInput.current?.focus()} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Correo electrónico (@upr.edu)</Text>
                  <TextInput ref={emailInput} accessibilityLabel="Correo institucional con dominio @upr.edu" style={styles.input} placeholder="tu.nombre@upr.edu" placeholderTextColor="#7C8191" autoComplete="email" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" value={email} onChangeText={setEmail} returnKeyType="next" onSubmitEditing={() => passwordInput.current?.focus()} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Contraseña</Text>
                  <TextInput ref={passwordInput} accessibilityLabel="Contraseña, mínimo 8 caracteres" style={styles.input} placeholder="••••••••" placeholderTextColor="#7C8191" secureTextEntry autoComplete="new-password" autoCapitalize="none" autoCorrect={false} value={password} onChangeText={setPassword} returnKeyType="next" onSubmitEditing={() => confirmationInput.current?.focus()} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <TextInput ref={confirmationInput} accessibilityLabel="Confirmar contraseña" style={styles.input} placeholder="••••••••" placeholderTextColor="#7C8191" secureTextEntry autoComplete="new-password" autoCapitalize="none" autoCorrect={false} value={confirmation} onChangeText={setConfirmation} returnKeyType="done" onSubmitEditing={handleRegister} />
                </View>
                {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
                <Pressable accessibilityRole="button" onPress={handleRegister} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
                </Pressable>
                <View style={styles.loginRow}>
                  <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                  <Pressable accessibilityRole="button" onPress={returnToLogin} style={styles.loginLink}>
                    <Text style={styles.linkText}>Inicia sesión</Text>
                  </Pressable>
                </View>
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
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingBottom: 16 },
  wrapper: { width: '100%', maxWidth: 448 },
  back: { minHeight: 52, justifyContent: 'center', alignSelf: 'flex-start', paddingRight: 16 },
  backText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, alignItems: 'center', shadowColor: '#263818', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 8 },
  logo: { width: 144, height: 96, marginBottom: 24 },
  title: { color: '#242B3B', fontSize: 30, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#606A7C', fontSize: 16, textAlign: 'center', marginTop: 8, marginBottom: 32 },
  field: { width: '100%', marginBottom: 20 },
  label: { color: '#424D62', fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: { minHeight: 48, backgroundColor: '#F3F3F5', borderRadius: 9, paddingHorizontal: 14, paddingVertical: 12, color: '#242B3B', fontSize: 15 },
  error: { alignSelf: 'stretch', color: '#B42318', marginBottom: 16, fontSize: 14 },
  button: { width: '100%', minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3CC646', borderRadius: 8, padding: 14 },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  loginRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  loginText: { color: '#606A7C', fontSize: 15 },
  loginLink: { minHeight: 44, justifyContent: 'center' },
  linkText: { color: '#249D31', fontSize: 15, fontWeight: '600' },
});
