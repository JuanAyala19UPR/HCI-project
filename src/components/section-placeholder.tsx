import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { styles } from '@/styles/app-tabs.styles';

export function SectionPlaceholder({ title, icon }: { title: string; icon: AppIconName }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.placeholder}>
      <AppIcon name={icon} size={40} color="#7E9B30" />
      <Text role="heading" style={styles.title}>{title}</Text>
      <Text style={styles.description}>Esta sección estará disponible próximamente.</Text>
    </SafeAreaView>
  );
}
