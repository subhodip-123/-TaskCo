import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

// Backend returns dueDate as "YYYY-MM-DD"; slice it directly rather than
// passing through new Date() which would apply UTC and shift the day.
const toInputDate = (date) => {
  if (!date) return '';
  const s = typeof date === 'string' ? date : new Date(date).toISOString();
  return s.slice(0, 10);
};

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const empty = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'general',
  dueDate: '',
};

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600' },
  { value: 'high', label: 'High', color: 'text-red-600' },
];

export default function TaskForm({ initial, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const initialNormalized = useRef(null);

  useEffect(() => {
    if (initial) {
      const normalized = {
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'medium',
        category: initial.category || 'general',
        dueDate: initial.dueDate ? toInputDate(initial.dueDate) : '',
      };
      initialNormalized.current = normalized;
      setForm(normalized);
    }
  }, [initial]);

  const isDirty =
    !initial ||
    !initialNormalized.current ||
    Object.keys(form).some((key) => form[key] !== initialNormalized.current[key]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (form.dueDate && form.dueDate < todayStr()) {
      toast.error('Due date cannot be in the past');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) payload.dueDate = null;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={change}
          className="input text-base font-medium"
          placeholder="What needs to be done?"
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={change}
          rows="3"
          className="input resize-none"
          placeholder="Add more detail (optional)"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Priority</label>
          <select name="priority" value={form.priority} onChange={change} className="input">
            {priorityOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={change}
            className="input"
            placeholder="e.g. work, personal"
          />
        </div>
        <div>
          <label className="label">Due date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            min={todayStr()}
            onChange={change}
            className="input"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting || !isDirty}
          className="btn-primary"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {initial && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {isDirty ? 'Unsaved changes' : 'No changes'}
          </span>
        )}
      </div>
    </form>
  );
}
