export const CURRENT_USER = 'Natalia';
export const HOUSE_MEMBERS = ['Natalia', 'Alejandro', 'Juan', 'José'] as const;
export const REPEAT_OPTIONS = ['No se repite', 'Diario', 'Cada 3 días', 'Semanal', 'Quincenal', 'Mensual'] as const;
export type RepeatInterval = (typeof REPEAT_OPTIONS)[number];

export type Task = {
  id: string;
  text: string;
  assignedTo: string;
  dueDate: string;
  repeatInterval: RepeatInterval;
  repeatUntil: string;
  notes: string;
  completed: boolean;
};
export type TaskDraft = Omit<Task, 'id' | 'completed'>;

export function emptyTask(): TaskDraft {
  return { text: '', assignedTo: '', dueDate: '', repeatInterval: 'No se repite', repeatUntil: '', notes: '' };
}

// Use date-only strings and UTC fields so timezones cannot shift the selected day.
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseDateInput(value: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : '';
}

export function dateInputValue(value: string): string {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function formatTaskDate(value: string): string {
  if (!isValidDate(value)) return '';
  const [, month, day] = value.split('-');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${Number(day)} ${months[Number(month) - 1]}`;
}

export function validateTask(draft: TaskDraft): Partial<Record<keyof TaskDraft, string>> {
  const errors: Partial<Record<keyof TaskDraft, string>> = {};
  if (!draft.text.trim()) errors.text = 'El nombre de la tarea es obligatorio.';
  if (!(HOUSE_MEMBERS as readonly string[]).includes(draft.assignedTo)) errors.assignedTo = 'Selecciona un miembro del hogar.';
  if (!isValidDate(draft.dueDate)) errors.dueDate = 'Ingresa una fecha válida (DD/MM/AAAA).';
  if (draft.repeatInterval !== 'No se repite') {
    if (!isValidDate(draft.repeatUntil)) errors.repeatUntil = 'Indica una fecha final válida (DD/MM/AAAA).';
    else if (isValidDate(draft.dueDate) && draft.repeatUntil < draft.dueDate) errors.repeatUntil = 'La fecha final no puede ser anterior a la fecha de la tarea.';
  }
  return errors;
}

export const INITIAL_TASKS: Task[] = [
  ['Comprar comida', '2026-04-24', 'No se repite', ''],
  ['Lavar la ropa', '2026-04-26', 'Semanal', '2026-06-26'],
  ['Organizar despensa', '2026-04-23', 'Quincenal', '2026-07-23'],
  ['Pasear al perro', '2026-04-22', 'Diario', '2026-05-22'],
  ['Limpiar ventanas', '2026-04-28', 'Mensual', '2026-07-28'],
  ['Preparar almuerzo', '2026-04-23', 'Diario', '2026-05-23'],
  ['Ordenar habitación', '2026-04-27', 'Semanal', '2026-06-27'],
].map(([text, dueDate, repeatInterval, repeatUntil], index) => ({
  id: `sample-${index}`, text, dueDate, repeatInterval: repeatInterval as RepeatInterval,
  repeatUntil, assignedTo: CURRENT_USER, notes: '', completed: false,
}));
