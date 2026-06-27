// The backend always returns dueDate as "YYYY-MM-DD". Parsing that string
// through new Date() treats it as UTC midnight and shifts the day for UTC-
// timezones. Splitting by "-" and using the Date constructor with numeric
// components creates a local midnight instead, which is correct everywhere.
const parseDateOnly = (date) => {
  const s = typeof date === 'string' ? date : new Date(date).toISOString();
  const [y, m, d] = s.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatDate = (date) => {
  if (!date) return '';
  return parseDateOnly(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isToday = (date) => {
  if (!date) return false;
  const d = parseDateOnly(date);
  const n = parseDateOnly(new Date().toISOString());
  return d.getTime() === n.getTime();
};

export const isOverdue = (date) => {
  if (!date) return false;
  return parseDateOnly(date) < parseDateOnly(new Date().toISOString()) && !isToday(date);
};

export const priorityColor = (p) => {
  if (p === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  if (p === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
};
