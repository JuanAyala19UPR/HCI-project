import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundPattern } from '@/components/background-pattern';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { TaskProvider } from '@/contexts/task-context';
import { styles } from '@/styles/app-tabs.styles';

function TabButton({ children, isFocused, icon, ...props }: TabTriggerSlotProps & { icon: AppIconName }) {
  return (
    <Pressable {...props} accessibilityRole="tab" accessibilityState={{ selected: isFocused }} style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      <AppIcon name={icon} color={isFocused ? '#5369FF' : '#788092'} size={23} />
      <Text style={[styles.tabText, isFocused && styles.activeText]}>{children}</Text>
    </Pressable>
  );
}

export default function AppTabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <TaskProvider>
      <View style={styles.outer}>
        <BackgroundPattern />
        <Tabs style={styles.tabs}>
          <TabSlot style={styles.slot} />
          <TabList style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 4) }]}>
            <TabTrigger name="home" href="/(tabs)/home" asChild><TabButton icon="tasks">Tareas</TabButton></TabTrigger>
            <TabTrigger name="agenda" href="/(tabs)/agenda" asChild><TabButton icon="calendar">Agenda</TabButton></TabTrigger>
            <TabTrigger name="payments" href="/(tabs)/payments" asChild><TabButton icon="payments">Pagos</TabButton></TabTrigger>
            <TabTrigger name="household" href="/(tabs)/household" asChild><TabButton icon="household">Hogar</TabButton></TabTrigger>
            <TabTrigger name="settings" href="/(tabs)/settings" asChild><TabButton icon="settings">Ajustes</TabButton></TabTrigger>
          </TabList>
        </Tabs>
      </View>
    </TaskProvider>
  );
}
