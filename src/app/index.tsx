import { styles } from '@/styles/login.styles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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
              <Pressable accessibilityRole="button" onPress={handleLogin} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </Pressable>
              <View style={styles.signUpRow}>
                <Text style={styles.signUpText}>¿No tienes cuenta? </Text>
                <Pressable accessibilityRole="button" style={styles.linkButton} onPress={() => router.push('/register')}>
                  <Text style={[styles.link, styles.signUpLink]}>Regístrate</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
