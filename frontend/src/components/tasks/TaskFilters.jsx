import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

export default function TaskFilters({ filters, setFilters }) {
  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));

  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <HiOutlineMagnifyingGlass className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search tasks..."
            className="input pl-10"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className="input"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => update('priority', e.target.value)}
          className="input"
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => update('sortBy', e.target.value)}
          className="input"
        >
          <option value="createdAt">Newest first</option>
          <option value="dueDate">By due date</option>
          <option value="priority">By priority</option>
          <option value="title">By title</option>
        </select>
      </div>
    </div>
  );
}
