import type { Task, RepeatInterval } from './tasks';

export const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const PERSON_COLORS: Record<string, string> = {
  Natalia: '#DF2D9C', Alejandro: '#35B948', Juan: '#5078FF', José: '#ED2849', Roberto: '#697386',
};
export const FREQUENCY_COLORS: Record<RepeatInterval, string> = {
  'No se repite': '#268A3A', Diario: '#3D59F5', 'Cada 3 días': '#9455D8',
  Semanal: '#DD289D', Quincenal: '#088AAB', Mensual: '#9A7200',
};

function date(value: string) { return new Date(`${value}T12:00:00Z`); }
function iso(value: Date) { return value.toISOString().slice(0, 10); }

export function addDays(value: string, days: number): string {
  const result = date(value);
  result.setUTCDate(result.getUTCDate() + days);
  return iso(result);
}
export function weekStart(value: string): string {
  return addDays(value, -((date(value).getUTCDay() + 6) % 7));
}
export function weekDates(value: string): string[] {
  const start = weekStart(value);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}
export function weekLabel(value: string): string {
  const start = date(weekStart(value));
  const end = date(addDays(weekStart(value), 6));
  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `${start.getUTCDate()} ${MONTHS[start.getUTCMonth()]} ${start.getUTCFullYear()} - ${end.getUTCDate()} ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  }
  if (start.getUTCMonth() !== end.getUTCMonth()) {
    return `${start.getUTCDate()} ${MONTHS[start.getUTCMonth()]} - ${end.getUTCDate()} ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  }
  return `${start.getUTCDate()}-${end.getUTCDate()} ${MONTHS[start.getUTCMonth()]} ${start.getUTCFullYear()}`;
}
export function monthLabel(value: string): string {
  const current = date(value);
  return `${MONTHS[current.getUTCMonth()]} ${current.getUTCFullYear()}`;
}
export function shiftMonth(value: string, offset: number): string {
  const result = date(value);
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + offset);
  return iso(result);
}
export function monthGrid(value: string): string[] {
  return Array.from({ length: 42 }, (_, index) => addDays(weekStart(`${value.slice(0, 7)}-01`), index));
}
export function todayDate(): string {
  const current = new Date();
  return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
}
export function groupWeekTasks(tasks: Task[], start: string): { date: string; dayIndex: number; data: Task[] }[] {
  return weekDates(start).map((value, dayIndex) => ({
    date: value, dayIndex,
    data: tasks.filter(task => !task.completed && task.dueDate === value),
  }));
}
