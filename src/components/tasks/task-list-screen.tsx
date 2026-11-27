import { useThemedStyles } from '@/contexts/appearance-context';
import { useState } from 'react';
import { Pressable, SectionList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskEditor } from '@/components/tasks/task-editor';
import { AppIcon } from '@/components/ui/app-icon';
import { useTasks } from '@/contexts/task-context';
import { styles as baseStyles } from '@/styles/tasks.styles';
import { CURRENT_USER, formatTaskDate, type Task } from '@/utils/tasks';

export function TaskListScreen() {
  const styles = useThemedStyles(baseStyles);
  const { tasks, saveTask, deleteTask, toggleTask } = useTasks();
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<{ task: Task | null } | null>(null);
  const ownTasks = tasks.filter(task => task.assignedTo === CURRENT_USER);
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = ownTasks.filter(task => normalize(task.text).includes(normalize(query.trim())));
  const pending = filtered.filter(task => !task.completed);
  const completed = filtered.filter(task => task.completed);
  const sections = [{ title: 'Pendientes', data: pending }, ...(completed.length ? [{ title: 'Completadas', data: completed }] : [])];

  function renderTask({ item: task }: { item: Task }) {
    return (
      <View style={styles.card}>
        <Pressable accessibilityRole="button" accessibilityHint="Abre el editor de la tarea" style={({ pressed }) => pressed && styles.pressed} onPress={() => setEditor({ task })}>
          <Text style={[styles.taskName, task.completed && styles.completedName]}>{task.text}</Text>
          <View style={styles.metadata}>
            <View style={styles.date}><AppIcon name="calendar" size={13} /><Text style={styles.dateText}>{formatTaskDate(task.dueDate)}</Text></View>
            {task.repeatInterval !== 'No se repite' && <View style={styles.badge}><Text style={styles.badgeText}>{task.repeatInterval}{task.repeatUntil ? ` (hasta ${formatTaskDate(task.repeatUntil)})` : ''}</Text></View>}
          </View>
          {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
        </Pressable>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }} accessibilityLabel={`${task.completed ? 'Marcar pendiente' : 'Completar'}: ${task.text}`} style={styles.completeAction} onPress={() => toggleTask(task.id)}>
          <AppIcon name="check" color="#39803C" size={15} /><Text style={styles.completeText}>{task.completed ? 'Marcar pendiente' : 'Marcar completada'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.header, styles.rightAlignedArea]}>
        <View style={styles.headerRow}>
          <View style={styles.profile}><AppIcon name="user" size={15} color="#FFFFFF" /><Text style={styles.profileName}>{CURRENT_USER}</Text></View>
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right']} style={styles.rightAlignedArea}>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} onPress={() => setEditor({ task: null })}><AppIcon name="plus" color="#FFFFFF" size={20} /></Pressable>
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
          <View style={styles.search}>
            <AppIcon name="search" size={18} color="#9AA2B2" />
            <TextInput accessibilityLabel="Buscar tareas" placeholder="Buscar tareas..." placeholderTextColor="#788092" value={query} onChangeText={setQuery} style={styles.searchInput} />
            {query ? <Pressable accessibilityRole="button" accessibilityLabel="Limpiar búsqueda" style={styles.iconButton} onPress={() => setQuery('')}><AppIcon name="close" size={18} /></Pressable> : <View style={{ width: 12 }} />}
          </View>
        </>}
      />
      {editor && <TaskEditor task={editor.task} onSave={saveTask} onDelete={deleteTask} onClose={() => setEditor(null)} />}
    </View>
  );
}
