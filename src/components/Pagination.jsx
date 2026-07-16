import Link from 'next/link';

export default function Pagination({ page, totalPages, basePath, extraParams = '' }) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-center gap-4 mt-10 text-sm">
      <Link
        href={`${basePath}?page=${page - 1}${extraParams}`}
        aria-disabled={prevDisabled}
        className={`px-4 py-2 rounded-lg border border-white/10 transition ${
          prevDisabled
            ? 'opacity-30 pointer-events-none'
            : 'hover:border-white/30 hover:text-white text-gray-300'
        }`}
      >
        ← Previous
      </Link>
      <span className="text-gray-500">
        Page {page} of {totalPages}
      </span>
      <Link
        href={`${basePath}?page=${page + 1}${extraParams}`}
        aria-disabled={nextDisabled}
        className={`px-4 py-2 rounded-lg border border-white/10 transition ${
          nextDisabled
            ? 'opacity-30 pointer-events-none'
            : 'hover:border-white/30 hover:text-white text-gray-300'
        }`}
      >
        Next →
      </Link>
    </div>
  );
}
