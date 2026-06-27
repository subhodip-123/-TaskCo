export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Start by creating your first item.',
  action,
}) {
  return (
    <div className="text-center py-12 px-4">
      <svg
        viewBox="0 0 200 160"
        className="mx-auto w-44 h-32 mb-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Card background */}
        <rect x="35" y="30" width="130" height="100" rx="12" fill="#e0e7ff" />
        <rect x="35" y="30" width="130" height="100" rx="12" fill="url(#cardGrad)" />
        {/* Lines */}
        <rect x="52" y="55" width="96" height="7" rx="3.5" fill="#a5b4fc" />
        <rect x="52" y="71" width="72" height="7" rx="3.5" fill="#c7d2fe" />
        <rect x="52" y="87" width="52" height="7" rx="3.5" fill="#c7d2fe" />
        {/* Check badge */}
        <circle cx="155" cy="38" r="16" fill="#6366f1" />
        <path
          d="M148 38 l5 5.5 l9 -9"
          stroke="#fff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="cardGrad" x1="35" y1="30" x2="165" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eef2ff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
      </svg>
      <h3 className="text-base font-bold mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs mx-auto">
        {description}
      </p>
      {action}
    </div>
  );
}
