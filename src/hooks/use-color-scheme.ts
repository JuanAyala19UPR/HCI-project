import { useAppearance } from '@/contexts/appearance-context';

export function useColorScheme() {
  return useAppearance().dark ? 'dark' : 'light';
}
