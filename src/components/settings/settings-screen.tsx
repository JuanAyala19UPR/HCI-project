import { createSettingsStyles } from '@/styles/settings.styles';
import { useMemo, useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { useAppearance } from '@/contexts/appearance-context';
import { useOnboarding } from '@/contexts/onBoardingContext';

type Dialog = 'profile' | 'personal' | 'password' | 'language' | 'help' | 'logout';
const initialProfile = { name: 'Natalia Solórzano', email: 'natalia.solorzano@upr.edu', phone: '+1 787 555 1234', address: 'San Juan, Puerto Rico' };
const titles: Record<Dialog, string> = { profile: 'Editar Perfil', personal: 'Información Personal', password: 'Cambiar Contraseña', language: 'Idioma', help: 'Centro de Ayuda', logout: 'Cerrar Sesión' };

export function SettingsScreen() {
  const { startOnboarding } = useOnboarding();
  const { dark, setDark } = useAppearance();
  const s = useMemo(() => createSettingsStyles(dark), [dark]);
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(profile);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [error, setError] = useState('');
  const close = () => { setDialog(null); setError(''); };
  function open(value: Dialog) { setDraft(profile); setError(''); setDialog(value); }
  function save() {
    if (!draft.name.trim() || !/^[^\s@]+@upr\.edu$/i.test(draft.email.trim())) { setError('Ingresa un nombre y un correo válido de @upr.edu.'); return; }
    if (dialog === 'personal' && !/^1787\d{7}$/.test(draft.phone.replace(/\D/g, ''))) { setError('Ingresa un teléfono válido con prefijo +1 787.'); return; }
    setProfile({ ...draft, name: draft.name.trim(), email: draft.email.trim().toLowerCase() }); close();
  }
  function card(title: string, children: ReactNode, description?: string) {
    return <View style={s.card}><Text role="heading" style={s.cardTitle}>{title}</Text>{description && <Text style={s.description}>{description}</Text>}{children}</View>;
  }
  function row(icon: AppIconName, label: string, onPress: () => void, subtitle?: string) {
    return <Pressable accessibilityRole="button" style={s.row} onPress={onPress}><AppIcon name={icon} color={dark ? '#FFFFFF' : '#606A7C'} size={20} /><View style={s.flex}><Text style={s.rowText}>{label}</Text>{subtitle && <Text style={s.small}>{subtitle}</Text>}</View><AppIcon name="chevronRight" color={dark ? '#E5E7EB' : '#788092'} size={18} /></Pressable>;
  }
  function toggle(icon: AppIconName, label: string, subtitle: string, value: boolean, change: (value: boolean) => void, disabled = false) {
    return <View style={[s.row, disabled && s.disabled]}><AppIcon name={icon} color={dark ? '#FFFFFF' : '#606A7C'} size={20} /><View style={s.flex}><Text style={s.rowText}>{label}</Text><Text style={s.small}>{subtitle}</Text></View><Switch accessibilityLabel={label} value={value} onValueChange={change} disabled={disabled} trackColor={{ false: '#CBCDD3', true: dark ? '#657AFF' : '#09091B' }} thumbColor="#FFFFFF" /></View>;
  }
  return <View style={s.screen}><ScrollView contentContainerStyle={s.content}>
    <SafeAreaView edges={['top', 'left', 'right']} style={s.header}><Text role="heading" style={s.title}>Configuración</Text></SafeAreaView>
    <View style={s.body}>
      <View style={[s.card, s.profile]}><View style={s.avatar}><Text style={s.avatarText}>{profile.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}</Text></View><View style={s.flex}><Text style={s.profileName}>{profile.name}</Text><Text style={s.small}>{profile.email}</Text></View><Pressable accessibilityRole="button" style={s.edit} onPress={() => open('profile')}><Text style={s.editText}>Editar</Text></Pressable></View>
      {card('Cuenta', <>{row('user', 'Información Personal', () => open('personal'))}{row('lock', 'Cambiar Contraseña', () => open('password'))}</>)}
      {card('Notificaciones', <>{toggle('bell', 'Notificaciones', 'Activar todas las notificaciones', notifications, setNotifications)}<View style={s.separator} />{toggle('mail', 'Email', 'Recibir notificaciones por correo', email, setEmail, !notifications)}{toggle('smartphone', 'Push', 'Notificaciones en el dispositivo', push, setPush, !notifications)}</>, 'Gestiona cómo quieres recibir las notificaciones')}
      {card('Preferencias', <>{toggle('moon', 'Modo Oscuro', 'Apariencia oscura de la app', dark, setDark)}<View style={s.separator} />{row('globe', 'Idioma', () => open('language'), 'Español')}</>)}
      {card('Soporte', <>{row('book', 'Ver tutorial de nuevo', () => { close(); startOnboarding(); })}{row('help', 'Centro de Ayuda', () => open('help'))}</>)}
      <Pressable accessibilityRole="button" style={s.logout} onPress={() => open('logout')}><AppIcon name="logout" size={18} color="#F43F5E" /><Text style={s.logoutText}>Cerrar Sesión</Text></Pressable>
      <Text style={s.version}>Versión 1.0.0</Text>
    </View>
  </ScrollView>
    <Modal visible={dialog !== null} transparent animationType="fade" onRequestClose={close}><SafeAreaView style={s.overlay}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalArea}><View style={[s.modal, dialog === 'help' && s.helpModal]} accessibilityViewIsModal><ScrollView style={s.modalScroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.modalContent}>
      <View style={s.modalHeader}><Text role="heading" style={s.modalTitle}>{dialog && titles[dialog]}</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar" style={s.iconButton} onPress={close}><AppIcon name="close" color={dark ? '#FFFFFF' : '#606A7C'} /></Pressable></View>
      {(dialog === 'profile' || dialog === 'personal') && <>
        {(['name', 'email', ...(dialog === 'personal' ? ['phone', 'address'] : [])] as (keyof typeof profile)[]).map(field => {
          const label = { name: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', address: 'Dirección' }[field];
          return <View key={field}><Text style={s.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} style={s.input} value={draft[field]} onChangeText={value => setDraft(current => ({ ...current, [field]: value }))} autoCapitalize={field === 'email' ? 'none' : 'sentences'} keyboardType={field === 'email' ? 'email-address' : field === 'phone' ? 'phone-pad' : 'default'} maxLength={150} /></View>;
        })}
        {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}<Pressable accessibilityRole="button" style={s.primary} onPress={save}><Text style={s.primaryText}>Guardar</Text></Pressable>
      </>}
      {dialog === 'password' && <Text style={s.paragraph}>El cambio de contraseña estará disponible cuando se conecte el servicio de cuentas. Esta versión de demostración no guarda contraseñas.</Text>}
      {dialog === 'language' && <><Text style={s.paragraph}>Idioma disponible</Text><View style={s.row}><Text style={s.rowText}>Español</Text><AppIcon name="check" color={dark ? '#FFFFFF' : '#427222'} /></View></>}
      {dialog === 'help' && <>
        <Text style={s.paragraph}>Kassa Roomie te ayuda a organizar las responsabilidades y los gastos de tu hogar. Desliza hacia arriba para consultar todas las secciones.</Text>
        <Text role="heading" style={s.fieldLabel}>Tareas del hogar</Text>
        <Text style={s.paragraph}>Agrega una tarea, escribe su descripción y selecciona una persona responsable. Establece la fecha y, si corresponde, la frecuencia de repetición. Puedes editarla, marcarla como completada o eliminarla.</Text>
        <Text role="heading" style={s.fieldLabel}>Agenda semanal</Text>
        <Text style={s.paragraph}>Consulta las tareas por semana. Usa las flechas para cambiar de semana o abre el calendario para seleccionar una fecha. Toca un día para filtrar sus tareas y una tarea para ver sus detalles.</Text>
        <Text role="heading" style={s.fieldLabel}>Pagos y gastos compartidos</Text>
        <Text style={s.paragraph}>Pulsa Agregar para registrar la descripción, el monto, quién pagó y la categoría. Cada tarjeta indica las personas que comparten el gasto. El balance muestra las transferencias necesarias para saldar las deudas. El botón de ayuda de Pagos explica los cálculos.</Text>
        <Text role="heading" style={s.fieldLabel}>Miembros e invitaciones</Text>
        <Text style={s.paragraph}>En Hogar puedes copiar el código de invitación y agregar o editar los datos de los miembros. Usa un correo de @upr.edu y un teléfono con prefijo +1 787. Para eliminar un miembro debes confirmar la acción; el administrador no se puede eliminar.</Text>
        <Text role="heading" style={s.fieldLabel}>Perfil y preferencias</Text>
        <Text style={s.paragraph}>En Configuración puedes editar tu perfil e información personal. Activa Modo Oscuro para usar un fondo negro con letras blancas. Puedes activar o desactivar las preferencias de notificaciones; esta versión de demostración aún no envía avisos ni permite cambiar contraseñas.</Text>
        <Text role="heading" style={s.fieldLabel}>Ver el tutorial otra vez</Text>
        <Text style={s.paragraph}>Cierra esta ventana y selecciona Ver tutorial de nuevo en la sección Soporte. Usa Siguiente y Anterior para recorrer las pantallas, o Saltar tour para salir.</Text>
        <Text role="heading" style={s.fieldLabel}>Consejos y datos guardados</Text>
        <Text style={s.paragraph}>Revisa las tareas y los balances con frecuencia. Los cambios del perfil, los miembros, los pagos y las preferencias se mantienen durante la sesión y pueden restablecerse al recargar. La finalización del tutorial se guarda en el dispositivo.</Text>
        <Pressable accessibilityRole="button" style={s.primary} onPress={close}><Text style={s.primaryText}>Cerrar Centro de Ayuda</Text></Pressable>
      </>}
      {dialog === 'logout' && <><Text style={s.paragraph}>¿Quieres salir y volver a la pantalla de inicio?</Text><View style={s.footer}><Pressable accessibilityRole="button" style={s.edit} onPress={close}><Text style={s.editText}>Cancelar</Text></Pressable><Pressable accessibilityRole="button" style={s.primary} onPress={() => { close(); router.replace('/'); }}><Text style={s.primaryText}>Cerrar Sesión</Text></Pressable></View></>}
    </ScrollView></View></KeyboardAvoidingView></SafeAreaView></Modal></View>;
}
