import { useState } from 'react';
import { Modal, Pressable, SectionList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskEditor } from '@/components/tasks/task-editor';
import { AppIcon } from '@/components/ui/app-icon';
import { useTasks } from '@/contexts/task-context';
import { styles } from '@/styles/tasks.styles';
import { CURRENT_USER, formatTaskDate, type Task } from '@/utils/tasks';

export function TaskListScreen() {
  const { tasks, saveTask, deleteTask, toggleTask } = useTasks();
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<{ task: Task | null } | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const ownTasks = tasks.filter(task => task.assignedTo === CURRENT_USER);
  const pendingCount = ownTasks.filter(task => !task.completed).length;
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = ownTasks.filter(task => normalize(task.text).includes(normalize(query.trim())));
  const pending = filtered.filter(task => !task.completed);
  const completed = filtered.filter(task => task.completed);
  const sections = [{ title: 'Pendientes', data: pending }, ...(completed.length ? [{ title: 'Completadas', data: completed }] : [])];

  function renderTask({ item: task }: { item: Task }) {
    return (
      <View style={styles.card}>
        <View style={styles.taskRow}>
          <View style={styles.taskBody}>
            <Text style={[styles.taskName, task.completed && styles.completedName]}>{task.text}</Text>
            <View style={styles.metadata}>
              <View style={styles.date}><AppIcon name="calendar" size={13} /><Text style={styles.dateText}>{formatTaskDate(task.dueDate)}</Text></View>
              {task.repeatInterval !== 'No se repite' && <View style={styles.badge}><Text style={styles.badgeText}>{task.repeatInterval}{task.repeatUntil ? ` (hasta ${formatTaskDate(task.repeatUntil)})` : ''}</Text></View>}
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Editar ${task.text}`} style={styles.iconButton} onPress={() => setEditor({ task })}><AppIcon name="edit" color="#5078FF" size={20} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${task.text}`} style={styles.iconButton} onPress={() => setDeleting(task)}><AppIcon name="trash" color="#FF3048" size={20} /></Pressable>
          </View>
        </View>
        {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }} accessibilityLabel={`${task.completed ? 'Marcar pendiente' : 'Completar'}: ${task.text}`} style={styles.completeAction} onPress={() => toggleTask(task.id)}>
          <AppIcon name="check" color="#39803C" size={15} /><Text style={styles.completeText}>{task.completed ? 'Marcar pendiente' : 'Marcar completada'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <View style={styles.headerRow}>
          <Text role="heading" style={styles.title}>Lista de Tareas</Text>
          <View style={styles.profile}><AppIcon name="user" size={15} color="#FFFFFF" /><Text style={styles.profileName}>{CURRENT_USER}</Text></View>
        </View>
        <Text accessibilityLiveRegion="polite" style={styles.count}>{pendingCount} pendiente{pendingCount === 1 ? '' : 's'}</Text>
      </SafeAreaView>
      <SectionList
        style={styles.flex}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={task => task.id}
        renderItem={renderTask}
        renderSectionHeader={({ section }) => <Text role="heading" style={styles.section}>{section.title}</Text>}
        renderSectionFooter={({ section }) => section.title === 'Pendientes' && !section.data.length ? <Text style={styles.empty}>{query.trim() ? 'No se encontraron tareas pendientes.' : 'No tienes tareas pendientes.'}</Text> : null}
        ListHeaderComponent={<>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={() => setEditor({ task: null })}><AppIcon name="plus" color="#FFFFFF" size={20} /><Text style={styles.buttonText}>Agregar Nueva Tarea</Text></Pressable>
          <View style={styles.search}>
            <AppIcon name="search" size={18} color="#9AA2B2" />
            <TextInput accessibilityLabel="Buscar tareas" placeholder="Buscar tareas..." placeholderTextColor="#788092" value={query} onChangeText={setQuery} style={styles.searchInput} />
            {query ? <Pressable accessibilityRole="button" accessibilityLabel="Limpiar búsqueda" style={styles.iconButton} onPress={() => setQuery('')}><AppIcon name="close" size={18} /></Pressable> : <View style={{ width: 12 }} />}
          </View>
        </>}
      />
      {editor && <TaskEditor task={editor.task} onSave={saveTask} onClose={() => setEditor(null)} />}
      <Modal visible={!!deleting} transparent animationType="fade" onRequestClose={() => setDeleting(null)}>
        <View style={styles.overlay}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            <View style={styles.modalContent}>
              <Text role="heading" style={styles.modalTitle}>¿Eliminar tarea?</Text>
              <Text style={styles.description}>Se eliminará «{deleting?.text}». Esta acción no se puede deshacer.</Text>
              <View style={styles.footer}>
                <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => setDeleting(null)}><Text style={styles.secondaryText}>Cancelar</Text></Pressable>
                <Pressable accessibilityRole="button" style={[styles.primaryButton, styles.dangerButton]} onPress={() => { if (deleting) deleteTask(deleting.id); setDeleting(null); }}><Text style={styles.buttonText}>Eliminar</Text></Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
