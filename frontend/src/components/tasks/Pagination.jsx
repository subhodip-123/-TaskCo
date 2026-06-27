import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pages, page + 1));

  return (
    <div className="flex items-center justify-between mt-4">
      <button onClick={prev} disabled={page === 1} className="btn-secondary gap-1.5">
        <HiChevronLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Page {page} of {pages}
      </span>
      <button onClick={next} disabled={page === pages} className="btn-secondary gap-1.5">
        Next <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
