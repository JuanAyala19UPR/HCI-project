import { useAppearance, useThemedStyles } from '@/contexts/appearance-context';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/app-icon';
import { styles as baseStyles } from '@/styles/household.styles';

type Member = { id: string; name: string; email: string; phone: string; admin: boolean; color: string };
const initialMembers: Member[] = [
  { id: '1', name: 'Natalia Solórzano', email: 'natalia.solorzano@upr.edu', phone: '+1 787 555 1234', admin: true, color: '#EC329B' },
  { id: '2', name: 'Alejandro Behar', email: 'alejandro.behar@upr.edu', phone: '+1 787 123 4567', admin: false, color: '#36C74B' },
  { id: '3', name: 'Juan Ayala', email: 'juan.ayala@upr.edu', phone: '+1 787 987 6543', admin: false, color: '#5279FF' },
  { id: '4', name: 'José Rivera', email: 'jose.rivera@upr.edu', phone: '+1 787 456 7890', admin: false, color: '#F12940' },
];
const blank = { name: '', email: '', phone: '+1 787' };
const stats = [
  { value: '12', label: 'Tareas Completadas', background: '#EFF6FF', color: '#5369FF' },
  { value: '8', label: 'Días Activos', background: '#F0FDF4', color: '#16A34A' },
  { value: '$315', label: 'Total Gastado', background: '#FFF7ED', color: '#EA580C' },
  { value: '15', label: 'Eventos Semana', background: '#FAF5FF', color: '#9333EA' },
];
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] ?? '')).toUpperCase();
}

