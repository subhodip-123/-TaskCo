export default function StatCard({ label, value, icon: Icon, color = 'brand' }) {
  const gradients = {
    brand: 'from-brand-500 to-violet-600',
    green: 'from-emerald-400 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-pink-600',
  };
  const glows = {
    brand: 'shadow-brand-500/30',
    green: 'shadow-emerald-500/30',
    amber: 'shadow-amber-500/30',
    rose: 'shadow-rose-500/30',
  };

  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-300">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${gradients[color]} shadow-lg ${glows[color]}`}
      >
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p className="text-3xl font-bold tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
