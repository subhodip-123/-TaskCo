import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlinePlus,
} from 'react-icons/hi2';
import { taskService } from '../services/task.service';
import StatCard from '../components/dashboard/StatCard.jsx';
import ProgressBar from '../components/dashboard/ProgressBar.jsx';
import PriorityChart from '../components/dashboard/PriorityChart.jsx';
import { TaskSkeleton } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDate } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService
      .stats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Here's what's on your plate today.</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          <HiOutlinePlus className="w-4 h-4" /> New task
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total tasks"
          value={stats.total}
          icon={HiOutlineClipboardDocumentList}
          color="brand"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={HiOutlineCheckCircle}
          color="green"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={HiOutlineClock}
          color="amber"
        />
        <StatCard
          label="Due today"
          value={stats.todaysTasks?.length || 0}
          icon={HiOutlineFire}
          color="rose"
        />
      </div>

      {/* Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ProgressBar value={stats.progress} />
          <div className="card p-5">
            <div className="mb-4">
              <h3 className="font-bold text-sm">Today's Tasks</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {stats.todaysTasks?.length || 0} tasks due today
              </p>
            </div>
            {stats.todaysTasks?.length ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.todaysTasks.map((t) => (
                  <li key={t._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          t.completed ? 'bg-emerald-500' : 'bg-brand-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            t.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {t.title}
                        </p>
                        {t.category && (
                          <p className="text-xs text-slate-400 dark:text-slate-500">{t.category}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {formatDate(t.dueDate)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Nothing due today" description="Enjoy a calm day or plan ahead." />
            )}
          </div>
        </div>
        <PriorityChart data={stats.byPriority} />
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <div className="mb-4">
          <h3 className="font-bold text-sm">Recent Activity</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest task updates</p>
        </div>
        {stats.recent?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.recent.map((t) => (
              <li key={t._id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      t.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <span className="text-sm font-medium truncate">{t.title}</span>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  Updated {formatDate(t.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
