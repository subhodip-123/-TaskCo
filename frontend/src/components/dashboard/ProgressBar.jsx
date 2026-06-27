export default function ProgressBar({ value = 0 }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-bold">Overall Progress</span>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Tasks completed</p>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">
          {value}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[11px] text-slate-400">0%</span>
        <span className="text-[11px] text-slate-400">100%</span>
      </div>
    </div>
  );
}
