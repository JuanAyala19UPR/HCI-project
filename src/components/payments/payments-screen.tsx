import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/app-icon';
const HOUSE_MEMBERS = ['Natalia', 'Alejandro', 'Juan', 'José'];

const categories = { Comida: ['#DCFCE7', '#166534'], Servicios: ['#DBEAFE', '#1D4ED8'], Hogar: ['#F3E8FF', '#7E22CE'], Otro: ['#F3F4F6', '#4B5563'] };
type Category = keyof typeof categories;
type Payment = { id: string; description: string; cents: number; paidBy: string; category: Category; date: string; splitWith: string[] };
const seed: Payment[] = [
  { id: '1', description: 'Supermercado', cents: 15000, paidBy: 'José', category: 'Comida', date: '15 Abr', splitWith: ['Juan', 'Alejandro'] },
  { id: '2', description: 'Luz y agua', cents: 8550, paidBy: 'Natalia', category: 'Servicios', date: '14 Abr', splitWith: ['José', 'Alejandro'] },
  { id: '3', description: 'Internet', cents: 5000, paidBy: 'Juan', category: 'Servicios', date: '12 Abr', splitWith: ['Alejandro', 'Natalia'] },
  { id: '4', description: 'Limpieza', cents: 3000, paidBy: 'Alejandro', category: 'Hogar', date: '10 Abr', splitWith: ['José', 'Juan'] },
];
const blank = { description: '', amount: '', paidBy: '', category: '' as Category | '' };
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
// Distribute leftover cents in household order to preserve the exact total.
function share(payment: Payment, name: string) {
  const participants = [payment.paidBy, ...payment.splitWith];
  const index = participants.indexOf(name);
  return index < 0 ? 0 : Math.floor(payment.cents / participants.length) + (index < payment.cents % participants.length ? 1 : 0);
}
function getBalances(payments: Payment[]) {
  const net = HOUSE_MEMBERS.map(name => ({ name, cents: payments.reduce((sum, p) => sum + (p.paidBy === name ? p.cents : 0) - share(p, name), 0) }));
  const transfers: { from: string; to: string; cents: number }[] = [];
  for (const debtor of net.filter(p => p.cents < 0)) for (const creditor of net.filter(p => p.cents > 0)) {
    const cents = Math.min(-debtor.cents, creditor.cents);
    if (cents > 0) { transfers.push({ from: debtor.name, to: creditor.name, cents }); debtor.cents += cents; creditor.cents -= cents; }
  }
  return transfers;
}
function Badge({ category }: { category: Category }) {
  return <Text style={[s.badge, { backgroundColor: categories[category][0], color: categories[category][1] }]}>{category}</Text>;
}

