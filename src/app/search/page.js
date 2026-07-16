import connectDB from '@/lib/db';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SearchPageBar from '@/components/SearchPageBar';

const PAGE_SIZE = 10;

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || '';
  const page = Math.max(1, parseInt(params?.page || '1', 10));

  await connectDB();

  const filter = { status: 'published' };
  if (q) filter.$text = { $search: q };

  const [posts, total] = q
    ? await Promise.all([
        Post.find(filter)
          .populate('author', 'name avatar')
          .sort({ createdAt: -1 })
          .skip((page - 1) * PAGE_SIZE)
          .limit(PAGE_SIZE)
          .lean(),
        Post.countDocuments(filter),
      ])
    : [[], 0];

  const serialized = JSON.parse(JSON.stringify(posts));

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <SearchPageBar initialQuery={q} />
      </div>

      {q && (
        <p className="text-sm text-gray-500 mb-6">
          {total} result{total !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
        </p>
      )}

      {q && serialized.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg mb-1">No posts found.</p>
          <p className="text-sm">Try a different keyword or tag.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serialized.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE) || 1}
        basePath="/search"
        extraParams={q ? `&q=${encodeURIComponent(q)}` : ''}
      />
    </main>
  );
}
