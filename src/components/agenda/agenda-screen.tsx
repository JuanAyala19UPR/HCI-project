import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/app-icon';
import { useTasks } from '@/contexts/task-context';
import { styles } from '@/styles/agenda.styles';
import { addDays, FREQUENCY_COLORS, groupWeekTasks, monthGrid, monthLabel, PERSON_COLORS, shiftMonth, todayDate, WEEKDAYS, weekLabel, weekStart } from '@/utils/weekly_schedule';
import { formatTaskDate, HOUSE_MEMBERS } from '@/utils/tasks';

export function AgendaScreen() {
  const { tasks } = useTasks();
  // Start with the reference's demo week. The picker also provides a Today action.
  const [start, setStart] = useState('2026-04-20');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(start);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const week = useMemo(() => groupWeekTasks(tasks, start), [tasks, start]);
  const sections = week.filter(day => selectedDay ? day.date === selectedDay : day.data.length > 0);
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const pendingDates = new Set(tasks.filter(task => !task.completed).map(task => task.dueDate));
  const today = todayDate();

  function selectWeek(date: string) {
    setStart(weekStart(date));
    setSelectedDay(null);
    setCalendarOpen(false);
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <View style={styles.weekNav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Semana anterior" style={styles.iconButton} onPress={() => selectWeek(addDays(start, -7))}><AppIcon name="chevronLeft" color="#FFFFFF" size={20} /></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Seleccionar semana. ${weekLabel(start)}`} style={styles.weekButton} onPress={() => { setCalendarMonth(start); setCalendarOpen(true); }}>
            <Text style={styles.weekText}>{weekLabel(start)}</Text><AppIcon name="chevronDown" color="#FFFFFF" size={18} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Semana siguiente" style={styles.iconButton} onPress={() => selectWeek(addDays(start, 7))}><AppIcon name="chevronRight" color="#FFFFFF" size={20} /></Pressable>
        </View>
        <View style={styles.headingRow}>
          <Text role="heading" style={styles.title}>Agenda Semanal</Text>
          {selectedDay && <Pressable accessibilityRole="button" style={styles.allButton} onPress={() => setSelectedDay(null)}><Text style={styles.allText}>Ver todas</Text></Pressable>}
        </View>
      </SafeAreaView>
      <SectionList
        style={styles.flex}
        contentContainerStyle={styles.content}
        sections={sections}
        keyExtractor={task => task.id}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={<>
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Leyenda de la agenda:</Text>
            <View style={styles.legendExplanation}><View style={styles.greenDot} /><Text style={styles.legendText}><Text style={styles.bold}>Punto verde</Text> = Día con tareas programadas</Text></View>
            <Text style={styles.legendTitle}>Colores según persona:</Text>
            <View style={styles.people}>
              {HOUSE_MEMBERS.map(person => <View key={person} style={styles.person}><View style={[styles.personDot, { backgroundColor: PERSON_COLORS[person] ?? '#697386' }]} /><Text style={styles.legendText}>{person}</Text></View>)}
            </View>
          </View>
          <View style={styles.days}>
            {week.map(day => <Pressable key={day.date} accessibilityRole="button" accessibilityState={{ selected: selectedDay === day.date }} accessibilityLabel={`${WEEKDAYS[day.dayIndex]} ${formatTaskDate(day.date)}, ${day.data.length} tareas`} style={[styles.day, selectedDay === day.date && styles.selectedDay]} onPress={() => setSelectedDay(current => current === day.date ? null : day.date)}>
              <Text style={styles.dayName}>{WEEKDAYS[day.dayIndex]}</Text>
              <Text style={[styles.dayNumber, selectedDay === day.date && styles.selectedNumber, today === day.date && styles.todayNumber]}>{Number(day.date.slice(8))}</Text>
              <View style={styles.dotSpace}>{day.data.length > 0 && <View style={styles.greenDot} />}</View>
            </Pressable>)}
          </View>
        </>}
        renderSectionHeader={({ section }) => <View style={styles.section}><Text role="heading" style={styles.sectionTitle}>{WEEKDAYS[section.dayIndex]} {Number(section.date.slice(8))}</Text><Text style={styles.count}>({section.data.length} tarea{section.data.length === 1 ? '' : 's'})</Text></View>}
        renderSectionFooter={({ section }) => section.data.length ? <View style={styles.sectionSpace} /> : <Text style={styles.empty}>No hay tareas para este día.</Text>}
        renderItem={({ item: task }) => <Pressable accessibilityRole="button" accessibilityLabel={`Ver detalles: ${task.text}, ${task.assignedTo}`} style={({ pressed }) => [styles.task, pressed && styles.pressed]} onPress={() => setSelectedTaskId(task.id)}>
          <View style={styles.taskMeta}>
            <Text style={[styles.metaText, { color: PERSON_COLORS[task.assignedTo] ?? '#697386' }]}>{task.assignedTo || 'Sin asignar'}</Text>
            {task.repeatInterval !== 'No se repite' && <Text style={[styles.metaText, { color: FREQUENCY_COLORS[task.repeatInterval] }]}>• {task.repeatInterval}</Text>}
          </View>
          <Text style={styles.taskTitle}>{task.text}</Text>
          {task.notes ? <Text style={styles.notesHint}>Tiene notas</Text> : null}
        </Pressable>}
        ListEmptyComponent={<Text style={styles.empty}>No hay tareas programadas para esta semana.</Text>}
      />

      <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalCard} accessibilityViewIsModal>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalHeader}><Text role="heading" style={styles.modalTitle}>Selecciona una semana</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar calendario" style={styles.iconButton} onPress={() => setCalendarOpen(false)}><AppIcon name="close" /></Pressable></View>
                <Text style={styles.description}>Toca cualquier día para ver su semana completa.</Text>
                <View style={styles.calendarNav}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Mes anterior" style={styles.iconButton} onPress={() => setCalendarMonth(value => shiftMonth(value, -1))}><AppIcon name="chevronLeft" /></Pressable>
                  <Text style={styles.calendarMonth}>{monthLabel(calendarMonth)}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="Mes siguiente" style={styles.iconButton} onPress={() => setCalendarMonth(value => shiftMonth(value, 1))}><AppIcon name="chevronRight" /></Pressable>
                </View>
                <View style={styles.calendarGrid}>
                  {WEEKDAYS.map(day => <Text key={day} style={styles.calendarHeading}>{day}</Text>)}
                  {monthGrid(calendarMonth).map(value => <Pressable key={value} accessibilityRole="button" accessibilityLabel={`${formatTaskDate(value)} ${value.slice(0, 4)}${pendingDates.has(value) ? ', con tareas' : ''}`} accessibilityState={{ selected: weekStart(value) === start }} style={[styles.calendarCell, weekStart(value) === start && styles.selectedDay]} onPress={() => selectWeek(value)}>
                    <Text style={[styles.calendarNumber, value.slice(0, 7) !== calendarMonth.slice(0, 7) && styles.outsideMonth, today === value && styles.todayNumber]}>{Number(value.slice(8))}</Text>
                    <View style={styles.dotSpace}>{pendingDates.has(value) && <View style={styles.greenDot} />}</View>
                  </Pressable>)}
                </View>
                <Pressable accessibilityRole="button" style={styles.button} onPress={() => selectWeek(today)}><Text style={styles.buttonText}>Ir a esta semana</Text></Pressable>
              </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal visible={!!selectedTask} transparent animationType="fade" onRequestClose={() => setSelectedTaskId(null)}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalCard} accessibilityViewIsModal>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalHeader}><Text role="heading" style={styles.modalTitle}>Detalles de la tarea</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar detalles" style={styles.iconButton} onPress={() => setSelectedTaskId(null)}><AppIcon name="close" /></Pressable></View>
                {selectedTask && <>
                  <Text style={styles.detailTitle}>{selectedTask.text}</Text>
                  <View style={styles.detailRow}><Text style={styles.detailText}>Asignado a:</Text><Text style={[styles.detailText, styles.bold, { color: PERSON_COLORS[selectedTask.assignedTo] ?? '#697386' }]}>{selectedTask.assignedTo}</Text></View>
                  <View style={styles.detailRow}><AppIcon name="calendar" size={18} /><Text style={styles.detailText}>{formatTaskDate(selectedTask.dueDate)} {selectedTask.dueDate.slice(0, 4)}</Text></View>
                  <View style={styles.detailRow}><Text style={styles.detailText}>Frecuencia:</Text><Text style={[styles.detailText, { color: FREQUENCY_COLORS[selectedTask.repeatInterval] }]}>{selectedTask.repeatInterval}</Text></View>
                  {selectedTask.repeatInterval !== 'No se repite' && selectedTask.repeatUntil ? <View style={styles.detailRow}><Text style={styles.detailText}>Se repite hasta:</Text><Text style={styles.detailText}>{formatTaskDate(selectedTask.repeatUntil)} {selectedTask.repeatUntil.slice(0, 4)}</Text></View> : null}
                  {selectedTask.notes ? <View style={styles.detailNotes}><Text style={[styles.detailText, styles.bold]}>Notas:</Text><Text style={styles.detailText}>{selectedTask.notes}</Text></View> : null}
                </>}
                <Pressable accessibilityRole="button" style={styles.button} onPress={() => setSelectedTaskId(null)}><Text style={styles.buttonText}>Cerrar</Text></Pressable>
              </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
