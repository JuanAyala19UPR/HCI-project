import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

const AppearanceContext = createContext({ dark: false, setDark: (_value: boolean) => {} });
export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  return <AppearanceContext value={{ dark, setDark }}>{children}</AppearanceContext>;
}
export const useAppearance = () => useContext(AppearanceContext);

// Share the same dark palette across existing screens and their dialogs.
export function useThemedStyles<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(base: T): T {
  const { dark } = useAppearance();
  return useMemo(() => {
    if (!dark) return base;
    return Object.fromEntries(Object.entries(base).map(([key, value]) => {
      const style = { ...StyleSheet.flatten(value) } as ViewStyle & TextStyle;
      if (style.color) style.color = '#FFFFFF';
      if (style.borderColor) style.borderColor = '#3A3A3A';
      if (typeof style.backgroundColor === 'string' && /^#[0-9a-f]{6}$/i.test(style.backgroundColor)) {
        const hex = style.backgroundColor.slice(1);
        const lightness = [0, 2, 4].reduce((sum, offset) => sum + parseInt(hex.slice(offset, offset + 2), 16), 0) / 3;
        if (lightness > 170) style.backgroundColor = '#181818';
      }
      if (/^(screen|header|outer|tabs|bar)$/.test(key)) style.backgroundColor = '#0A0A0A';
      return [key, style];
    })) as T;
  }, [base, dark]);
}
