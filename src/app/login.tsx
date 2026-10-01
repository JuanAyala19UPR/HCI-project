import { Image } from "expo-image";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GREEN_BACKGROUND = "#7C9473";
const PATTERN_ROWS = 8;
const PATTERN_COLS = 6;

function BackgroundPattern() {
  const rows = Array.from({ length: PATTERN_ROWS });
  const cols = Array.from({ length: PATTERN_COLS });

  return (
    <View style={styles.pattern} pointerEvents="none">
      {rows.map((_, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.patternRow,
            rowIndex % 2 === 1 && styles.patternRowOffset,
          ]}
        >
          {cols.map((_, colIndex) => (
            <Text key={colIndex} style={styles.patternIcon}>
              🛡
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <BackgroundPattern />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="cover"
          />

          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Gestiona tu hogar fácilmente</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable style={styles.forgotPasswordWrapper}>
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </Pressable>

          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>¿No tienes cuenta? </Text>
            <Pressable>
              <Text style={styles.signUpLink}>Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_BACKGROUND,
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-evenly",
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  patternRowOffset: {
    marginLeft: 24,
  },
  patternIcon: {
    fontSize: 22,
    color: "#000000",
    opacity: 0.08,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: 128,
    height: 80,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 24,
  },
  field: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  forgotPasswordWrapper: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#5B7FE0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  signUpRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: "#374151",
  },
  signUpLink: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "700",
  },
});
