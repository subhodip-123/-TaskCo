import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0f14] p-6">
      <div className="text-center">
        <p className="text-8xl font-bold bg-gradient-to-br from-brand-500 to-violet-600 bg-clip-text text-transparent leading-none mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Back home
        </Link>
      </div>
    </div>
  );
}
