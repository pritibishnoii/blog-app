import Link from 'next/link';

export default function TagChips({ tags = [], activeTag }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/?tag=${encodeURIComponent(tag)}`}
          className={`text-xs px-2.5 py-1 rounded-full border transition ${
            activeTag === tag
              ? 'bg-primary/20 border-primary text-primary'
              : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
          }`}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
