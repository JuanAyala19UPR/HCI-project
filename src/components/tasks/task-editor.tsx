import { useThemedStyles } from '@/contexts/appearance-context';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/app-icon';
import { styles as baseStyles } from '@/styles/tasks.styles';
import { dateInputValue, emptyTask, HOUSE_MEMBERS, parseDateInput, REPEAT_OPTIONS, validateTask, type Task, type TaskDraft } from '@/utils/tasks';

type Props = { task: Task | null; onSave: (draft: TaskDraft, id?: string) => void; onClose: () => void };

export function TaskEditor({ task, onSave, onClose }: Props) {
  const styles = useThemedStyles(baseStyles);
  const [draft, setDraft] = useState<TaskDraft>(() => task ? {
    text: task.text, assignedTo: task.assignedTo, dueDate: task.dueDate,
    repeatInterval: task.repeatInterval, repeatUntil: task.repeatUntil, notes: task.notes,
  } : emptyTask());
  const [dueInput, setDueInput] = useState(dateInputValue(draft.dueDate));
  const [untilInput, setUntilInput] = useState(dateInputValue(draft.repeatUntil));
  const [errors, setErrors] = useState<ReturnType<typeof validateTask>>({});
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    setDirty(true);
  }
  function requestClose() {
    if (dirty) setConfirmClose(true);
    else onClose();
  }
  function save() {
    const validation = validateTask(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    onSave(draft, task?.id);
    onClose();
  }
  function fieldError(key: keyof TaskDraft) {
    return errors[key] ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{errors[key]}</Text> : null;
  }

  return (
    <Modal transparent visible animationType="fade" onRequestClose={requestClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            {confirmClose ? (
              <View style={styles.modalContent}>
                <Text role="heading" style={styles.modalTitle}>¿Descartar cambios?</Text>
                <Text style={styles.description}>Los cambios que no hayas guardado se perderán.</Text>
                <View style={styles.footer}>
                  <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => setConfirmClose(false)}><Text style={styles.secondaryText}>Seguir editando</Text></Pressable>
                  <Pressable accessibilityRole="button" style={[styles.primaryButton, styles.dangerButton]} onPress={onClose}><Text style={styles.buttonText}>Descartar</Text></Pressable>
                </View>
              </View>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text role="heading" style={styles.modalTitle}>{task ? 'Editar Tarea' : 'Agregar Nueva Tarea'}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="Cerrar formulario" onPress={requestClose} style={styles.iconButton}><AppIcon name="close" /></Pressable>
                </View>
                <Text style={styles.description}>{task ? 'Modifica los detalles de la tarea.' : 'Completa los campos para crear una nueva tarea.'}</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>Nombre de la tarea *</Text>
                  <TextInput accessibilityLabel="Nombre de la tarea, obligatorio" value={draft.text} onChangeText={value => update('text', value)} placeholder="Ej: Limpiar la cocina" placeholderTextColor="#788092" style={[styles.input, errors.text && styles.invalid]} />
                  {fieldError('text')}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Asignado a *</Text>
                  <View style={styles.chips}>
                    {HOUSE_MEMBERS.map(member => <Pressable key={member} accessibilityRole="radio" accessibilityState={{ checked: draft.assignedTo === member }} onPress={() => update('assignedTo', member)} style={[styles.chip, draft.assignedTo === member && styles.chipSelected]}><Text style={[styles.chipText, draft.assignedTo === member && styles.chipSelectedText]}>{member}</Text></Pressable>)}
                  </View>
                  {fieldError('assignedTo')}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>¿Para qué fecha? * (DD/MM/AAAA)</Text>
                  <TextInput accessibilityLabel="Fecha de la tarea en formato día, mes y año" value={dueInput} onChangeText={value => { setDueInput(value); update('dueDate', parseDateInput(value)); }} placeholder="24/04/2026" placeholderTextColor="#788092" keyboardType="numbers-and-punctuation" maxLength={10} style={[styles.input, errors.dueDate && styles.invalid]} />
                  {fieldError('dueDate')}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>¿Cada cuánto se repite?</Text>
                  <View style={styles.chips}>
                    {REPEAT_OPTIONS.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: draft.repeatInterval === option }} onPress={() => update('repeatInterval', option)} style={[styles.chip, draft.repeatInterval === option && styles.chipSelected]}><Text style={[styles.chipText, draft.repeatInterval === option && styles.chipSelectedText]}>{option}</Text></Pressable>)}
                  </View>
                </View>
                {draft.repeatInterval !== 'No se repite' && <View style={styles.field}>
                  <Text style={styles.label}>¿Hasta cuándo? * (DD/MM/AAAA)</Text>
                  <TextInput accessibilityLabel="Fecha final de repetición en formato día, mes y año" value={untilInput} onChangeText={value => { setUntilInput(value); update('repeatUntil', parseDateInput(value)); }} placeholder="26/06/2026" placeholderTextColor="#788092" keyboardType="numbers-and-punctuation" maxLength={10} style={[styles.input, errors.repeatUntil && styles.invalid]} />
                  {fieldError('repeatUntil')}
                </View>}
                <View style={styles.field}>
                  <Text style={styles.label}>Notas (opcional)</Text>
                  <TextInput accessibilityLabel="Notas de la tarea" multiline value={draft.notes} onChangeText={value => update('notes', value)} placeholder="Agrega notas o detalles adicionales..." placeholderTextColor="#788092" style={[styles.input, styles.notesInput]} />
                </View>
                <View style={styles.footer}>
                  <Pressable accessibilityRole="button" onPress={requestClose} style={styles.secondaryButton}><Text style={styles.secondaryText}>Cancelar</Text></Pressable>
                  <Pressable accessibilityRole="button" onPress={save} style={({ pressed }) => [styles.primaryButton, task && styles.editButton, pressed && styles.pressed]}><Text style={styles.buttonText}>{task ? 'Guardar' : 'Agregar'}</Text></Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
