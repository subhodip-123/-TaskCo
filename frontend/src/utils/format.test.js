import { describe, it, expect } from 'vitest';
import { formatDate, isToday, isOverdue, priorityColor } from './format';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

describe('formatDate', () => {
  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('formats a YYYY-MM-DD string with month, day, and year', () => {
    const result = formatDate('2026-01-15');
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2026/);
  });

  it('formats a different date correctly', () => {
    const result = formatDate('2025-12-25');
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/25/);
    expect(result).toMatch(/2025/);
  });
});

describe('isToday', () => {
  it('returns false for null', () => {
    expect(isToday(null)).toBe(false);
  });

  it('returns true for today\'s date string', () => {
    expect(isToday(todayStr())).toBe(true);
  });

  it('returns false for yesterday', () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(isToday(str)).toBe(false);
  });

  it('returns false for tomorrow', () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(isToday(str)).toBe(false);
  });
});

describe('isOverdue', () => {
  it('returns false for null', () => {
    expect(isOverdue(null)).toBe(false);
  });

  it('returns true for a clearly past date', () => {
    expect(isOverdue('2020-01-01')).toBe(true);
  });

  it('returns false for today (not considered overdue)', () => {
    expect(isOverdue(todayStr())).toBe(false);
  });

  it('returns false for a future date', () => {
    expect(isOverdue('2099-12-31')).toBe(false);
  });
});

describe('priorityColor', () => {
  it('returns red-based classes for high priority', () => {
    expect(priorityColor('high')).toContain('red');
  });

  it('returns amber-based classes for medium priority', () => {
    expect(priorityColor('medium')).toContain('amber');
  });

  it('returns emerald-based classes for low priority', () => {
    expect(priorityColor('low')).toContain('emerald');
  });

  it('falls back to emerald classes for an unrecognised priority', () => {
    expect(priorityColor('urgent')).toContain('emerald');
  });

  it('returns dark-mode variants as well as light-mode classes', () => {
    const result = priorityColor('high');
    expect(result).toContain('dark:');
  });
});
