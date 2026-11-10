import { useEffect, useMemo } from 'react';
import { router, usePathname, type Href } from 'expo-router';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { useOnboarding } from '@/contexts/onBoardingContext';
import { useAppearance } from '@/contexts/appearance-context';
import { createOnboardingStyles } from '@/styles/onboarding.styles';

const tourSteps: { title: string; description: string; icon: AppIconName; route: Href; pathname: string }[] = [
  { title: '¡Bienvenido a Kassa Roomie!', description: 'Esta es tu aplicación para gestionar tu hogar de manera colaborativa. Te mostraremos las funcionalidades principales.', icon: 'household', route: '/(tabs)/home', pathname: '/home' },
  { title: 'Lista de Tareas', description: 'Aquí puedes crear, editar y gestionar las tareas del hogar. Asigna responsables, fechas y frecuencias de repetición.', icon: 'tasks', route: '/(tabs)/home', pathname: '/home' },
  { title: 'Agenda Semanal', description: 'Visualiza las tareas organizadas por día. Toca un día para consultar sus tareas o selecciona otra semana desde el calendario.', icon: 'calendar', route: '/(tabs)/weekly_schedule', pathname: '/weekly_schedule' },
  { title: 'Pagos y Gastos', description: 'Lleva el control de los gastos compartidos del hogar. Registra pagos y consulta quién debe a quién.', icon: 'payments', route: '/(tabs)/payments', pathname: '/payments' },
  { title: 'Información del Hogar', description: 'Agrega, edita o elimina miembros del hogar. Los correos deben terminar en @upr.edu y los teléfonos iniciar con +1 787.', icon: 'household', route: '/(tabs)/household', pathname: '/household' },
];

export function OnboardingTour() {
  const { isOnboarding, currentStep, totalSteps, nextStep, previousStep, skipOnboarding } = useOnboarding();
  const { dark } = useAppearance();
  const s = useMemo(() => createOnboardingStyles(dark), [dark]);
  const pathname = usePathname();
  const step = tourSteps[currentStep];

  useEffect(() => {
    if (isOnboarding && step && pathname !== step.pathname) router.replace(step.route);
  }, [isOnboarding, step, pathname]);

  if (!isOnboarding || !step) return null;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);
  return <Modal visible transparent animationType="fade" onRequestClose={skipOnboarding}>
    <SafeAreaView style={s.overlay}><View style={s.container}><View style={s.card} accessibilityViewIsModal><ScrollView contentContainerStyle={s.content}>
      <Pressable accessibilityRole="button" accessibilityLabel="Cerrar tutorial" onPress={skipOnboarding} style={s.close}><AppIcon name="close" color={dark ? '#FFFFFF' : '#606A7C'} /></Pressable>
      <View style={s.icon}><AppIcon name={step.icon} size={32} color={dark ? '#FFFFFF' : '#16A34A'} /></View>
      <Text role="heading" accessibilityLiveRegion="polite" style={s.title}>{step.title}</Text>
      <Text style={s.description}>{step.description}</Text>
      <View style={s.progressLabels}><Text style={s.small}>Paso {currentStep + 1} de {totalSteps}</Text><Text style={s.small}>{progress}%</Text></View>
      <View accessibilityRole="progressbar" accessibilityLabel="Progreso del tutorial" accessibilityValue={{ min: 0, max: totalSteps, now: currentStep + 1 }} style={s.track}><View style={[s.fill, { width: `${progress}%` }]} /></View>
      <View style={s.buttons}>
        <Pressable accessibilityRole="button" onPress={skipOnboarding} style={s.secondary}><Text style={s.secondaryText}>Saltar tour</Text></Pressable>
        {currentStep > 0 && <Pressable accessibilityRole="button" onPress={previousStep} style={s.secondary}><AppIcon name="chevronLeft" size={16} color={dark ? '#FFFFFF' : '#424D62'} /><Text style={s.secondaryText}>Anterior</Text></Pressable>}
        <Pressable accessibilityRole="button" onPress={nextStep} style={s.primary}><Text style={s.primaryText}>{currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}</Text>{currentStep < totalSteps - 1 && <AppIcon name="chevronRight" size={16} color="#FFFFFF" />}</Pressable>
      </View>
    </ScrollView></View></View></SafeAreaView>
  </Modal>;
}