export function HouseholdScreen() {
  const s = useThemedStyles(baseStyles);
  const { dark } = useAppearance();
  const [members, setMembers] = useState(initialMembers);
  const [dialog, setDialog] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [draft, setDraft] = useState(blank);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const close = () => { setDialog(null); setSelected(null); setDraft(blank); setError(''); };
  async function copyCode() {
    try {
      const copied = await Clipboard.setStringAsync('ABC123');
      setCopyStatus(copied ? 'Código copiado' : 'No se pudo copiar. Mantén presionado el código para copiarlo.');
    } catch { setCopyStatus('No se pudo copiar. Mantén presionado el código para copiarlo.'); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyStatus(''), 3000);
  }
  function save() {
    const name = draft.name.trim();
    const email = draft.email.trim().toLowerCase();
    const digits = draft.phone.replace(/\D/g, '');
    if (!name) { setError('Ingresa el nombre completo.'); return; }
    if (!/^[^\s@]+@upr\.edu$/.test(email)) { setError('El correo debe terminar en @upr.edu.'); return; }
    if (!/^1787\d{7}$/.test(digits) || !draft.phone.trim().startsWith('+1')) { setError('El teléfono debe iniciar con +1 787 y tener 11 dígitos.'); return; }
    if (members.some(m => m.email === email && m.id !== selected?.id)) { setError('Ya existe un miembro con este correo.'); return; }
    const fields = { name, email, phone: `+1 787 ${digits.slice(4, 7)} ${digits.slice(7)}` };
    setMembers(current => dialog === 'edit' && selected
      ? current.map(m => m.id === selected.id ? { ...m, ...fields } : m)
      : [...current, { ...fields, id: `${Date.now()}`, admin: false, color: ['#5279FF', '#36C74B', '#9333EA', '#EC329B'][current.length % 4] }]);
    close();
  }
  return <View style={s.screen}>
    <ScrollView contentContainerStyle={s.content}>
      <SafeAreaView edges={['top', 'left', 'right']} style={s.header}><View style={s.headerRow}><View style={s.homeIcon}><AppIcon name="home" size={30} color="#FFFFFF" /></View><View style={s.flex}><Text role="heading" style={s.title}>Kassa Roomie</Text><Text style={s.memberCount}>{members.length} miembros</Text></View></View></SafeAreaView>
      <View style={s.body}>
        <View style={s.card}><Text style={s.cardTitle}>Código de Invitación</Text><Text style={s.description}>Comparte este código con tus familiares para que se unan</Text>
          <View style={s.codeRow}><View style={s.codeBox}><Text selectable style={s.code}>ABC123</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Copiar código de invitación" style={s.copyButton} onPress={copyCode}><AppIcon name={copyStatus === 'Código copiado' ? 'check' : 'copy'} size={20} color="#374151" /></Pressable></View>
          {!!copyStatus && <Text accessibilityLiveRegion="polite" style={s.feedback}>{copyStatus}</Text>}
          <View style={s.info}><Text style={s.infoTitle}>📌 Información importante:</Text><Text style={s.infoText}>•  El código no expira y puede usarse múltiples veces</Text><Text style={s.infoText}>•  Solo administradores pueden regenerar el código</Text><Text style={s.infoText}>•  Cualquier persona con el código puede unirse al hogar</Text></View>
          <Pressable accessibilityRole="button" style={s.primary} onPress={() => setDialog('add')}><AppIcon name="plus" size={18} color="#FFFFFF" /><Text style={s.primaryText}>Agregar Miembro</Text></Pressable>
        </View>
        <Text role="heading" style={s.sectionTitle}>Miembros del Hogar</Text>
        {members.map(member => <View key={member.id} style={[s.card, s.memberCard]}><View style={[s.avatar, { backgroundColor: member.color }]}><Text style={s.initials}>{initials(member.name)}</Text></View><View style={s.flex}><View style={s.nameRow}><Text style={s.name}>{member.name}</Text>{member.admin && <View style={s.adminBadge}><AppIcon name="crown" size={12} color="#A16207" /><Text style={s.adminText}>Admin</Text></View>}</View><View style={s.contact}><AppIcon name="mail" size={15} /><Text selectable style={s.contactText}>{member.email}</Text></View><View style={s.contact}><AppIcon name="phone" size={15} /><Text selectable style={s.contactText}>{member.phone}</Text></View></View><View><Pressable accessibilityRole="button" accessibilityLabel={`Editar a ${member.name}`} style={s.action} onPress={() => { setSelected(member); setDraft({ name: member.name, email: member.email, phone: member.phone }); setDialog('edit'); }}><AppIcon name="edit" size={20} color="#5369FF" /></Pressable>{!member.admin && <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar a ${member.name}`} style={s.action} onPress={() => { setSelected(member); setDialog('delete'); }}><AppIcon name="trash" size={20} color="#FF334B" /></Pressable>}</View></View>)}
        <View style={s.card}><Text role="heading" style={s.cardTitle}>Estadísticas del Hogar</Text><View style={s.stats}>{stats.map(stat => <View key={stat.label} style={[s.stat, { backgroundColor: dark ? '#202020' : stat.background }]}><Text style={[s.statValue, { color: dark ? '#FFFFFF' : stat.color }]}>{stat.value}</Text><Text style={s.statLabel}>{stat.label}</Text></View>)}</View></View>
      </View>
    </ScrollView>
    <Modal visible={dialog !== null} transparent animationType="fade" onRequestClose={close}><SafeAreaView style={s.overlay}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalArea}><View style={s.modal} accessibilityViewIsModal><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.modalContent}>
      <View style={s.modalHeader}><Text role="heading" style={s.modalTitle}>{dialog === 'delete' ? 'Eliminar Miembro' : dialog === 'edit' ? 'Editar Miembro' : 'Agregar Nuevo Miembro'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar" style={s.action} onPress={close}><AppIcon name="close" /></Pressable></View>
      {dialog === 'delete' ? <Text style={s.description}>¿Quieres eliminar a {selected?.name} del hogar? Esta acción no se puede deshacer.</Text> : <>
        <Text style={s.description}>{dialog === 'edit' ? 'Actualiza la información del miembro' : 'Ingresa los datos del nuevo miembro del hogar'}</Text>
        <Text style={s.fieldLabel}>Nombre completo *</Text><TextInput accessibilityLabel="Nombre completo obligatorio" style={s.input} placeholder="Ej: Carlos Rodríguez" placeholderTextColor="#788092" value={draft.name} maxLength={100} onChangeText={name => setDraft(current => ({ ...current, name }))} />
        <Text style={s.fieldLabel}>Correo electrónico *</Text><TextInput accessibilityLabel="Correo electrónico obligatorio" style={s.input} placeholder="nombre.apellido@upr.edu" placeholderTextColor="#788092" value={draft.email} maxLength={150} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onChangeText={email => setDraft(current => ({ ...current, email }))} /><Text style={s.hint}>Debe terminar en @upr.edu</Text>
        <Text style={s.fieldLabel}>Teléfono *</Text><TextInput accessibilityLabel="Teléfono obligatorio" style={s.input} placeholder="+1 787 123 4567" placeholderTextColor="#788092" value={draft.phone} maxLength={25} keyboardType="phone-pad" onChangeText={phone => setDraft(current => ({ ...current, phone }))} /><Text style={s.hint}>Debe iniciar con +1 787</Text>
        {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      </>}
      <View style={s.footer}><Pressable accessibilityRole="button" style={s.cancel} onPress={close}><Text style={s.cancelText}>Cancelar</Text></Pressable><Pressable accessibilityRole="button" style={[s.primary, s.confirm, dialog === 'delete' && s.danger]} onPress={dialog === 'delete' ? () => { if (selected && !selected.admin) setMembers(current => current.filter(m => m.id !== selected.id)); close(); } : save}><Text style={s.primaryText}>{dialog === 'delete' ? 'Eliminar' : dialog === 'edit' ? 'Guardar' : 'Agregar'}</Text></Pressable></View>
    </ScrollView></View></KeyboardAvoidingView></SafeAreaView></Modal>
  </View>;
}
