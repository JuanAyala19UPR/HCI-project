import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';

const tile = { uri: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><g id="paw" fill="#263818"><ellipse cx="15" cy="21" rx="10" ry="9"/><ellipse cx="3" cy="12" rx="4" ry="5"/><ellipse cx="10" cy="5" rx="4" ry="5"/><ellipse cx="20" cy="5" rx="4" ry="5"/><ellipse cx="27" cy="12" rx="4" ry="5"/></g></defs><use href="#paw" transform="rotate(-15 15 15)"/><use href="#paw" transform="translate(40 40) rotate(25 15 15) scale(.7)"/></svg>`)}` };

export const BackgroundPattern = memo(function BackgroundPattern() {
  const { width, height } = useWindowDimensions();
  const dark = useColorScheme() === 'dark';
  const columns = Math.ceil(width / 100);
  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.background}>
      <LinearGradient colors={dark ? ['#2a3a1f', '#1f2d15', '#151f0b'] : ['#9caf88', '#87a96b', '#6b8e23']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.tiles, { width: columns * 100, opacity: dark ? 0.3 : 0.12 }]}>
        {Array.from({ length: columns * Math.ceil(height / 100) }, (_, index) => <Image key={index} source={tile} style={styles.tile} contentFit="contain" />)}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  tiles: { flexDirection: 'row', flexWrap: 'wrap' },
  tile: { width: 100, height: 100 },
});

