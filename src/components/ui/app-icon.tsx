import { Image } from 'expo-image';

const paths = {
  tasks: '<path d="m3 6 1.5 1.5L7 5M10 6h11M3 12h4m3 0h11m-18 6 1.5 1.5L7 17m3 1h11"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>',
  payments: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  household: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3M17 3a4 4 0 0 1 0 8m2 3a5 5 0 0 1 3 4v3"/>',
  settings: '<path d="m10 2-.7 3-2 .9-2.8-.9-2 3.5L4.7 11v2l-2.2 2.5 2 3.5 2.8-.9 2 .9.7 3h4l.7-3 2-.9 2.8.9 2-3.5-2.2-2.5v-2l2.2-2.5-2-3.5-2.8.9-2-.9L14 2Z"/><circle cx="12" cy="12" r="3"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M5 22v-3a7 7 0 0 1 14 0v3"/>',
  edit: '<path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7M16 3l5 5-10 10-5 1 1-5Z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
} as const;

export type AppIconName = keyof typeof paths;

export function AppIcon({ name, color = '#788092', size = 22 }: { name: AppIconName; color?: string; size?: number }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  return <Image source={{ uri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }} style={{ width: size, height: size }} accessibilityElementsHidden importantForAccessibility="no" />;
}