export function PaymentsScreen() {
  const [payments, setPayments] = useState(seed);
  const [dialog, setDialog] = useState<'add' | 'help' | null>(null);
  const [draft, setDraft] = useState(blank);
  const [error, setError] = useState('');
  const total = payments.reduce((sum, p) => sum + p.cents, 0);
  const myShare = total / HOUSE_MEMBERS.length;
  const balances = getBalances(payments);
  const close = () => { setDialog(null); setDraft(blank); setError(''); };
  function add() {
    if (!draft.description.trim() || !draft.amount.trim() || !draft.paidBy || !draft.category) { setError('Por favor completa todos los campos obligatorios.'); return; }
    const value = draft.amount.trim().replace(',', '.');
    const cents = Math.round(Number(value) * 100);
    if (!/^\d+(\.\d{1,2})?$/.test(value) || !Number.isSafeInteger(cents) || cents <= 0) { setError('Ingresa un monto mayor a $0.00 con un máximo de dos decimales.'); return; }
    const payment: Payment = { id: String(Date.now()), description: draft.description.trim(), cents, paidBy: draft.paidBy, category: draft.category, date: 'Nuevo', splitWith: HOUSE_MEMBERS.filter(name => name !== draft.paidBy) };
    setPayments(current => [payment, ...current]); close();
  }
  return <View style={s.screen}>
    <ScrollView contentContainerStyle={s.content}>
      <SafeAreaView edges={['top', 'left', 'right']} style={s.header}>
        <View style={s.row}><Text role="heading" style={s.title}>Pagos Compartidos</Text><Pressable accessibilityRole="button" accessibilityLabel="Ayuda sobre pagos compartidos" style={s.icon} onPress={() => setDialog('help')}><Text style={s.help}>?</Text></Pressable></View>
        <Text style={s.headerNote}>Mes actual: Abril 2026</Text>
        <View style={s.row}>{[['Total Gastado', total], ['Tu Parte', myShare]].map(([label, amount]) => <View key={label} style={s.summary}><Text style={s.white}>{label} ⓘ</Text><Text style={s.amount}>{money(Number(amount))}</Text><Text style={s.summaryNote}>Este mes</Text></View>)}</View>
      </SafeAreaView>
      <View style={s.card}><Text style={s.label}>Categorías disponibles</Text><View style={s.wrap}>{(Object.keys(categories) as Category[]).map(c => <Badge key={c} category={c} />)}</View></View>
      <View style={s.section}><Text role="heading" style={s.heading}>Últimos Pagos</Text><Pressable accessibilityRole="button" style={s.button} onPress={() => setDialog('add')}><AppIcon name="plus" color="#FFFFFF" size={18} /><Text style={s.buttonText}>Agregar</Text></Pressable></View>
      {payments.map(p => <View key={p.id} style={s.card}><View style={s.paymentRow}><View style={s.details}><View style={s.wrap}><Text style={s.paymentTitle}>{p.description}</Text><Badge category={p.category} /></View><Text style={s.muted}>Pagado por {p.paidBy} · {p.date}</Text></View><View style={s.price}><Text style={s.priceText}>{money(p.cents)}</Text><Text style={s.small}>{money(p.cents / (p.splitWith.length + 1))} por persona</Text></View></View><Text style={s.small}>Dividido con: {p.splitWith.join(', ')}</Text></View>)}
      <View style={s.card}><Text role="heading" style={s.heading}>Balance</Text>{balances.map(b => <View key={`${b.from}-${b.to}`} style={s.balanceRow}><Text style={s.balanceName}>{b.from} debe a {b.to}</Text><Text style={s.debt}>{money(b.cents)}</Text></View>)}{!balances.length && <Text style={s.muted}>Todos están al día.</Text>}</View>
    </ScrollView>
    <Modal visible={dialog !== null} transparent animationType="fade" onRequestClose={close}>
      <SafeAreaView style={s.overlay}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalArea}><View style={s.modal} accessibilityViewIsModal><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.modalContent}>
        <View style={s.row}><Text role="heading" style={s.modalTitle}>{dialog === 'add' ? 'Nuevo Pago' : '¿Cómo funcionan los pagos compartidos?'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar" style={s.icon} onPress={close}><AppIcon name="close" /></Pressable></View>
        {dialog === 'add' ? <>
          <Text style={s.muted}>Registra un gasto compartido para Abril 2026.</Text>
          <Text style={s.fieldLabel}>Descripción *</Text><TextInput accessibilityLabel="Descripción obligatoria" style={s.input} placeholder="Ej: Supermercado" placeholderTextColor="#788092" value={draft.description} maxLength={120} onChangeText={description => setDraft(current => ({ ...current, description }))} />
          <Text style={s.fieldLabel}>Monto *</Text><TextInput accessibilityLabel="Monto obligatorio" style={s.input} placeholder="0.00" placeholderTextColor="#788092" keyboardType="decimal-pad" value={draft.amount} maxLength={12} onChangeText={amount => setDraft(current => ({ ...current, amount }))} /><Text style={s.small}>El monto debe ser mayor a $0.00</Text>
          <Text style={s.fieldLabel}>Pagado por *</Text><View style={s.wrap}>{HOUSE_MEMBERS.map(person => <Pressable key={person} accessibilityRole="radio" accessibilityState={{ checked: draft.paidBy === person }} style={[s.option, draft.paidBy === person && s.selected]} onPress={() => setDraft(current => ({ ...current, paidBy: person }))}><Text style={s.optionText}>{person}</Text></Pressable>)}</View>
          <Text style={s.fieldLabel}>Categoría *</Text><View style={s.wrap}>{(Object.keys(categories) as Category[]).map(category => <Pressable key={category} accessibilityRole="radio" accessibilityState={{ checked: draft.category === category }} style={[s.option, draft.category === category && s.selected]} onPress={() => setDraft(current => ({ ...current, category }))}><Badge category={category} /></Pressable>)}</View>
          {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
          <Pressable accessibilityRole="button" style={[s.button, s.submit]} onPress={add}><Text style={s.buttonText}>Agregar Pago</Text></Pressable>
        </> : <>
          <Text style={s.fieldLabel}>Total Gastado</Text><Text style={s.paragraph}>Es la suma de los gastos registrados en el mes de muestra, Abril 2026.</Text>
          <Text style={s.fieldLabel}>Tu Parte</Text><Text style={s.paragraph}>Es una referencia del total gastado dividido entre los {HOUSE_MEMBERS.length} miembros del hogar. El balance usa los participantes de cada pago para calcular las deudas reales.</Text>
          <Text style={s.fieldLabel}>División por pago</Text><Text style={s.paragraph}>Cada pago se divide entre quien pagó y las personas indicadas en «Dividido con». Los nuevos pagos incluyen a todos los miembros. Los centavos sobrantes se asignan en el orden de los participantes.</Text>
          <Text style={s.fieldLabel}>Balance</Text><Text style={s.paragraph}>Se resta la parte de cada persona de lo que pagó y se calculan las transferencias necesarias para saldar las deudas.</Text>
          <Pressable accessibilityRole="button" style={[s.button, s.submit]} onPress={close}><Text style={s.buttonText}>Entendido</Text></Pressable>
        </>}
      </ScrollView></View></KeyboardAvoidingView></SafeAreaView>
    </Modal>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, content: { paddingBottom: 24 },
  header: { backgroundColor: '#819D34', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 30, fontWeight: '700', color: '#FFFFFF', flexShrink: 1 },
  icon: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  help: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', borderWidth: 1, borderColor: '#FFFFFF', borderRadius: 7, width: 14, height: 14, lineHeight: 12, textAlign: 'center' },
  headerNote: { fontSize: 13, color: '#FFFFFF', marginVertical: 12 },
  summary: { flex: 1, borderRadius: 14, padding: 16, backgroundColor: '#FFFFFF25', gap: 6, minHeight: 108 },
  summaryNote: { color: '#FFFFFF', fontSize: 12 },
  white: { color: '#FFFFFF', fontSize: 13 }, amount: { color: '#FFFFFF', fontSize: 25, fontWeight: '700' },
  card: { marginHorizontal: 16, marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#424D62', marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  badge: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3, fontSize: 11, fontWeight: '500', overflow: 'hidden' },
  section: { marginHorizontal: 16, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  heading: { fontSize: 18, fontWeight: '600', color: '#424D62' },
  button: { minHeight: 44, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FF7100', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  paymentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  details: { flexGrow: 1, flexShrink: 1, flexBasis: 155, gap: 6 },
  paymentTitle: { fontSize: 18, fontWeight: '500', color: '#1F2937' },
  muted: { fontSize: 13, color: '#606A7C', lineHeight: 20 }, small: { fontSize: 12, color: '#606A7C', lineHeight: 19 },
  price: { alignItems: 'flex-end' }, priceText: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  balanceRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 14 },
  balanceName: { flex: 1, color: '#606A7C', fontSize: 14 }, debt: { fontWeight: '600', fontSize: 14, color: '#B91C1C' },
  overlay: { flex: 1, backgroundColor: '#17211ECC' }, modalArea: { flex: 1, padding: 20, justifyContent: 'center' },
  modal: { maxWidth: 448, width: '100%', maxHeight: '100%', alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden' },
  modalContent: { padding: 20 }, modalTitle: { fontSize: 22, fontWeight: '700', color: '#242B3B', flex: 1 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#424D62', marginTop: 20, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#CBD0D8', borderRadius: 9, minHeight: 48, padding: 12, fontSize: 16, color: '#242B3B', marginBottom: 4 },
  option: { minHeight: 44, borderWidth: 1, borderColor: '#CBD0D8', borderRadius: 9, padding: 8, justifyContent: 'center' },
  selected: { borderColor: '#6B8E23', backgroundColor: '#EAF1DF', borderWidth: 2, padding: 7 },
  optionText: { fontSize: 14, color: '#424D62' }, submit: { marginTop: 24 },
  paragraph: { color: '#606A7C', fontSize: 14, lineHeight: 22 }, error: { marginTop: 16, color: '#B91C1C', fontSize: 14, lineHeight: 20 },
});
