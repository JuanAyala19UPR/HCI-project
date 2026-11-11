import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AppearanceProvider, useAppearance } from '@/contexts/appearance-context';
import { OnboardingProvider } from '@/contexts/onBoardingContext';

import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <AppearanceProvider><OnboardingProvider><RootNavigator /></OnboardingProvider></AppearanceProvider>;
}

function RootNavigator() {
  const { dark } = useAppearance();
  return (
    <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
